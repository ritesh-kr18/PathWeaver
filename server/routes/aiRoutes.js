const express = require('express');
const router = express.Router();
const { generateScenario, generateConsequence, generateFeedback } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const { aiLimiter } = require('../middleware/rateLimiter');

router.post('/generate-scenario', protect, aiLimiter, generateScenario);
router.post('/generate-consequence', protect, aiLimiter, generateConsequence);
router.post('/generate-feedback', protect, aiLimiter, generateFeedback);

module.exports = router;
