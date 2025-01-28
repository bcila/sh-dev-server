const Notification = require('../models/Notification');
const User = require('../models/User');

class NotificationService {
  async getUserNotifications(userId) {
    return await Notification.find({ user: userId })
      .sort({ createdAt: -1 });
  }

  async markAsRead(notificationId, userId) {
    const notification = await Notification.findOne({
      _id: notificationId,
      user: userId
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    notification.read = true;
    await notification.save();
    return notification;
  }

  async deleteNotification(notificationId, userId) {
    const notification = await Notification.findOne({
      _id: notificationId,
      user: userId
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    await notification.deleteOne();
  }

  async createNotification(userId, data) {
    const notification = new Notification({
      user: userId,
      ...data
    });
    return await notification.save();
  }
}

module.exports = new NotificationService();
