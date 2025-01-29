const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  completedLessons: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  progress: {
    type: Number,
    default: 0
  }, // Percentage of completion
  startedAt: { type: Date, default: Date.now }
});

// Ensure unique user-course combination
progressSchema.index({ user: 1, course: 1 }, { unique: true });

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress; 