const Notification = require('../models/Notification');
const User = require('../models/User');

class NotificationService {
  async getNotifications(userId) {
    return await Notification.find({ user: userId }).sort({ createdAt: -1 });
  }

  async createNotification(title, message, userId) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');

    const notification = new Notification({
      title,
      message,
      user: userId
    });

    return await notification.save();
  }

  async markAsRead(notificationId) {
    const notification = await Notification.findById(notificationId);
    if (!notification) throw new Error('Notification not found');

    notification.isRead = true;
    return await notification.save();
  }

  async deleteNotification(notificationId) {
    const notification = await Notification.findById(notificationId);
    if (!notification) throw new Error('Notification not found');

    await notification.deleteOne();
    return notification;
  }
}

module.exports = new NotificationService();
