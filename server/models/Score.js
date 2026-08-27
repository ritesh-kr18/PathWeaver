const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  journeyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Journey'
  },
  userName: String,
  avatar: String,
  totalScore: Number,
  career: Number,
  health: Number,
  finance: Number,
  relationships: Number,
  happiness: Number,
  startingStage: String,
  completedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for fast leaderboard queries
scoreSchema.index({ totalScore: -1 });

module.exports = mongoose.model('Score', scoreSchema);
