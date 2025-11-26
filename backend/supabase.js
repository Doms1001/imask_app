// backend/supabase.js
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Uses SUPABASE_URL and SUPABASE_SERVICE_KEY from .env
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
  auth: {
    persistSession: false,
  },
});

module.exports = supabase;
