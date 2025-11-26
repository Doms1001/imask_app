// frontend/src/lib/ccsMediaHelpers.js
// Helper for CCS images used in CCSF5/6/7/10

import { supabase } from "../services/supabaseClient";

// This is your existing bucket in Supabase Storage
export const CCS_BUCKET = "department_images";

/**
 * Get the public URL for a CCS media slot.
 * slotKey examples: "newsMain", "eventsTop", "eventsBottom", "ann1", ...
 *
 * Reads from table `ccs_media`:
 *   columns: department (e.g. "CCS"), slot_key, public_url
 */
export async function getCCSMediaUrl(slotKey) {
  try {
    const { data, error } = await supabase
      .from("ccs_media")
      .select("public_url")
      .eq("department", "CCS")
      .eq("slot_key", slotKey)
      .maybeSingle(); // 0 or 1 row

    if (error) {
      console.log("[getCCSMediaUrl] Supabase error:", error.message);
      return null;
    }

    if (data?.public_url) {
      return data.public_url;
    }

    // No record yet for this slot
    return null;
  } catch (err) {
    console.log("[getCCSMediaUrl] exception:", err);
    return null;
  }
}
