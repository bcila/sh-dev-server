const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');


router.get('/', authMiddleware, roleMiddleware(['admin']), courseController.getAllCoursesAdmin);
router.post('/', authMiddleware, roleMiddleware(['admin']), courseController.createCourse);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), courseController.updateCourse);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), courseController.deleteCourse);

module.exports = router;
