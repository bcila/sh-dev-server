const Progress = require('../models/Progress');
const Course = require('../models/Course');
const notificationService = require('./notificationService');

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
    return Progress.find({user: userId})
        .populate('course', 'title lessons')
        .sort({lastAccessed: -1});
  }

  async getProgress(userId, courseId) {
    let progress = await Progress.findOne({ user: userId, course: courseId });
    
    if (!progress) {
      progress = await Progress.create({
        user: userId,
        course: courseId,
        completedLessons: [],
        progress: 0
      });
    }
    
    return progress;
  }

  async markLessonComplete(userId, courseId, lessonId) {
    const progress = await this.getProgress(userId, courseId);
    const course = await Course.findById(courseId);
    
    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
      
      // Hesapla ilerleme yüzdesi
      const totalLessons = course.lessons.length;
      const completedCount = progress.completedLessons.length;
      progress.progress = Math.round((completedCount / totalLessons) * 100);
      
      await progress.save();
      
      // Bildirim gönder

      // Kurs tamamlandıysa bildirim gönder
      if (progress.progress === 100) {
        await notificationService.notifyLessonComplete(userId, courseId, lessonId);
      }
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

  async getUserCourseProgress(userId) {
    return Progress.find({user: userId})
        .populate('course', 'title category')
        .sort({lastAccessed: -1});
  }

  async getStudentStats(userId) {
    try {
      const progress = await Progress.find({ user: userId })
        .populate('course', 'title lessons');

      const totalCourses = progress.length;
      let totalCompletedLessons = 0;
      let totalLessons = 0;

      progress.forEach(p => {
        totalCompletedLessons += p.completedLessons.length;
        totalLessons += p.course.lessons.length;
      });

      const averageProgress = totalLessons > 0
        ? Math.round((totalCompletedLessons / totalLessons) * 100)
        : 0;

      return {
        totalCourses,
        completedLessons: totalCompletedLessons,
        averageProgress
      };
    } catch (error) {
      console.error('Error getting student stats:', error);
      throw error;
    }
  }

  async getRecentCourses(userId, limit = 6) {
    try {
      return await Progress.find({ user: userId })
        .populate('course', 'title category')
        .sort({ lastAccessed: -1 })
        .limit(limit);
    } catch (error) {
      console.error('Error getting recent courses:', error);
      throw error;
    }
  }

  async generateProgressReport(userId, courseId) {
    try {
      const progress = await Progress.findOne({ user: userId, course: courseId })
        .populate('course', 'title lessons')
        .populate('user', 'name email');

      if (!progress) {
        throw new Error('Progress not found');
      }

      const totalLessons = progress.course.lessons.length;
      const completedLessons = progress.completedLessons.length;
      const progressPercentage = Math.round((completedLessons / totalLessons) * 100);

      return {
        user: {
          name: progress.user.name,
          email: progress.user.email
        },
        course: {
          title: progress.course.title,
          totalLessons
        },
        progress: {
          completedLessons,
          progressPercentage,
          startedAt: progress.startedAt,
          lastAccessed: progress.lastAccessed
        }
      };
    } catch (error) {
      console.error('Error generating progress report:', error);
      throw error;
    }
  }
}

module.exports = new ProgressService(); 