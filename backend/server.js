// backend/server.js
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

const app = express();
const port = process.env.PORT || 3000;

// --- Middleware
app.use(cors());
app.use(express.json());

// --- Supabase client (use service key in backend .env)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// --- Health check
app.get("/", (req, res) => {
  res.json({ ok: true, msg: "Imask backend running" });
});

// --- POST route to save users
app.post("/api/users", async (req, res) => {
  try {
    console.log(">>> /api/users called");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);

    const { name, email, gender } = req.body;

    if (!name || !email || !gender) {
      console.log("Validation failed - missing fields");
      return res.status(400).json({ error: "Missing fields" });
    }

    const { data, error } = await supabase
      .from("users")
      .insert([{ name: name.trim(), email: email.trim(), gender: gender.trim() }])
      .select();

    console.log("Supabase response:", { data, error });

    if (error) {
      return res.status(500).json({ error: error.message, raw: error });
    }

    return res.status(201).json({ message: "User saved successfully", user: data[0] });
  } catch (err) {
    console.error("Server exception:", err);
    res.status(500).json({ error: "Internal server error", details: String(err) });
  }
});

// --- Start server
app.listen(port, () => {
  console.log(`🚀 Backend running at http://localhost:${port}`);
});
