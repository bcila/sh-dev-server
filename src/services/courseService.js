const Course = require('../models/Course');

class CourseService {
  // Public methods
  async getAllPublicCourses() {
    return await Course.find({ status: 'published' }).populate('instructor', 'name');
  }

  async getCourseById(courseId) {
    const course = await Course.findById(courseId).populate('instructor', 'name');
    if (!course) {
      throw new Error('Course not found');
    }
    return course;
  }

  // Student methods
  async getEnrolledCourses(studentId) {
    return await Course.find({
      enrolledStudents: studentId,
      status: 'published'
    }).populate('instructor', 'name');
  }

  async enrollCourse(courseId, studentId) {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error('Course not found');
    }
    if (course.enrolledStudents.includes(studentId)) {
      throw new Error('Already enrolled in this course');
    }
    course.enrolledStudents.push(studentId);
    return await course.save();
  }

  // Teacher methods
  async getTeachingCourses(teacherId) {
    return await Course.find({ instructor: teacherId });
  }

  async createCourse(courseData, instructorId) {
    const course = new Course({
      ...courseData,
      instructor: instructorId
    });
    return await course.save();
  }

  async updateTeacherCourse(courseId, courseData, teacherId) {
    const course = await Course.findOne({ _id: courseId, instructor: teacherId });
    if (!course) {
      throw new Error('Course not found or unauthorized');
    }
    Object.assign(course, courseData);
    return await course.save();
  }

  async deleteTeacherCourse(courseId, teacherId) {
    const course = await Course.findOne({ _id: courseId, instructor: teacherId });
    if (!course) {
      throw new Error('Course not found or unauthorized');
    }
    await course.deleteOne();
    return course;
  }

  // Admin methods
  async getAllCoursesAdmin() {
    return await Course.find().populate('instructor', 'name');
  }
}

module.exports = new CourseService(); 