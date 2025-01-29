const Notification = require('../models/Notification');
const User = require('../models/User');

class NotificationService {
  async getUserNotifications(userId) {
    return await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50);
  }

  async markAsRead(notificationId, userId) {
    return await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { read: true },
      { new: true }
    );
  }

  async markAllAsRead(userId) {
    return await Notification.updateMany(
      { user: userId, read: false },
      { read: true }
    );
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

  // Sistem bildirimleri için yardımcı metodlar
  async notifyNewCourse(courseId, teacherId) {
    // Tüm öğrencilere yeni kurs bildirimi gönder
    const users = await User.find({ role: 'student' });
    const notifications = users.map(user => ({
      user: user._id,
      title: 'New Course Available',
      message: 'A new course has been added to the platform',
      type: 'info'
    }));
    
    return await Notification.insertMany(notifications);
  }

  async notifyLessonComplete(userId, courseId, lessonId) {
    return await this.createNotification(userId, {
      title: 'Lesson Completed',
      message: 'Congratulations on completing the lesson!',
      type: 'success'
    });
  }
}

module.exports = new NotificationService();
