const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Admin routes
router.get('/', authMiddleware, roleMiddleware(['admin']), userController.getAllUsers);
router.post('/', authMiddleware, roleMiddleware(['admin']), userController.createUser);
router.get('/:id', authMiddleware, roleMiddleware(['admin']), userController.getUserById);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), userController.updateUser);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), userController.deleteUser);
router.put('/:id/role', authMiddleware, roleMiddleware(['admin']), userController.updateUserRole);
router.put('/:id/status', authMiddleware, roleMiddleware(['admin']), userController.updateUserStatus);

module.exports = router;
