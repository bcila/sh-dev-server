const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Kullanıcıya ait bildirimleri getir
router.get('/', authMiddleware, notificationController.getNotifications);

// Admin'in kullanıcıya bildirim göndermesi için rota
router.post('/', authMiddleware, roleMiddleware(['admin']), notificationController.createNotification);

// Bildirimi okundu olarak işaretle
router.put('/:id/read', authMiddleware, notificationController.markAsRead);

// Admin'in bildirim silmesi için rota
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), notificationController.deleteNotification);

module.exports = router;
