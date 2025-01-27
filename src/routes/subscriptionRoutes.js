const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Tüm abonelik planlarını listele (Admin işlemi)
router.get('/', authMiddleware, roleMiddleware(['admin']), subscriptionController.getAllSubscriptions);

// Yeni abonelik planı oluştur (Admin işlemi)
router.post('/', authMiddleware, roleMiddleware(['admin']), subscriptionController.createSubscription);

// Abonelik planını güncelle (Admin işlemi)
router.put('/:id', authMiddleware, roleMiddleware(['admin']), subscriptionController.updateSubscription);

// Abonelik planını sil (Admin işlemi)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), subscriptionController.deleteSubscription);

module.exports = router;
