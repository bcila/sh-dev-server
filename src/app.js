const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');
const progressRoutes = require('./routes/progressRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

dotenv.config();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(cookieParser());
app.use(express.json());

// MongoDB Connection
connectDB();

// Route Middleware
app.use('/api/auth', authRoutes);
app.use('/api/admin/users', userRoutes);
app.use('/api', courseRoutes);
app.use('/api/admin/subscriptions', subscriptionRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/notifications', notificationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
