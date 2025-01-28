const CourseService = require('../services/courseService');

// Public controllers (auth required)
const getAllCourses = async (req, res) => {
  try {
    const courses = await CourseService.getAllPublicCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await CourseService.getCourseById(req.params.id);
    res.json(course);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// Student controllers
const getEnrolledCourses = async (req, res) => {
  try {
    const courses = await CourseService.getEnrolledCourses(req.user.id);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const enrollCourse = async (req, res) => {
  try {
    const course = await CourseService.enrollCourse(req.params.id, req.user.id);
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Teacher controllers
const getTeachingCourses = async (req, res) => {
  try {
    const courses = await CourseService.getTeachingCourses(req.user.id);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCourse = async (req, res) => {
  try {
    const course = await CourseService.createCourse(req.body, req.user.id);
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateTeacherCourse = async (req, res) => {
  try {
    const course = await CourseService.updateTeacherCourse(req.params.id, req.body, req.user.id);
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTeacherCourse = async (req, res) => {
  try {
    await CourseService.deleteTeacherCourse(req.params.id, req.user.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Admin controllers
const getAllCoursesAdmin = async (req, res) => {
  try {
    const courses = await CourseService.getAllCoursesAdmin();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  getEnrolledCourses,
  enrollCourse,
  getTeachingCourses,
  createCourse,
  updateTeacherCourse,
  deleteTeacherCourse,
  getAllCoursesAdmin,
  updateCourse: updateTeacherCourse,
  deleteCourse: deleteTeacherCourse
};
