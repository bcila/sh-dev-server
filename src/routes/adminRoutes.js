const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// ...existing code...

// Route to get admin dashboard stats
router.get('/stats', adminController.getDashboardStats);

router.get('/courses', adminController.getAllCourses);
router.post('/courses', adminController.createCourse);
router.put('/courses/:id', adminController.updateCourse);
router.delete('/courses/:id', adminController.deleteCourse);

router.get('/subscriptions', adminController.getAllSubscriptions);
router.post('/subscriptions', adminController.createSubscription);
router.put('/subscriptions/:id', adminController.updateSubscription);
router.delete('/subscriptions/:id', adminController.deleteSubscription);

module.exports = router;
