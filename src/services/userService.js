const User = require('../models/User');

class UserService {
  async getAllUsers() {
    return await User.find();
  }

  async createUser(userData) {
    const userExists = await User.findOne({ email: userData.email });
    if (userExists) throw new Error('User already exists');

    const user = new User(userData);
    return await user.save();
  }

  async updateUser(userId, userData) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.name = userData.name || user.name;
    user.email = userData.email || user.email;
    user.password = userData.password || user.password;
    user.role = userData.role || user.role;

    return await user.save();
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
