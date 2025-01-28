const User = require('../models/User');
const bcrypt = require('bcryptjs');

class UserService {
  async getAllUsers() {
    return await User.find().select('-password');
  }

  async createUser(userData) {
    const { email, password, name, role } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await user.save();
    return user;
  }

  async updateUser(userId, userData) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // If password is being updated, hash it
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }

    Object.assign(user, userData);
    await user.save();
    return user;
  }

  async deleteUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    await user.deleteOne();
    return user;
  }
}

module.exports = new UserService();
