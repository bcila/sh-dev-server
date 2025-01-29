const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Subscription = require('./models/Subscription');
const Course = require('./models/Course');
const Notification = require('./models/Notification');
const Progress = require('./models/Progress');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  await User.deleteMany();
  await Subscription.deleteMany();
  await Course.deleteMany();
  await Notification.deleteMany();
  await Progress.deleteMany();

  const hashedPassword = await bcrypt.hash('password', 10);

  const subscriptions = await Subscription.insertMany([
    { name: 'Basic Plan', price: 10, duration: { value: 1, unit: 'month' }, features: ['Access to basic courses'] },
    { name: 'Pro Plan', price: 30, duration: { value: 1, unit: 'month' }, features: ['Access to all courses', 'Personalized support'] },
  ]);

  console.log('Subscriptions seeded:', subscriptions);

  const users = await User.insertMany([
    { name: 'Admin User', email: 'admin@example.com', password: hashedPassword, role: 'admin' },
    { name: 'Trainer User', email: 'trainer@example.com', password: hashedPassword, role: 'trainer' },
    { name: 'Student User', email: 'student@example.com', password: hashedPassword, role: 'student', subscription: { plan: subscriptions[0]._id, startDate: new Date(), status: 'active' } },
  ]);

  console.log('Users seeded:', users);

  const courses = await Course.insertMany([
    {
      title: 'Introduction to Programming',
      description: 'Learn the basics of programming.',
      category: 'Programming',
      trainer: users[1]._id, // Trainer User
      lessons: [
        { title: 'Lesson 1', description: 'Introduction', content: 'Content of lesson 1', order: 1 },
        { title: 'Lesson 2', description: 'Variables', content: 'Content of lesson 2', order: 2 },
      ],
    },
    {
      title: 'Advanced JavaScript',
      description: 'Deep dive into JavaScript.',
      category: 'Programming',
      trainer: users[1]._id, // Trainer User
      lessons: [
        { title: 'Lesson 1', description: 'Closures', content: 'Content of lesson 1', order: 1 },
        { title: 'Lesson 2', description: 'Promises', content: 'Content of lesson 2', order: 2 },
      ],
    },
  ]);

  console.log('Courses seeded:', courses);

  const notifications = await Notification.insertMany([
    { title: 'Welcome!', message: 'Welcome to the platform!', user: users[2]._id }, // Student User
    { title: 'New Course Available', message: 'A new course has been added to your subscription.', user: users[2]._id }, // Student User
  ]);

  console.log('Notifications seeded:', notifications);

  const progresses = await Progress.insertMany([
    {
      user: users[2]._id, // Student User
      course: courses[0]._id, // Introduction to Programming
      completedLessons: [courses[0].lessons[0]._id],
    },
    {
      user: users[2]._id, // Student User
      course: courses[1]._id, // Advanced JavaScript
      completedLessons: [],
    },
  ]);

  console.log('Progresses seeded:', progresses);
};

const runSeeder = async () => {
  await connectDB();
  await seedData();
  mongoose.connection.close();
};

runSeeder();