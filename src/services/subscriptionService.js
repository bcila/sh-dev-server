const Subscription = require('../models/Subscription');

class SubscriptionService {
  async getAllSubscriptions() {
    return await Subscription.find().sort({ createdAt: -1 });
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