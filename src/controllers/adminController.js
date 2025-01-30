const adminService = require('../services/adminService');

const getDashboardStats = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await adminService.getAllCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCourse = async (req, res) => {
  try {
    const course = await adminService.createCourse(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await adminService.updateCourse(req.params.id, req.body);
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    await adminService.deleteCourse(req.params.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await adminService.getAllSubscriptions();
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSubscription = async (req, res) => {
  try {
    const subscription = await adminService.createSubscription(req.body);
    res.status(201).json(subscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateSubscription = async (req, res) => {
  try {
    const subscription = await adminService.updateSubscription(req.params.id, req.body);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.json(subscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteSubscription = async (req, res) => {
  try {
    const subscription = await adminService.deleteSubscription(req.params.id);
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTeachers = async (req, res) => {
  try {
    const teachers = await adminService.getTeachers();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getDashboardStats,
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getAllSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getTeachers
};
