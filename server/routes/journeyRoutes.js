const express = require('express');
const router = express.Router();
const { saveJourney, loadJourney, listJourneys, deleteJourney } = require('../controllers/journeyController');
const { protect } = require('../middleware/authMiddleware');

router.post('/save', protect, saveJourney);
router.get('/load/:id', protect, loadJourney);
router.get('/list', protect, listJourneys);
router.delete('/:id', protect, deleteJourney);

module.exports = router;
