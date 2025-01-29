const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Public routes
router.get('/', authMiddleware, courseController.getAllCourses);
router.get('/:id', authMiddleware, courseController.getCourseById);

// Student routes
router.get('/student/enrolled', authMiddleware, courseController.getEnrolledCourses);
router.get('/student/progress/:courseId', authMiddleware, courseController.getStudentProgress);
router.post('/student/enroll/:courseId', authMiddleware, courseController.enrollCourse);

// Teacher routes
router.get('/teacher/courses', authMiddleware, roleMiddleware(['teacher']), courseController.getTeacherCourses);
router.get('/teacher/stats', authMiddleware, roleMiddleware(['teacher']), courseController.getTeacherStats);
router.get('/teacher/courses/:id/analytics', authMiddleware, roleMiddleware(['teacher']), courseController.getCourseAnalytics);

// Admin routes
router.get('/admin/courses', authMiddleware, roleMiddleware(['admin']), courseController.getAllCoursesAdmin);
router.post('/admin/create', authMiddleware, roleMiddleware(['admin']), courseController.createCourse);
router.put('/admin/courses/:id', authMiddleware, roleMiddleware(['admin']), courseController.updateCourse);
router.delete('/admin/courses/:id', authMiddleware, roleMiddleware(['admin']), courseController.deleteCourse);

module.exports = router;
