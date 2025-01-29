const subscriptionService = require('../services/subscriptionService');

const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await subscriptionService.getAllSubscriptions();
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const subscribeToPlan = async (req, res) => {
  try {
    const user = await subscriptionService.subscribeToPlan(req.user.id, req.params.planId);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getSubscriptionStatus = async (req, res) => {
  try {
    const hasValidSubscription = await subscriptionService.checkSubscriptionStatus(req.user.id);
    res.json({ hasValidSubscription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin metodları
const createSubscription = async (req, res) => {
  try {
    const subscription = await subscriptionService.createSubscription(req.body);
    res.status(201).json(subscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateSubscription = async (req, res) => {
  try {
    const subscription = await subscriptionService.updateSubscription(req.params.id, req.body);
    res.json(subscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteSubscription = async (req, res) => {
  try {
    await subscriptionService.deleteSubscription(req.params.id);
    res.json({ message: 'Subscription plan deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllSubscriptions,
  subscribeToPlan,
  getSubscriptionStatus,
  createSubscription,
  updateSubscription,
  deleteSubscription
};
