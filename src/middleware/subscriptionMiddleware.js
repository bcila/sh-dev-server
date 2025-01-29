const subscriptionService = require('../services/subscriptionService');

const checkSubscription = async (req, res, next) => {
  try {
    const hasValidSubscription = await subscriptionService.checkSubscriptionStatus(req.user.id);
    if (!hasValidSubscription) {
      return res.status(403).json({ 
        message: 'Active subscription required to access this content' 
      });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = checkSubscription; 