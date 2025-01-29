const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

class AuthService {
  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    return { token, user: userWithoutPassword };
  }

  async getProfile(userId) {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateProfile(userId, updateData) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Email değişikliği varsa, benzersiz olduğunu kontrol et
    if (updateData.email && updateData.email !== user.email) {
      const existingUser = await User.findOne({ email: updateData.email });
      if (existingUser) {
        throw new Error('Email already in use');
      }
    }

    // Şifre güncellenmişse hash'le
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    Object.assign(user, updateData);
    await user.save();

    const updatedUser = await User.findById(userId).select('-password');
    return updatedUser;
  }
}

module.exports = new AuthService();
