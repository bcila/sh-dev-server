const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Kullanıcıları listele (Admin işlemi)
router.get('/', authMiddleware, roleMiddleware(['admin']), userController.getAllUsers);

// Yeni kullanıcı oluştur (Admin işlemi)
router.post('/', authMiddleware, roleMiddleware(['admin']), userController.createUser);

// Kullanıcı bilgilerini güncelle (Admin işlemi)
router.put('/:id', authMiddleware, roleMiddleware(['admin']), userController.updateUser);

// Kullanıcıyı sil (Admin işlemi)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), userController.deleteUser);

module.exports = router;
