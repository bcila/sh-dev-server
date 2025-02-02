const Course = require('../models/Course');
const User = require('../models/User');
const Progress = require("../models/Progress");

class CourseService {
    // Public methods
    async getAllPublicCourses() {
        return Course.find({status: 'published'}).populate('trainer', 'name');
    }

    async getCourseById(courseId) {
        const course = await Course.findById(courseId).populate('trainer', 'name');
        if (!course) {
            throw new Error('Course not found');
        }
        return course;
    }

    // Student methods
    async getEnrolledCourses(userId) {
        const enrollments = await Progress.find({user: studentId})
            .populate({
                path: 'course',
                select: 'title description category thumbnail',
                populate: {path: 'trainer', select: 'name'}
            });

        const courses = enrollments.map(enrollment => ({
            ...enrollment.course.toObject(),
            progress: enrollment.progress,
            completedLessons: enrollment.completedLessons
        }));

        return courses || [];
    }

    async enrollCourse(courseId, studentId) {
        const course = await Course.findOne({
            _id: courseId,
            status: 'published'
        });

        if (!course) {
            throw new Error('Course not found');
        }

        // Öğrenciyi enrolledStudents array'ine ekle, eğer zaten ekliyse eklenmez
        if (course.enrolledStudents.includes(studentId)) {
            throw new Error('Already enrolled in this course');
        }

        course.enrolledStudents.push(studentId);

        await course.save();

        const isEnrolled = course.enrolledStudents.includes(studentId);

        if (isEnrolled) {
            const progress = new Progress({
                student: studentId,
                course: courseId,
                completedLessons: [],
                progress: 0
            });

            await progress.save();
        }

        return isEnrolled;
    }

    // Teacher methods
    async getTeachingCourses(trainerId) {
        return Course.find({trainer: trainerId});
    }

    async getTrainerStats(trainerId) {
        const courses = await Course.find({trainer: trainerId});
        const courseIds = courses.map(course => course._id);

        const stats = await Progress.aggregate([
            {$match: {course: {$in: courseIds}}},
            {
                $group: {
                    _id: null,
                    totalStudents: {$sum: 1},
                    averageProgress: {$avg: '$progress'}
                }
            }
        ]);

        return {
            totalCourses: courses.length,
            ...(stats[0] || {totalStudents: 0, averageProgress: 0})
        }
    }

    async getCourseAnalytics(courseId, trainerId) {
        const course = await Course.findOne({
            _id: courseId,
            teacher: trainerId
        }).populate('lessons');

        if (!course) {
            return res.status(404).json({message: 'Course not found'});
        }

        const progress = await Progress.find({course: course._id})
            .populate('student', 'name email');

        return {
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
    }

    async createCourse(courseData, trainerId) {
        const course = new Course({
            ...courseData,
            trainer: trainerId
        });
        return await course.save();
    }

    async updateCourse(courseId, courseData) {
        const course = await Course.findByIdAndUpdate(
            courseId,
            courseData,
            {new: true}
        );
        if (!course) {
            return res.status(404).json({message: 'Course not found'});
        }
    }

    async deleteCourse(courseId) {
        const course = await Course.findByIdAndDelete(courseId);
        if (!course) {
            return res.status(404).json({message: 'Course not found'});
        }
        // Delete related progress
        await Progress.deleteMany({course: req.params.id});
    }

    // Admin methods
    async getAllCoursesAdmin() {
        return Course.find().populate('instructor', 'name');
    }
}

module.exports = new CourseService(); 