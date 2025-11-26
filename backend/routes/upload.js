// backend/routes/upload.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadController = require('../controllers/uploadController');

// store file in memory so we can send buffer to Supabase
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/department-image
router.post(
  '/department-image',
  upload.single('file'),       // "file" field in FormData
  uploadController.uploadDepartmentImage
);

// GET /api/department-media?department=CCS&screen=CCSF5
router.get(
  '/department-media',
  uploadController.getDepartmentMedia
);

module.exports = router;
