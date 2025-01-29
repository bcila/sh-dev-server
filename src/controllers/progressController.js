const progressService = require('../services/progressService');

const getProgress = async (req, res) => {
  try {
    const progress = await progressService.getUserProgress(req.user.id, req.params.courseId);
    res.json(progress);
  } catch (error) {
    if (error.message === 'Progress not found') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

const getAllProgress = async (req, res) => {
  try {
    const progresses = await progressService.getAllUserProgress(req.user.id);
    res.json(progresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const markLessonComplete = async (req, res) => {
  try {
    const progress = await progressService.markLessonComplete(
      req.user.id,
      req.params.courseId,
      req.params.lessonId
    );
    res.json(progress);
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

const markLessonIncomplete = async (req, res) => {
  try {
    const progress = await progressService.markLessonIncomplete(
      req.user.id,
      req.params.courseId,
      req.params.lessonId
    );
    res.json(progress);
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

const getStudentStats = async (req, res) => {
  try {
    const stats = await progressService.getStudentStats(req.user.id);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecentCourses = async (req, res) => {
  try {
    const courses = await progressService.getRecentCourses(req.user.id);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProgressReport = async (req, res) => {
  try {
    const report = await progressService.generateProgressReport(
      req.user.id,
      req.params.courseId
    );
    res.json(report);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getProgress,
  getAllProgress,
  markLessonComplete,
  markLessonIncomplete,
  getStudentStats,
  getRecentCourses,
  getProgressReport
}; 