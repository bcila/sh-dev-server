const Progress = require('../models/Progress');
const Course = require('../models/Course');

// Kullanıcının kurs ilerlemesini getir
const getProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      user: req.user.id,
      course: req.params.courseId
    }).populate('course', 'title lessons');

    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Kullanıcının tüm kurs ilerlemelerini getir
const getAllProgress = async (req, res) => {
  try {
    const progresses = await Progress.find({ user: req.user.id })
      .populate('course', 'title lessons')
      .sort({ lastAccessed: -1 });

    res.json(progresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dersi tamamlandı olarak işaretle
const markLessonComplete = async (req, res) => {
  const { courseId, lessonId } = req.params;

  try {
    let progress = await Progress.findOne({ user: req.user.id, course: courseId });
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Dersin kursa ait olduğunu kontrol et
    const lessonExists = course.lessons.some(lesson => lesson._id.toString() === lessonId);
    if (!lessonExists) {
      return res.status(404).json({ message: 'Lesson not found in this course' });
    }

    // İlerleme kaydı yoksa oluştur
    if (!progress) {
      progress = new Progress({
        user: req.user.id,
        course: courseId,
        completedLessons: [],
        progress: 0
      });
    }

    // Ders zaten tamamlanmışsa kontrol et
    const lessonCompleted = progress.completedLessons.some(
      lesson => lesson.lessonId.toString() === lessonId
    );

    if (!lessonCompleted) {
      progress.completedLessons.push({ lessonId });
      progress.progress = (progress.completedLessons.length / course.lessons.length) * 100;
      progress.lastAccessed = new Date();
      await progress.save();
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Dersi tamamlanmamış olarak işaretle
const markLessonIncomplete = async (req, res) => {
  const { courseId, lessonId } = req.params;

  try {
    const progress = await Progress.findOne({ user: req.user.id, course: courseId });
    if (!progress) {
      return res.status(404).json({ message: 'Progress not found' });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    progress.completedLessons = progress.completedLessons.filter(
      lesson => lesson.lessonId.toString() !== lessonId
    );
    
    progress.progress = (progress.completedLessons.length / course.lessons.length) * 100;
    progress.lastAccessed = new Date();
    
    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProgress,
  getAllProgress,
  markLessonComplete,
  markLessonIncomplete
}; 