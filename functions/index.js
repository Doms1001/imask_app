// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

// initialize admin SDK
admin.initializeApp();

// express app for API
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// middleware: verify Firebase ID Token AND admin claim
async function authAdmin(req, res, next) {
  const header = req.get("Authorization") || "";
  const match = header.match(/^Bearer (.*)$/);

  if (!match) {
    return res.status(401).json({ error: "Missing Authorization header" });
  }

  const idToken = match[1];

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    if (!decoded.admin) {
      return res.status(403).json({ error: "Admin only" });
    }

    req.auth = decoded;
    next();
  } catch (err) {
    console.error("Auth Error:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
}

// health check
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// LIST USERS (paginated)
app.get("/listUsers", authAdmin, async (req, res) => {
  try {
    const pageToken = req.query.pageToken || undefined;
    const data = await admin.auth().listUsers(1000, pageToken);

    res.json({
      users: data.users,
      nextPageToken: data.pageToken || null,
    });
  } catch (err) {
    console.error("List Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// SET / REMOVE ADMIN CLAIM
app.post("/setAdmin", authAdmin, async (req, res) => {
  const { uid, makeAdmin } = req.body;

  if (!uid) {
    return res.status(400).json({ error: "Missing UID" });
  }

  try {
    await admin.auth().setCustomUserClaims(uid, { admin: !!makeAdmin });
    res.json({ success: true });
  } catch (err) {
    console.error("setAdmin Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE USER
app.post("/deleteUser", authAdmin, async (req, res) => {
  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ error: "Missing UID" });
  }

  try {
    await admin.auth().deleteUser(uid);
    res.json({ success: true });
  } catch (err) {
    console.error("deleteUser Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// export API endpoint
exports.api = functions.https.onRequest(app);