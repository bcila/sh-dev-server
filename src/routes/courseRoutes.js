const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Tüm eğitimleri listele (Admin işlemi)
router.get('/', authMiddleware, roleMiddleware(['admin']), courseController.getAllCourses);

// Yeni eğitim oluştur (Admin işlemi)
router.post('/', authMiddleware, roleMiddleware(['admin']), courseController.createCourse);

// Eğitim bilgilerini güncelle (Admin işlemi)
router.put('/:id', authMiddleware, roleMiddleware(['admin']), courseController.updateCourse);

// Eğitim sil (Admin işlemi)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), courseController.deleteCourse);

module.exports = router;
