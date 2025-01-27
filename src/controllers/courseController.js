const Course = require('../models/Course');

// Tüm kursları getir
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'name');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Yeni kurs ekle
const createCourse = async (req, res) => {
  const { title, description, category, lessons } = req.body;

  try {
    const course = new Course({
      title,
      description,
      category,
      instructor: req.user.id,
      lessons: lessons.map((lesson, index) => ({
        ...lesson,
        order: index + 1
      }))
    });

    await course.save();
    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Kursu güncelle
const updateCourse = async (req, res) => {
  const { title, description, category, lessons } = req.body;

  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    course.title = title || course.title;
    course.description = description || course.description;
    course.category = category || course.category;
    if (lessons) {
      course.lessons = lessons.map((lesson, index) => ({
        ...lesson,
        order: index + 1
      }));
    }

    await course.save();
    res.json({ message: 'Course updated successfully', course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Kursu sil
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    await course.deleteOne();
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse
};
