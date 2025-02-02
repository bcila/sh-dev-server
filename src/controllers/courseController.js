const Progress = require('../models/Progress');
const courseService = require("../services/courseService");

// Public routes
const getAllCourses = async (req, res) => {
    try {
        const courses = await courseService.getAllPublicCourses();
        res.json(courses);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getCourseById = async (req, res) => {
    const courseId = req.params.id;
    try {
        const course = await courseService.getCourseById(courseId);
        res.json(course);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Student routes
const getEnrolledCourses = async (req, res) => {
    const studentId = req.user._id;

    try {
        const courses = courseService.getEnrolledCourses(studentId);

        res.json(courses);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getStudentProgress = async (req, res) => {
    try {
        const progress = await Progress.findOne({
            student: req.user._id,
            course: req.params.courseId
        });
        if (!progress) {
            return res.status(404).json({message: 'Progress not found'});
        }
        res.json(progress);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const enrollCourse = async (req, res) => {
    const studentId = req.user._id;
    const courseId = req.params.courseId;
    try {
        const isEnrolled = await courseService.enrollCourse(courseId, studentId);
        if (isEnrolled) {
            res.status(201).json({message: 'Successfully enrolled in course'});
        } else {
            res.status(400).json({message: 'Connot enrolled in course'});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Teacher routes
const getTeacherCourses = async (req, res) => {
    try {
        const courses = await courseService.getTeachingCourses()
        res.json(courses);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getTeacherStats = async (req, res) => {
    const trainerId = req.user._id;
    try {
        const stats = await courseService.getTrainerStats(trainerId);

        res.json(stats);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const getCourseAnalytics = async (req, res) => {
    const courseId = req.params.id;
    const trainerId = req.user._id;

    try {
        const analytics = await courseService.getCourseAnalytics(courseId, trainerId);
        res.json(analytics);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Admin routes
const getAllCoursesAdmin = async (req, res) => {
    try {
        const courses = await courseService.getAllCoursesAdmin();
        res.json(courses);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

const createCourse = async (req, res) => {
    const courseData = req.body;
    try {
        const course = courseService.createCourse(courseData, courseData.trainer);
        res.status(201).json(course);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

const updateCourse = async (req, res) => {
    const courseId = req.params.id;
    const courseData = req.body;
    try {
        const updatedCourse = await courseService.updateCourse(courseId, courseData);
        res.json(updatedCourse);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

const deleteCourse = async (req, res) => {
    const courseId = req.params.id
    try {
        await courseService.deleteCourse(courseId);
        res.json({message: 'Course deleted successfully'});
    } catch (error) {
        res.status(500).json({message: error.message});
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
