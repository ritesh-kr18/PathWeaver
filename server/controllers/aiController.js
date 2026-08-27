const crypto = require('crypto');
const openaiService = require('../services/openaiService');
const AICache = require('../models/AICache');

// Helper to create a hash for caching
const hashRequest = (data) => {
  return crypto.createHash('md5').update(JSON.stringify(data)).digest('hex');
};

// @desc    Generate a dynamic scenario
// @route   POST /api/ai/generate-scenario
const generateScenario = async (req, res, next) => {
  try {
    const { currentStage, userProfile, previousDecisions, currentScores, scenarioCount } = req.body;

    if (!currentStage) {
      return res.status(400).json({ success: false, message: 'currentStage is required' });
    }

    // Check cache
    const cacheKey = hashRequest({ type: 'scenario', currentStage, scenarioCount, interests: userProfile?.interests });
    const cached = await AICache.findOne({ requestHash: cacheKey });
    if (cached) {
      return res.json({ success: true, scenario: cached.response, source: 'cache' });
    }

    // Generate with OpenAI
    const scenario = await openaiService.generateScenario({
      currentStage, userProfile, previousDecisions, currentScores, scenarioCount
    });

    if (!scenario) {
      return res.json({ success: false, message: 'AI unavailable, use fallback', source: 'fallback' });
    }

    // Cache the result
    await AICache.create({ requestHash: cacheKey, type: 'scenario', response: scenario });

    res.json({ success: true, scenario, source: 'ai' });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate consequence narration
// @route   POST /api/ai/generate-consequence
const generateConsequence = async (req, res, next) => {
  try {
    const { choiceText, scenarioTitle, stage, effects, userName } = req.body;

    const consequence = await openaiService.generateConsequence({
      choiceText, scenarioTitle, stage, effects, userName
    });

    if (!consequence) {
      return res.json({ success: false, message: 'AI unavailable', source: 'fallback' });
    }

    res.json({ success: true, consequence, source: 'ai' });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate personalized feedback
// @route   POST /api/ai/generate-feedback
const generateFeedback = async (req, res, next) => {
  try {
    const { startingStage, decisions, scores, exploredStages, userName } = req.body;

    const feedback = await openaiService.generateFeedback({
      startingStage, decisions, scores, exploredStages, userName
    });

    if (!feedback) {
      return res.json({ success: false, message: 'AI unavailable', source: 'fallback' });
    }

    res.json({ success: true, feedback, source: 'ai' });
  } catch (error) {
    next(error);
  }
};

module.exports = { generateScenario, generateConsequence, generateFeedback };
