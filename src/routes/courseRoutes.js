const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Admin routes
router.get('/admin/courses', authMiddleware, roleMiddleware(['admin']), courseController.getAllCoursesAdmin);
router.post('/admin/courses', authMiddleware, roleMiddleware(['admin']), courseController.createCourse);
router.put('/admin/courses/:id', authMiddleware, roleMiddleware(['admin']), courseController.updateCourse);
router.delete('/admin/courses/:id', authMiddleware, roleMiddleware(['admin']), courseController.deleteCourse);

// Get teachers for dropdown
router.get('/admin/teachers', authMiddleware, roleMiddleware(['admin']), courseController.getTeachers);

router.get('/courses', authMiddleware, courseController.getAllCourses);

// Student routes
router.get('/enrolled', authMiddleware, courseController.getEnrolledCourses);

module.exports = router;
