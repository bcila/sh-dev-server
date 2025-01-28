const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

class AuthService {
  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return { token, user };
  }

  async getProfile(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateProfile(userId, profileData) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    Object.assign(user, profileData);
    await user.save();

    return user;
  }
}


module.exports = new AuthService();
