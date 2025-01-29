const Course = require('../models/Course');
const Progress = require('../models/Progress');
const User = require('../models/User');

class TeacherService {
  async getTeacherStats(teacherId) {
    try {
      // Öğretmenin kurslarını bul
      const courses = await Course.find({ teacher: teacherId });
      const courseIds = courses.map(course => course._id);

      // Kurslara kayıtlı benzersiz öğrenci sayısını bul
      const enrolledStudents = await Progress.distinct('user', {
        course: { $in: courseIds }
      });

      // Tamamlanma oranını hesapla
      const progressRecords = await Progress.find({
        course: { $in: courseIds }
      }).populate('course', 'lessons');

      let totalCompletionRate = 0;
      let totalStudents = 0;

      progressRecords.forEach(record => {
        const completionRate = (record.completedLessons.length / record.course.lessons.length) * 100;
        totalCompletionRate += completionRate;
        totalStudents++;
      });

      return {
        totalCourses: courses.length,
        totalStudents: enrolledStudents.length,
        averageCompletionRate: totalStudents > 0 
          ? Math.round(totalCompletionRate / totalStudents) 
          : 0
      };
    } catch (error) {
      console.error('Error getting teacher stats:', error);
      throw error;
    }
  }

  async getCourseAnalytics(courseId) {
    try {
      const course = await Course.findById(courseId)
        .populate('teacher', 'name');

      if (!course) {
        throw new Error('Course not found');
      }

      const progress = await Progress.find({ course: courseId })
        .populate('user', 'name email');

      const totalStudents = progress.length;
      const completedLessonsCount = {};
      let totalCompletionRate = 0;

      progress.forEach(record => {
        // Her ders için tamamlanma sayısını hesapla
        record.completedLessons.forEach(lessonId => {
          completedLessonsCount[lessonId] = (completedLessonsCount[lessonId] || 0) + 1;
        });

        // Öğrenci bazında tamamlanma oranı
        const studentCompletionRate = (record.completedLessons.length / course.lessons.length) * 100;
        totalCompletionRate += studentCompletionRate;
      });

      // Ders bazında istatistikler
      const lessonStats = course.lessons.map(lesson => ({
        lessonId: lesson._id,
        title: lesson.title,
        completionCount: completedLessonsCount[lesson._id] || 0,
        completionRate: totalStudents > 0
          ? Math.round((completedLessonsCount[lesson._id] || 0) / totalStudents * 100)
          : 0
      }));

      return {
        courseInfo: {
          title: course.title,
          teacher: course.teacher.name,
          totalLessons: course.lessons.length
        },
        stats: {
          totalStudents,
          averageCompletionRate: totalStudents > 0
            ? Math.round(totalCompletionRate / totalStudents)
            : 0
        },
        lessonStats,
        studentProgress: progress.map(p => ({
          student: p.user,
          completedLessons: p.completedLessons.length,
          progress: Math.round((p.completedLessons.length / course.lessons.length) * 100)
        }))
      };
    } catch (error) {
      console.error('Error getting course analytics:', error);
      throw error;
    }
  }
}

module.exports = new TeacherService(); 