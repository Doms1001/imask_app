// backend/controllers/adminController.js

// Simple health-check endpoint so we know backend works
exports.ping = (req, res) => {
  res.json({
    status: 'ok',
    message: 'Admin backend is alive 🚀',
    time: new Date().toISOString(),
  });
};
