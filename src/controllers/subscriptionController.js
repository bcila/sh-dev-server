const subscriptionService = require('../services/subscriptionService');

const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await subscriptionService.getAllSubscriptions();
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSubscription = async (req, res) => {
  const { name, price, duration, features } = req.body;

  try {
    const subscription = await subscriptionService.createSubscription({
      name,
      price,
      duration,
      features
    });
    res.status(201).json({ message: 'Subscription plan created successfully', subscription });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateSubscription = async (req, res) => {
  const { name, price, duration, features, active } = req.body;

  try {
    const subscription = await subscriptionService.updateSubscription(req.params.id, {
      name,
      price,
      duration,
      features,
      active
    });
    res.json({ message: 'Subscription plan updated successfully', subscription });
  } catch (error) {
    if (error.message === 'Subscription plan not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

const deleteSubscription = async (req, res) => {
  try {
    await subscriptionService.deleteSubscription(req.params.id);
    res.json({ message: 'Subscription plan deleted successfully' });
  } catch (error) {
    if (error.message === 'Subscription plan not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription
};
