const Progress = require('../models/Progress');
const Course = require('../models/Course');

class ProgressService {
  async getUserProgress(userId, courseId) {
    let progress = await Progress.findOne({
      user: userId,
      course: courseId
    }).populate('course', 'title lessons');

    if (!progress) {
      const course = await Course.findById(courseId);
      if (!course) {
        throw new Error('Course not found');
      }

      progress = new Progress({
        user: userId,
        course: courseId,
        completedLessons: [],
        progress: 0
      });
      await progress.save();
    }

    return progress;
  }

  async getAllUserProgress(userId) {
    return await Progress.find({ user: userId })
      .populate('course', 'title lessons')
      .sort({ lastAccessed: -1 });
  }

  async markLessonComplete(userId, courseId, lessonId) {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    const lessonExists = course.lessons.some(lesson => lesson._id.toString() === lessonId);
    if (!lessonExists) {
      throw new Error('Lesson not found in this course');
    }

    let progress = await Progress.findOne({ user: userId, course: courseId });
    if (!progress) {
      progress = new Progress({
        user: userId,
        course: courseId,
        completedLessons: [],
        progress: 0
      });
    }

    if (!progress.completedLessons.some(lesson => lesson.lessonId.toString() === lessonId)) {
      progress.completedLessons.push({ lessonId });
      progress.progress = (progress.completedLessons.length / course.lessons.length) * 100;
      progress.lastAccessed = new Date();
      await progress.save();
    }

    return progress;
  }

  async markLessonIncomplete(userId, courseId, lessonId) {
    const progress = await Progress.findOne({ user: userId, course: courseId });
    if (!progress) {
      throw new Error('Progress not found');
    }

    progress.completedLessons = progress.completedLessons.filter(
      lesson => lesson.lessonId.toString() !== lessonId
    );

    const course = await Course.findById(courseId);
    progress.progress = (progress.completedLessons.length / course.lessons.length) * 100;
    progress.lastAccessed = new Date();
    await progress.save();

    return progress;
  }
}

module.exports = new ProgressService(); 