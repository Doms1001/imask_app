// src/lib/ccsMediaHelpers.js
// All CCS images + tuition config helpers (Resolution 2: REST + FileSystem)

import "react-native-url-polyfill/auto";
import * as FileSystem from "expo-file-system";
import { supabase, SUPABASE_URL, SUPABASE_ANON_KEY } from "../services/supabaseClient";

const CCS_BUCKET = "department_images";   // your bucket name
const CCS_DEPT = "CCS";

/**
 * Upload one CCS image (newsMain, eventsTop, etc.) to Storage (REST API)
 * + save mapping in department_media.
 *
 * slot: "newsMain" | "eventsTop" | "eventsBottom" | "ann1" | "ann2" | "ann3" | "essentials"
 * localUri: file:///... from expo-image-picker
 */
export async function uploadCcsMedia(slot, localUri) {
  try {
    console.log("[uploadCcsMedia] slot =", slot, "uri =", localUri);
    if (!localUri) return null;

    // --- 1) Build path & extension ---
    const extGuess = localUri.split(".").pop()?.toLowerCase() || "jpg";
    const fileExt = extGuess === "jpeg" ? "jpg" : extGuess; // normalize
    const objectPath = `CCS/${slot}-${Date.now()}.${fileExt}`; // e.g. CCS/newsMain-123456789.png

    // --- 2) Build REST upload URL for this object ---
    const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${CCS_BUCKET}/${objectPath}`;

    // --- 3) Upload binary using expo-file-system ---
    const result = await FileSystem.uploadAsync(uploadUrl, localUri, {
      httpMethod: "POST",
      uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      headers: {
        "Content-Type": `image/${fileExt === "jpg" ? "jpeg" : fileExt}`,
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    console.log("[uploadCcsMedia] uploadAsync status:", result.status);

    if (result.status >= 400) {
      console.log("[uploadCcsMedia] uploadAsync body:", result.body);
      throw new Error(`Upload failed status ${result.status}`);
    }

    // --- 4) Get public URL from Supabase client ---
    const {
      data: { publicUrl },
    } = supabase.storage.from(CCS_BUCKET).getPublicUrl(objectPath);

    console.log("[uploadCcsMedia] publicUrl =", publicUrl);

    // --- 5) Save mapping in department_media (upsert by department+slot) ---
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

    if (dbError) throw dbError;

    return publicUrl;
  } catch (err) {
    console.log("[uploadCcsMedia] storage upload error:", err);
    return null;
  }
}

/**
 * Get image URL for a CCS slot from department_media
 */
export async function getCcsMediaUrl(slot) {
  try {
    console.log("[getCcsMediaUrl] slot =", slot);
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
 * OPTIONAL helper: load all CCS media at once (if you ever want it)
 */
export async function loadCcsMedia() {
  try {
    const { data, error } = await supabase
      .from("department_media")
      .select("slot, image_url")
      .eq("department", CCS_DEPT);

    if (error) throw error;
    const map = {};
    (data || []).forEach((row) => {
      map[row.slot] = row.image_url;
    });
    console.log("[loadCcsMedia] loaded media:", map);
    return map;
  } catch (err) {
    console.log("[loadCcsMedia] error:", err);
    return {};
  }
}

/**
 * Save CCS tuition + fees (used by AdminScreen → CCSF8)
 */
export async function saveCcsFees(payload) {
  try {
    console.log("[saveCcsFees] tuition payload:", payload);

    const { error } = await supabase
      .from("department_content")
      .upsert(
        {
          department: CCS_DEPT,
          slot: 8, // CCSF8 slot
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
      .eq("slot", 8)
      .maybeSingle();

    if (error) throw error;
    if (!data || !data.text) return null;
    const parsed = JSON.parse(data.text);
    console.log("[loadCcsFees] loaded fees:", parsed);
    return parsed;
  } catch (err) {
    console.log("[loadCcsFees] error:", err);
    return null;
  }
}
