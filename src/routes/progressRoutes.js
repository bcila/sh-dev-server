const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all progress for the current user
router.get('/', authMiddleware, progressController.getAllProgress);

// Get progress for a specific course
router.get('/:courseId', authMiddleware, progressController.getProgress);

// Mark a lesson as complete
router.post('/:courseId/lessons/:lessonId/complete', 
  authMiddleware, 
  progressController.markLessonComplete
);

// Mark a lesson as incomplete
router.post('/:courseId/lessons/:lessonId/incomplete', 
  authMiddleware, 
  progressController.markLessonIncomplete
);

module.exports = router; 