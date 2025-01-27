const Subscription = require('../models/Subscription');

class SubscriptionService {
  async getAllSubscriptions() {
    return await Subscription.find({ active: true });
  }

  async createSubscription(subscriptionData) {
    if (!this.isValidDuration(subscriptionData.duration)) {
      throw new Error('Invalid duration format');
    }

    const subscription = new Subscription({
      ...subscriptionData,
      features: subscriptionData.features || []
    });

    return await subscription.save();
  }

  async updateSubscription(subscriptionId, subscriptionData) {
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription plan not found');
    }

    if (subscriptionData.duration && !this.isValidDuration(subscriptionData.duration)) {
      throw new Error('Invalid duration format');
    }

    subscription.name = subscriptionData.name || subscription.name;
    subscription.price = subscriptionData.price || subscription.price;
    subscription.duration = subscriptionData.duration || subscription.duration;
    subscription.features = subscriptionData.features || subscription.features;
    subscription.active = subscriptionData.active !== undefined ? subscriptionData.active : subscription.active;

    return await subscription.save();
  }

  async deleteSubscription(subscriptionId) {
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription plan not found');
    }

    subscription.active = false;
    return await subscription.save();
  }

  isValidDuration(duration) {
    return duration.value && 
           duration.unit && 
           ['day', 'month', 'year'].includes(duration.unit);
  }
}

module.exports = new SubscriptionService(); 