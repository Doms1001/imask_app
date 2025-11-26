// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// example route
router.get('/ping', adminController.ping);

module.exports = router;
