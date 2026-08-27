const mongoose = require('mongoose');

const aiCacheSchema = new mongoose.Schema({
  requestHash: {
    type: String,
    unique: true,
    index: true
  },
  type: {
    type: String,
    enum: ['scenario', 'consequence', 'feedback', 'narration', 'image']
  },
  response: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 604800 // Auto-delete after 7 days
  }
});

module.exports = mongoose.model('AICache', aiCacheSchema);
