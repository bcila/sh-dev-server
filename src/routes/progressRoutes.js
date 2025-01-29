const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const authMiddleware = require('../middleware/authMiddleware');

// Tüm progress route'ları authentication gerektirir
router.use(authMiddleware);

// Progress routes
router.get('/', progressController.getAllProgress);
router.get('/:courseId', progressController.getProgress);
router.post('/:courseId/lessons/:lessonId/complete', progressController.markLessonComplete);
router.post('/:courseId/lessons/:lessonId/incomplete', progressController.markLessonIncomplete);
router.get('/stats', progressController.getStudentStats);
router.get('/recent-courses', progressController.getRecentCourses);
router.get('/:courseId/report', progressController.getProgressReport);

module.exports = router; 