const Journey = require('../models/Journey');

// @desc    Save or update a journey
// @route   POST /api/journey/save
const saveJourney = async (req, res, next) => {
  try {
    const journeyData = { ...req.body, userId: req.user._id };

    if (journeyData._id) {
      // Update existing journey
      const journey = await Journey.findOneAndUpdate(
        { _id: journeyData._id, userId: req.user._id },
        journeyData,
        { new: true, runValidators: true }
      );
      if (!journey) {
        return res.status(404).json({ success: false, message: 'Journey not found' });
      }
      return res.json({ success: true, journey });
    }

    // Create new journey
    const journey = await Journey.create(journeyData);
    res.status(201).json({ success: true, journey });
  } catch (error) {
    next(error);
  }
};

// @desc    Load a specific journey
// @route   GET /api/journey/load/:id
const loadJourney = async (req, res, next) => {
  try {
    const journey = await Journey.findOne({ _id: req.params.id, userId: req.user._id });
    if (!journey) {
      return res.status(404).json({ success: false, message: 'Journey not found' });
    }
    res.json({ success: true, journey });
  } catch (error) {
    next(error);
  }
};

// @desc    List all journeys for the user
// @route   GET /api/journey/list
const listJourneys = async (req, res, next) => {
  try {
    const journeys = await Journey.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('userProfile startingStage currentStage status createdAt');
    res.json({ success: true, journeys });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a journey
// @route   DELETE /api/journey/:id
const deleteJourney = async (req, res, next) => {
  try {
    const journey = await Journey.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!journey) {
      return res.status(404).json({ success: false, message: 'Journey not found' });
    }
    res.json({ success: true, message: 'Journey deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { saveJourney, loadJourney, listJourneys, deleteJourney };
