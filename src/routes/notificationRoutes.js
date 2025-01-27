const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', authMiddleware, notificationController.getNotifications);

router.post('/', authMiddleware, roleMiddleware(['admin']), notificationController.createNotification);

router.put('/:id/read', authMiddleware, notificationController.markAsRead);

router.delete('/:id', authMiddleware, roleMiddleware(['admin']), notificationController.deleteNotification);

module.exports = router;
