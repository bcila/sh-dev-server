const User = require('../models/User');
const Course = require('../models/Course');
const Subscription = require('../models/Subscription');
const Progress = require('../models/Progress');

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

  async getRecentActivities(limit = 10) {
    try {
      // Son kullanıcı kayıtları
      const recentUsers = await User.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('name createdAt')
        .lean();

      // Son kurs kayıtları
      const recentCourses = await Course.find()
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('title createdAt')
        .lean();

      // Son abonelikler
      const recentSubscriptions = await User.find({
        'subscription.startDate': { $exists: true }
      })
        .sort({ 'subscription.startDate': -1 })
        .limit(limit)
        .select('name subscription')
        .lean();

      // Aktiviteleri birleştir ve sırala
      const activities = [
        ...recentUsers.map(user => ({
          type: 'user',
          description: `New user registered: ${user.name}`,
          createdAt: user.createdAt
        })),
        ...recentCourses.map(course => ({
          type: 'course',
          description: `New course created: ${course.title}`,
          createdAt: course.createdAt
        })),
        ...recentSubscriptions.map(sub => ({
          type: 'subscription',
          description: `New subscription: ${sub.name}`,
          createdAt: sub.subscription.startDate
        }))
      ];

      return activities
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting recent activities:', error);
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

  async getTeachers() {
    try {
      const teachers = await User.find({ role: 'trainer' }).lean();
      return teachers;
    } catch (error) {
      console.error('Error getting teachers:', error);
      throw error;
    }
  }

  async getAllCourses() {
    try {
      const courses = await Course.find().lean();
      return courses;
    } catch (error) {
      console.error('Error getting courses:', error);
      throw error;
    }
  }

  async createCourse(courseData) {
    try {
      const course = new Course(courseData);
      await course.save();
      return course;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error;
    }
  }

  async updateCourse(courseId, courseData) {
    try {
      const course = await Course.findByIdAndUpdate(courseId, courseData, { new: true }).lean();
      return course;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  }

  async deleteCourse(courseId) {
    try {
      await Course.findByIdAndDelete(courseId);
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }

  async getAllSubscriptions() {
    try {
      const subscriptions = await Subscription.find().lean();
      return subscriptions;
    } catch (error) {
      console.error('Error getting subscriptions:', error);
      throw error;
    }
  }

  async createSubscription(subscriptionData) {
    try {
      const subscription = new Subscription(subscriptionData);
      await subscription.save();
      return subscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  async updateSubscription(subscriptionId, subscriptionData) {
    try {
      const subscription = await Subscription.findByIdAndUpdate(subscriptionId, subscriptionData, { new: true }).lean();
      return subscription;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  async deleteSubscription(subscriptionId) {
    try {
      const subscription = await Subscription.findByIdAndDelete(subscriptionId).lean();
      return subscription;
    } catch (error) {
      console.error('Error deleting subscription:', error);
      throw error;
    }
  }
}

module.exports = new AdminService();