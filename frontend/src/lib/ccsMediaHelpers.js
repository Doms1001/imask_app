// src/lib/ccsMediaHelpers.js
// Shared helper for ALL departments (CCS, CBA, CAS, COA, COE, CCJ)

import "react-native-url-polyfill/auto";
import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";
import { supabase } from "./supabaseClient";
import {
  getCachedImage,
  cacheDownloadImage,
  saveFeesCache,
  loadFeesCache,
} from "./appCache";

const BUCKET = "department_images";
const MEDIA_TABLE = "department_media";
const FEES_TABLE = "department_fees";

/* ======================================================================== */
/*  FILE / STORAGE HELPERS                                                  */
/* ======================================================================== */

// Safely get file extension from URI
function getExt(uri) {
  if (!uri) return "png";
  const clean = uri.split("?")[0];
  const ext = clean.split(".").pop().toLowerCase();
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return ext;
  return "png";
}

/**
 * Upload image for ANY department.
 * Storage path:  dept/slot-timestamp.ext
 */
export async function uploadDeptMedia(dept, slot, localUri) {
  try {
    const info = await FileSystem.getInfoAsync(localUri);
    if (!info.exists) return null;

    const b64 = await FileSystem.readAsStringAsync(localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const bin = decode(b64);
    const ext = getExt(localUri);
    const fileName = `${dept}/${slot}-${Date.now()}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, bin, {
        contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
        upsert: true,
      });

    if (uploadErr) {
      console.log("[uploadDeptMedia] upload error:", uploadErr);
      return null;
    }

    // Get public URL
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
    const publicUrl = data?.publicUrl;

    // Save mapping to department_media
    const { error: dbErr } = await supabase
      .from(MEDIA_TABLE)
      .upsert(
        {
          department: dept,
          slot,
          image_url: publicUrl,
        },
        { onConflict: "department,slot" }
      );

    if (dbErr) {
      console.log("[uploadDeptMedia] db error:", dbErr);
      return null;
    }

    // ⭐ NEW: also update local cache so new image works offline immediately
    try {
      if (publicUrl) {
        await cacheDownloadImage(dept, slot, publicUrl);
      }
    } catch (cacheErr) {
      console.log("[uploadDeptMedia] cache error:", cacheErr);
      // we still return publicUrl even if caching fails
    }

    return publicUrl;
  } catch (err) {
    console.log("[uploadDeptMedia] fatal:", err);
    return null;
  }
}

/**
 * Get image URL for ANY department + slot.
 * Now offline-first: tries cache, then Supabase, then caches it.
 */
export async function getDeptMediaUrl(dept, slot) {
  // ⭐ 1) Try local cached file first (works offline)
  try {
    const cachedUri = await getCachedImage(dept, slot);
    if (cachedUri) {
      return cachedUri; // file:// URI
    }
  } catch (cacheErr) {
    console.log("[getDeptMediaUrl] cache read error:", cacheErr);
  }

  // ⭐ 2) Fallback: online from Supabase
  try {
    const { data, error } = await supabase
      .from(MEDIA_TABLE)
      .select("image_url")
      .eq("department", dept)
      .eq("slot", slot)
      .maybeSingle();

    if (error) throw error;

    const url = data?.image_url || null;
    if (!url) return null;

    // ⭐ 3) Cache it for next time (offline)
    try {
      const uri = await cacheDownloadImage(dept, slot, url);
      return uri || url; // prefer cached file, fallback to remote
    } catch (cacheErr) {
      console.log("[getDeptMediaUrl] cacheDownloadImage error:", cacheErr);
      return url; // still usable online
    }
  } catch (err) {
    console.log("[getDeptMediaUrl] error:", err);
    return null;
  }
}

/**
 * Load ALL media for one department.
 * Returns: { slotKey: url, ... }
 * (We leave this online-only for now; per-slot calls use the cache.)
 */
export async function loadDeptMedia(dept) {
  try {
    const { data, error } = await supabase
      .from(MEDIA_TABLE)
      .select("slot, image_url")
      .eq("department", dept);

    if (error) throw error;

    const map = {};
    (data || []).forEach((row) => {
      map[row.slot] = row.image_url;
    });

    return map;
  } catch (err) {
    console.log("[loadDeptMedia] error:", err);
    return {};
  }
}

/* ======================================================================== */
/*  FEES HELPERS (F8 screens)                                               */
/*  Uses TABLE: department_fees                                             */
/* ======================================================================== */

/**
 * Save F8 fees for a department.
 * Table: department_fees
 * Row columns:
 *   dept, sem, year, acadYear,
 *   tuition, lab, nonLab, misc, nstp, otherFee,
 *   discount, down
 */
export async function saveDeptFees(dept, payload) {
  try {
    const { error } = await supabase.from(FEES_TABLE).upsert(
      {
        dept,
        ...payload,
      },
      {
        onConflict: "dept", // one row per department
      }
    );

    if (error) throw error;

    // ⭐ NEW: refresh cache with latest row
    try {
      const fresh = await loadDeptFees(dept);
      if (fresh) {
        await saveFeesCache(dept, fresh);
      }
    } catch (cacheErr) {
      console.log("[saveDeptFees] cache update error:", cacheErr);
    }

    return true;
  } catch (err) {
    console.log("[saveDeptFees] error:", err);
    return false;
  }
}

/**
 * Load F8 fees for a department.
 * Returns the full row or null.
 * Now: online-first, offline fallback.
 */
export async function loadDeptFees(dept) {
  try {
    const { data, error } = await supabase
      .from(FEES_TABLE)
      .select("*")
      .eq("dept", dept)
      .maybeSingle();

    if (error) throw error;

    const row = data || null;

    // ⭐ NEW: update cache when online works
    try {
      if (row) {
        await saveFeesCache(dept, row);
      }
    } catch (cacheErr) {
      console.log("[loadDeptFees] cache save error:", cacheErr);
    }

    return row;
  } catch (err) {
    console.log("[loadDeptFees] error:", err);

    // ⭐ NEW: fallback to cached fees if Supabase fails (offline mode)
    try {
      const cached = await loadFeesCache(dept);
      return cached || null;
    } catch (cacheErr) {
      console.log("[loadDeptFees] cache load error:", cacheErr);
      return null;
    }
  }
}

/* ======================================================================== */
/*  CONVENIENCE WRAPPERS PER DEPARTMENT                                     */
/*  (So screens can keep using getCcsMediaUrl, loadCasFees, etc.)           */
/* ======================================================================== */

// ---- CCS ----
export const uploadCcsMedia = (slot, uri) =>
  uploadDeptMedia("CCS", slot, uri);
export const getCcsMediaUrl = (slot) => getDeptMediaUrl("CCS", slot);
export const loadCcsMedia = () => loadDeptMedia("CCS");
export const saveCcsFees = (payload) => saveDeptFees("CCS", payload);
export const loadCcsFees = () => loadDeptFees("CCS");

// ---- CBA ----
export const uploadCbaMedia = (slot, uri) =>
  uploadDeptMedia("CBA", slot, uri);
export const getCbaMediaUrl = (slot) => getDeptMediaUrl("CBA", slot);
export const loadCbaMedia = () => loadDeptMedia("CBA");
export const saveCbaFees = (payload) => saveDeptFees("CBA", payload);
export const loadCbaFees = () => loadDeptFees("CBA");

// ---- CAS ----
export const uploadCasMedia = (slot, uri) =>
  uploadDeptMedia("CAS", slot, uri);
export const getCasMediaUrl = (slot) => getDeptMediaUrl("CAS", slot);
export const loadCasMedia = () => loadDeptMedia("CAS");
export const saveCasFees = (payload) => saveDeptFees("CAS", payload);
export const loadCasFees = () => loadDeptFees("CAS");

// ---- COA ----
export const uploadCoaMedia = (slot, uri) =>
  uploadDeptMedia("COA", slot, uri);
export const getCoaMediaUrl = (slot) => getDeptMediaUrl("COA", slot);
export const loadCoaMedia = () => loadDeptMedia("COA");
export const saveCoaFees = (payload) => saveDeptFees("COA", payload);
export const loadCoaFees = () => loadDeptFees("COA");

// ---- COE ----
export const uploadCoeMedia = (slot, uri) =>
  uploadDeptMedia("COE", slot, uri);
export const getCoeMediaUrl = (slot) => getDeptMediaUrl("COE", slot);
export const loadCoeMedia = () => loadDeptMedia("COE");
export const saveCoeFees = (payload) => saveDeptFees("COE", payload);
export const loadCoeFees = () => loadDeptFees("COE");

// ---- CCJ ----
export const uploadCcjMedia = (slot, uri) =>
  uploadDeptMedia("CCJ", slot, uri);
export const getCcjMediaUrl = (slot) => getDeptMediaUrl("CCJ", slot);
export const loadCcjMedia = () => loadDeptMedia("CCJ");
export const saveCcjFees = (payload) => saveDeptFees("CCJ", payload);
export const loadCcjFees = () => loadDeptFees("CCJ");
