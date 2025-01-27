const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, progressController.getAllProgress);

router.get('/:courseId', authMiddleware, progressController.getProgress);

router.post('/:courseId/lessons/:lessonId/complete', 
  authMiddleware, 
  progressController.markLessonComplete
);

router.post('/:courseId/lessons/:lessonId/incomplete', 
  authMiddleware, 
  progressController.markLessonIncomplete
);

module.exports = router; 