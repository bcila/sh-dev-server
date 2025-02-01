const User = require('../models/User');
const bcrypt = require('bcryptjs');

class UserService {
    async getAll() {
        return User.find().select('-password');
    }

    async getById(id) {
        return User.findById(id).select('-password');
    }

    async createUser(userData) {
        const {email, password, name, role} = userData;

        // Check if user already exists
        const existingUser = await User.findOne({email});
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Hash password
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            name,
            email,
            password, // Password hashed in model with pre function
            role
        });

        await user.save();
        const response = user.toObject();
        delete user.password; // Delete password before return the new user
        return response;
    }

    async updateUser(userId, userData) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // If password is being updated, hash it
        // if (userData.password) {
        //   const salt = await bcrypt.genSalt(10);
        //   userData.password = await bcrypt.hash(userData.password, salt);
        // }

        return User.findByIdAndUpdate(userId, {$set: userData}, {new: true}).select('-password');
    }

    async deleteUser(userId) {
        const user = await User.findByIdAndDelete(userId, function (err, docs) {
            if (err) {
                throw err;
            } else {
                return docs;
            }
        });
        if (!user) {
            throw new Error('User not found');
        }
        return false;
    }

    async updateRole(userId, role) {
        const user = await User.findByIdAndUpdate(
            userId,
            {$set: {role: role}},
            {new: true}
        ).select('-password');

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    async updateStatus(userId, status) {
        const user = await User.findByIdAndUpdate(
            userId,
            {$set: {'subscription.status': status}},
            {new: true}
        ).select('-password');

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }
}

module.exports = new UserService();
