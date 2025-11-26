// backend/routes/department.js
const express = require('express');
const router = express.Router();

// simple test endpoint for now
router.get('/ping', (req, res) => {
  res.json({ ok: true, route: 'departments' });
});

module.exports = router;
