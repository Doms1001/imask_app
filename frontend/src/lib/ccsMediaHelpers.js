// src/lib/ccsMediaHelpers.js
// All CCS images + tuition config helpers

import "react-native-url-polyfill/auto";
import * as FileSystem from "expo-file-system/legacy";
import { decode } from "base64-arraybuffer";
import { supabase } from "../services/supabaseClient";

const CCS_BUCKET = "department_images"; // your bucket
const CCS_DEPT = "CCS";

// Helper: safely get extension from a URI
function getFileExtension(uri) {
  if (!uri) return "png";

  // Strip query params if any (e.g. file.png?someParam=123)
  const withoutQuery = uri.split("?")[0];

  const parts = withoutQuery.split(".");
  if (parts.length < 2) return "png";

  const ext = parts.pop().toLowerCase();
  // basic whitelist
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
    return ext;
  }
  return "png";
}

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

    // -------------------------------
    // 1. Read file as binary (legacy API)
    // -------------------------------
    const fileInfo = await FileSystem.getInfoAsync(localUri);
    if (!fileInfo.exists) {
      console.log("[uploadCcsMedia] file does NOT exist");
      return null;
    }

    const fileBase64 = await FileSystem.readAsStringAsync(localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convert base64 → binary (Uint8Array)
    const binary = decode(fileBase64);

    // -------------------------------
    // 2. Build file name
    // -------------------------------
    const fileExt = getFileExtension(localUri);
    const fileName = `CCS/${slot}-${Date.now()}.${fileExt}`;

    // -------------------------------
    // 3. Upload to Supabase Storage
    // -------------------------------
    const { error: uploadError } = await supabase.storage
      .from(CCS_BUCKET)
      .upload(fileName, binary, {
        contentType: `image/${fileExt === "jpg" ? "jpeg" : fileExt}`,
        upsert: true,
      });

    if (uploadError) {
      console.log("[uploadCcsMedia] upload failed:", uploadError);
      return null;
    }

    // -------------------------------
    // 4. Get a public URL
    // -------------------------------
    const { data } = supabase.storage.from(CCS_BUCKET).getPublicUrl(fileName);
    const publicUrl = data?.publicUrl;

    console.log("[uploadCcsMedia] publicUrl =", publicUrl);

    // -------------------------------
    // 5. Save mapping to DB
    // -------------------------------
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
      console.log("[uploadCcsMedia] DB error:", dbError);
      return null;
    }

    return publicUrl;
  } catch (err) {
    console.log("[uploadCcsMedia] FINAL ERROR:", err);
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
