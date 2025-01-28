const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');


router.get('/admin/courses/', authMiddleware, roleMiddleware(['admin']), courseController.getAllCoursesAdmin);
router.post('/admin/courses/', authMiddleware, roleMiddleware(['admin']), courseController.createCourse);
router.put('/admin/courses/:id', authMiddleware, roleMiddleware(['admin']), courseController.updateCourse);
router.delete('/admin/courses/:id', authMiddleware, roleMiddleware(['admin']), courseController.deleteCourse);

router.get('/courses', authMiddleware, courseController.getAllCourses);
module.exports = router;
