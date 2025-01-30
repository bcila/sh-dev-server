const Course = require('../models/Course');
const Progress = require('../models/Progress');
const User = require('../models/User');
const NotificationService = require('../services/notificationService');

// Public routes
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select('title description category thumbnail price')
      .populate('teacher', 'name');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('teacher', 'name email')
      .populate('lessons');
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student routes
const getEnrolledCourses = async (req, res) => {
  try {
    const enrollments = await Progress.find({ student: req.user._id })
      .populate({
        path: 'course',
        select: 'title description category thumbnail',
        populate: { path: 'teacher', select: 'name' }
      });

    const courses = enrollments.map(enrollment => ({
      ...enrollment.course.toObject(),
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons
    }));

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getStudentProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      student: req.user._id,
      course: req.params.courseId
    });
    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if already enrolled
    const existingProgress = await Progress.findOne({
      student: req.user._id,
      course: course._id
    });

    if (existingProgress) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    // Create new progress
    const progress = new Progress({
      student: req.user._id,
      course: course._id,
      completedLessons: [],
      progress: 0
    });

    await progress.save();
    res.status(201).json({ message: 'Successfully enrolled in course' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Teacher routes
const getTeacherCourses = async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.user._id })
      .select('title description category thumbnail isPublished')
      .populate('teacher', 'name');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTeacherStats = async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.user._id });
    const courseIds = courses.map(course => course._id);
    
    const stats = await Progress.aggregate([
      { $match: { course: { $in: courseIds } } },
      {
        $group: {
          _id: null,
          totalStudents: { $sum: 1 },
          averageProgress: { $avg: '$progress' }
        }
      }
    ]);

    res.json({
      totalCourses: courses.length,
      ...(stats[0] || { totalStudents: 0, averageProgress: 0 })
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourseAnalytics = async (req, res) => {
  try {
    const course = await Course.findOne({
      _id: req.params.id,
      teacher: req.user._id
    }).populate('lessons');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    const progress = await Progress.find({ course: course._id })
      .populate('student', 'name email');

    const analytics = {
      courseInfo: {
        title: course.title,
        totalLessons: course.lessons.length
      },
      stats: {
        totalStudents: progress.length,
        averageCompletionRate: progress.reduce((acc, curr) => acc + curr.progress, 0) / progress.length || 0
      },
      lessonStats: course.lessons.map(lesson => ({
        lessonId: lesson._id,
        title: lesson.title,
        completionCount: progress.filter(p => p.completedLessons.includes(lesson._id)).length,
        completionRate: (progress.filter(p => p.completedLessons.includes(lesson._id)).length / progress.length) * 100 || 0
      })),
      studentProgress: progress.map(p => ({
        student: p.student,
        completedLessons: p.completedLessons.length,
        progress: p.progress
      }))
    };

    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin routes
const getAllCoursesAdmin = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCourse = async (req, res) => {
  try {
    const course = new Course({
      ...req.body,
      teacher: req.body.teacherId
    });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    // Delete related progress
    await Progress.deleteMany({ course: req.params.id });
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  getEnrolledCourses,
  getStudentProgress,
  enrollCourse,
  getTeacherCourses,
  getTeacherStats,
  getCourseAnalytics,
  getAllCoursesAdmin,
  createCourse,
  updateCourse,
  deleteCourse
};
