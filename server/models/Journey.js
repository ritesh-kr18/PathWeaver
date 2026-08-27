const mongoose = require('mongoose');

const journeySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userProfile: {
    name: String,
    age: Number,
    avatar: String,
    interests: [String]
  },
  startingStage: {
    type: String,
    required: true
  },
  currentStage: {
    type: String,
    required: true
  },
  currentNode: String,
  exploredStages: [String],
  decisions: [{
    nodeId: String,
    choiceId: String,
    choiceText: String,
    stage: String,
    effects: {
      career: { type: Number, default: 0 },
      health: { type: Number, default: 0 },
      finance: { type: Number, default: 0 },
      relationships: { type: Number, default: 0 },
      happiness: { type: Number, default: 0 },
      knowledge: { type: Number, default: 0 }
    },
    timestamp: { type: Date, default: Date.now }
  }],
  scores: {
    career: { type: Number, default: 50 },
    health: { type: Number, default: 50 },
    finance: { type: Number, default: 50 },
    relationships: { type: Number, default: 50 },
    happiness: { type: Number, default: 50 },
    knowledge: { type: Number, default: 50 }
  },
  timelineEvents: [{
    stage: String,
    event: String,
    timestamp: { type: Date, default: Date.now }
  }],
  status: {
    type: String,
    enum: ['in_progress', 'completed'],
    default: 'in_progress'
  },
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Journey', journeySchema);
