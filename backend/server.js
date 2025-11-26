// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/upload');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('IMASK backend is running ✅');
});

app.use('/api/admin', adminRoutes);
app.use('/api', uploadRoutes);   // /api/department-image, /api/department-media

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`);
});
