import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// test endpoint
app.get("/", (req, res) => res.send("iMask backend running ✅"));

// example API
app.get("/items", (req, res) => {
  res.json([
    { id: 1, name: "Mask Type A" },
    { id: 2, name: "Mask Type B" },
  ]);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`iMask backend running on port ${PORT}`));
