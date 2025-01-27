const Course = require('../models/Course');

class CourseService {
  async getAllCourses() {
    return await Course.find().populate('instructor', 'name');
  }

  async createCourse(courseData, instructorId) {
    const course = new Course({
      ...courseData,
      instructor: instructorId,
      lessons: courseData.lessons.map((lesson, index) => ({
        ...lesson,
        order: index + 1
      }))
    });

    return await course.save();
  }

  async updateCourse(courseId, courseData) {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    course.title = courseData.title || course.title;
    course.description = courseData.description || course.description;
    course.category = courseData.category || course.category;
    
    if (courseData.lessons) {
      course.lessons = courseData.lessons.map((lesson, index) => ({
        ...lesson,
        order: index + 1
      }));
    }

    return await course.save();
  }

  async deleteCourse(courseId) {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }

    await course.deleteOne();
    return course;
  }
}

module.exports = new CourseService(); 