const notificationService = require('../services/notificationService');

const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getUserNotifications(req.user.id);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createNotification = async (req, res) => {
  const { title, message, userId } = req.body;

  try {
    const notification = await notificationService.createNotification(title, message, userId);
    res.status(201).json({ message: 'Notification sent successfully', notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user.id);
    res.json(notification);
  } catch (error) {
    if (error.message === 'Notification not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    await notificationService.deleteNotification(req.params.id, req.user.id);
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    if (error.message === 'Notification not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotifications,
  createNotification,
  markAsRead,
  deleteNotification
};
