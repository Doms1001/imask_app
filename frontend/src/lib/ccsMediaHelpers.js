// src/lib/ccsMediaHelpers.js
// All CCS images + tuition config helpers

import "react-native-url-polyfill/auto";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { supabase } from "../services/supabaseClient";

const CCS_BUCKET = "department_images"; // your bucket
const CCS_DEPT = "CCS";

/**
 * Upload one CCS image (newsMain, eventsTop, etc.) to Storage + department_media
 */
export async function uploadCcsMedia(slot, localUri) {
  try {
    console.log("[uploadCcsMedia] slot =", slot, "uri =", localUri);

    if (!localUri) {
      console.log("[uploadCcsMedia] no localUri, abort");
      return null;
    }

    // 1) Read file as base64
    const base64 = await FileSystem.readAsStringAsync(localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // 2) Convert base64 → ArrayBuffer (supabase-js accepts this in React Native)
    const arrayBuffer = decode(base64);

    // 3) Build file name + content type
    const extMatch = localUri.match(/\.([a-zA-Z0-9]+)$/);
    const fileExt = (extMatch ? extMatch[1] : "jpg").toLowerCase();
    const mime =
      fileExt === "jpg" || fileExt === "jpeg"
        ? "image/jpeg"
        : fileExt === "png"
        ? "image/png"
        : `image/${fileExt}`;

    const path = `CCS/${slot}-${Date.now()}.${fileExt}`;

    // 4) Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(CCS_BUCKET)
      .upload(path, arrayBuffer, {
        contentType: mime,
        upsert: true,
      });

    if (uploadError) {
      console.log("[uploadCcsMedia] storage upload error:", uploadError);
      return null;
    }

    console.log("[uploadCcsMedia] uploadData:", uploadData);

    // 5) Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(CCS_BUCKET).getPublicUrl(path);

    console.log("[uploadCcsMedia] publicUrl =", publicUrl);

    // 6) Save mapping in department_media
    const { error: dbError } = await supabase
      .from("department_media")
      .upsert(
        {
          department: CCS_DEPT,
          slot,
          image_url: publicUrl,
        },
        { onConflict: "department,slot" }
      );

    if (dbError) {
      console.log("[uploadCcsMedia] db upsert error:", dbError);
      return null;
    }

    return publicUrl;
  } catch (err) {
    console.log("[uploadCcsMedia] unexpected error:", err);
    return null;
  }
}

/**
 * Get image URL for a CCS slot from department_media
 */
export async function getCcsMediaUrl(slot) {
  try {
    const { data, error } = await supabase
      .from("department_media")
      .select("image_url")
      .eq("department", CCS_DEPT)
      .eq("slot", slot)
      .maybeSingle();

    if (error) throw error;
    if (!data) return null;
    return data.image_url || null;
  } catch (err) {
    console.log("[getCcsMediaUrl] error:", err);
    return null;
  }
}

/**
 * Load *all* CCS media as { slot: url, ... } – so AdminScreen can preload previews
 */
export async function loadCcsMedia() {
  try {
    const { data, error } = await supabase
      .from("department_media")
      .select("slot, image_url")
      .eq("department", CCS_DEPT);

    if (error) throw error;
    if (!data) return {};

    const map = {};
    for (const row of data) {
      map[row.slot] = row.image_url;
    }
    console.log("[loadCcsMedia] loaded media:", map);
    return map;
  } catch (err) {
    console.log("[loadCcsMedia] error:", err);
    return {};
  }
}

/**
 * Save CCS tuition + fees (used by AdminScreen → CCSF8)
 * payload example:
 * { sem:'1st', year:'1', acadYear:'2027-2028', tuition:'150', ... }
 */
export async function saveCcsFees(payload) {
  try {
    console.log("[saveCcsFees] tuition payload:", payload);

    const { error } = await supabase
      .from("department_content")
      .upsert(
        {
          department: CCS_DEPT,
          slot: "8", // CCSF8 slot
          text: JSON.stringify(payload),
        },
        { onConflict: "department,slot" }
      );

    if (error) throw error;
    return true;
  } catch (err) {
    console.log("[saveCcsFees] error:", err);
    return false;
  }
}

/**
 * Load CCS tuition + fees for CCSF8
 */
export async function loadCcsFees() {
  try {
    const { data, error } = await supabase
      .from("department_content")
      .select("text")
      .eq("department", CCS_DEPT)
      .eq("slot", "8")
      .maybeSingle();

    if (error) throw error;
    if (!data || !data.text) return null;
    return JSON.parse(data.text);
  } catch (err) {
    console.log("[loadCcsFees] error:", err);
    return null;
  }
}
