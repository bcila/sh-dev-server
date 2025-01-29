const Subscription = require('../models/Subscription');
const User = require('../models/User');
const NotificationService = require('./notificationService');

class SubscriptionService {
  async getAllSubscriptions() {
    return await Subscription.find({ active: true });
  }

  async getSubscriptionById(id) {
    const subscription = await Subscription.findById(id);
    if (!subscription) {
      throw new Error('Subscription plan not found');
    }
    return subscription;
  }

  async subscribeToPlan(userId, planId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const plan = await this.getSubscriptionById(planId);
    if (!plan) {
      throw new Error('Subscription plan not found');
    }

    // Abonelik süresini hesapla
    const startDate = new Date();
    const endDate = new Date();
    switch (plan.duration.unit) {
      case 'day':
        endDate.setDate(endDate.getDate() + plan.duration.value);
        break;
      case 'month':
        endDate.setMonth(endDate.getMonth() + plan.duration.value);
        break;
      case 'year':
        endDate.setFullYear(endDate.getFullYear() + plan.duration.value);
        break;
    }

    // Kullanıcının aboneliğini güncelle
    user.subscription = {
      plan: plan._id,
      startDate,
      endDate,
      status: 'active'
    };

    await user.save();

    // Bildirim gönder
    await NotificationService.createNotification(userId, {
      title: 'Subscription Activated',
      message: `Your subscription to ${plan.name} has been activated.`,
      type: 'success'
    });

    return user;
  }

  async checkSubscriptionStatus(userId) {
    const user = await User.findById(userId).populate('subscription.plan');
    if (!user.subscription || !user.subscription.plan) {
      return false;
    }

    const now = new Date();
    if (now > user.subscription.endDate) {
      user.subscription.status = 'expired';
      await user.save();
      return false;
    }

    return true;
  }

  async createSubscription(subscriptionData) {
    const subscription = new Subscription(subscriptionData);
    return await subscription.save();
  }

  async updateSubscription(id, subscriptionData) {
    const subscription = await Subscription.findById(id);
    if (!subscription) {
      throw new Error('Subscription plan not found');
    }
    Object.assign(subscription, subscriptionData);
    return await subscription.save();
  }

  async deleteSubscription(id) {
    const subscription = await Subscription.findById(id);
    if (!subscription) {
      throw new Error('Subscription plan not found');
    }
    await subscription.deleteOne();
    return subscription;
  }

  isValidDuration(duration) {
    return duration.value && 
           duration.unit && 
           ['day', 'month', 'year'].includes(duration.unit);
  }
}

module.exports = new SubscriptionService(); 