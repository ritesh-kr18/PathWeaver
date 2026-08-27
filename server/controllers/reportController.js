const Journey = require('../models/Journey');
const Score = require('../models/Score');

// @desc    Finalize journey and submit to leaderboard
// @route   POST /api/report/generate
const generateReport = async (req, res, next) => {
  try {
    const { journeyId } = req.body;

    const journey = await Journey.findOne({ _id: journeyId, userId: req.user._id });
    if (!journey) {
      return res.status(404).json({ success: false, message: 'Journey not found' });
    }

    // Mark as completed
    journey.status = 'completed';
    journey.completedAt = new Date();
    await journey.save();

    // Calculate total score (average of 5 main scores)
    const { career, health, finance, relationships, happiness } = journey.scores;
    const totalScore = Math.round((career + health + finance + relationships + happiness) / 5);

    // Save to leaderboard
    await Score.create({
      userId: req.user._id,
      journeyId: journey._id,
      userName: journey.userProfile?.name || req.user.name,
      avatar: journey.userProfile?.avatar || req.user.avatar,
      totalScore,
      career,
      health,
      finance,
      relationships,
      happiness,
      startingStage: journey.startingStage
    });

    res.json({
      success: true,
      report: {
        journey,
        totalScore,
        scores: journey.scores,
        decisions: journey.decisions,
        timelineEvents: journey.timelineEvents
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get leaderboard
// @route   GET /api/report/leaderboard
const getLeaderboard = async (req, res, next) => {
  try {
    const { stage } = req.query;
    const filter = stage ? { startingStage: stage } : {};

    const scores = await Score.find(filter)
      .sort({ totalScore: -1 })
      .limit(50)
      .select('userName avatar totalScore career health finance relationships happiness startingStage completedAt');

    res.json({ success: true, leaderboard: scores });
  } catch (error) {
    next(error);
  }
};

module.exports = { generateReport, getLeaderboard };
