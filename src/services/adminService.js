const User = require('../models/User');
const Course = require('../models/Course');

class AdminService {
  async getDashboardStats() {
    try {
      const [
        totalUsers,
        activeCourses,
        activeSubscriptions,
        totalRevenue
      ] = await Promise.all([
        User.countDocuments({ role: { $ne: 'admin' } }),
        Course.countDocuments({ status: 'published' }),
        User.countDocuments({ 'subscription.status': 'active' }),
        this.calculateTotalRevenue()
      ]);

      return {
        totalUsers,
        activeCourses,
        activeSubscriptions,
        totalRevenue
      };
    } catch (error) {
      console.error('Error getting admin stats:', error);
      throw error;
    }
  }


  async calculateTotalRevenue() {
    try {
      const subscriptions = await User.find({
        'subscription.status': 'active'
      }).populate('subscription.plan');

      return subscriptions.reduce((total, user) => {
        return total + (user.subscription.plan?.price || 0);
      }, 0);
    } catch (error) {
      console.error('Error calculating revenue:', error);
      throw error;
    }
  }
}

module.exports = new AdminService();