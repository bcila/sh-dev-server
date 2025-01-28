const SubscriptionService = require('../services/subscriptionService');

const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await SubscriptionService.getAllSubscriptions();
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSubscription = async (req, res) => {
  try {
    const subscription = await SubscriptionService.createSubscription(req.body);
    res.status(201).json(subscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateSubscription = async (req, res) => {
  try {
    const subscription = await SubscriptionService.updateSubscription(req.params.id, req.body);
    res.json(subscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteSubscription = async (req, res) => {
  try {
    await SubscriptionService.deleteSubscription(req.params.id);
    res.json({ message: 'Subscription plan deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription
};
