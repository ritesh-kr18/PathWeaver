const express = require('express');
const router = express.Router();
const { generateReport, getLeaderboard } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

router.post('/generate', protect, generateReport);
router.get('/leaderboard', getLeaderboard);

module.exports = router;
