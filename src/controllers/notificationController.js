const Notification = require('../models/Notification');
const User = require('../models/User');

// Kullanıcının bildirimlerini getir
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Yeni bildirim oluştur
const createNotification = async (req, res) => {
  const { title, message, userId } = req.body;

  try {
    const notification = new Notification({
      title,
      message,
      user: userId
    });

    await notification.save();
    res.status(201).json({ message: 'Notification sent successfully', notification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Bildirimi okundu olarak işaretle
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    notification.isRead = true;
    await notification.save();
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Bildirimi sil
const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    await notification.deleteOne();
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNotifications,
  createNotification,
  markAsRead,
  deleteNotification
};
