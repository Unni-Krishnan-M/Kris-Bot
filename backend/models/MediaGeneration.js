const mongoose = require('mongoose');

const mediaGenerationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['image', 'video', 'ppt', 'resume'],
    required: true
  },
  prompt: {
    type: String,
    required: true
  },
  style: {
    type: String,
    default: 'default'
  },
  outputUrl: {
    type: String,
    required: true
  },
  metadata: {
    duration: String,
    aspectRatio: String,
    size: String,
    format: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MediaGeneration', mediaGenerationSchema);