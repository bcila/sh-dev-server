const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', authMiddleware, subscriptionController.getAllSubscriptions);
router.post('/', authMiddleware, roleMiddleware(['admin']), subscriptionController.createSubscription);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), subscriptionController.updateSubscription);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), subscriptionController.deleteSubscription);

module.exports = router;
