require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ── Security & Parsing ──
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '10mb' }));

// ── Routes ──
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/journey', require('./routes/journeyRoutes'));
app.use('/api/report', require('./routes/reportRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'PathWeaver API is running' });
});

// ── Error Handler ──
app.use(errorHandler);

// ── Start Server ──
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 PathWeaver server running on port ${PORT}`);
  });
});
