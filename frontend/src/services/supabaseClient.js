// frontend/src/services/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;
// 2. Normal Supabase client (for tables, etc.)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 3. ALSO export URL & key so helpers can call REST storage API
export { SUPABASE_URL, SUPABASE_ANON_KEY };