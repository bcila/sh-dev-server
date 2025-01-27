const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Public route to view all courses
router.get('/', courseController.getAllCourses);

// Protected routes for course management
router.post('/', authMiddleware, roleMiddleware(['admin', 'trainer']), courseController.createCourse);
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'trainer']), courseController.updateCourse);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), courseController.deleteCourse);

module.exports = router;
