const Subscription = require('../models/Subscription');

// Tüm abonelikleri getir
const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ active: true });
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Yeni abonelik planı oluştur
const createSubscription = async (req, res) => {
  const { name, price, duration, features } = req.body;

  try {
    // Validate duration
    if (!duration.value || !duration.unit || !['day', 'month', 'year'].includes(duration.unit)) {
      return res.status(400).json({ message: 'Invalid duration format' });
    }

    const subscription = new Subscription({
      name,
      price,
      duration,
      features: features || []
    });

    await subscription.save();
    res.status(201).json({ message: 'Subscription plan created successfully', subscription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Abonelik planını güncelle
const updateSubscription = async (req, res) => {
  const { name, price, duration, features, active } = req.body;

  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) return res.status(404).json({ message: 'Subscription plan not found' });

    // Validate duration if provided
    if (duration) {
      if (!duration.value || !duration.unit || !['day', 'month', 'year'].includes(duration.unit)) {
        return res.status(400).json({ message: 'Invalid duration format' });
      }
    }

    subscription.name = name || subscription.name;
    subscription.price = price || subscription.price;
    subscription.duration = duration || subscription.duration;
    subscription.features = features || subscription.features;
    subscription.active = active !== undefined ? active : subscription.active;

    await subscription.save();
    res.json({ message: 'Subscription plan updated successfully', subscription });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Abonelik planını sil (soft delete)
const deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) return res.status(404).json({ message: 'Subscription plan not found' });

    subscription.active = false;
    await subscription.save();
    res.json({ message: 'Subscription plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription
};
