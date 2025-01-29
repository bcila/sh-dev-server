const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Public routes (auth required)
router.get('/', authMiddleware, subscriptionController.getAllSubscriptions);
router.get('/status', authMiddleware, subscriptionController.getSubscriptionStatus);
router.post('/subscribe/:planId', authMiddleware, subscriptionController.subscribeToPlan);

// Admin routes
router.post(
  '/admin/plans',
  authMiddleware,
  roleMiddleware(['admin']),
  subscriptionController.createSubscription
);

router.put(
  '/admin/plans/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  subscriptionController.updateSubscription
);

router.delete(
  '/admin/plans/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  subscriptionController.deleteSubscription
);

module.exports = router;
