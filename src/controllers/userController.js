const User = require('../models/User');
const bcrypt = require('bcryptjs');
const userService = require("../services/userService");

// Get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Get user by ID
const getUserById = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await userService.getById(userId);
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Create new user
const createUser = async (req, res) => {
    try {
        const {email, password, name, role} = req.body;

        const userData = {
            'email': email,
            'password': password,
            'name': name,
            'role': role
        }

        const newUser = await userService.createUser(userData);

        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const {name, email, role} = req.body;
        const updates = {name, email, role};

        if (req.body.password) {
            updates.password = req.body.password;
        }

        const newUser = await userService.updateUser(userId, updates);

        res.json(newUser);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const user = await userService.deleteUser(req.params.id);
        res.json({message: 'User deleted successfully'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

// Update user role
const updateUserRole = async (req, res) => {
    try {
        const userId = req.params.id;
        const {role} = req.body;

        const user = await userService.updateRole(userId, role);

        res.json(user);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

// Update user status
const updateUserStatus = async (req, res) => {
    const userId = req.params.id;
    const {status} = req.body;
    try {
        const user = await userService.updateStatus(userId, status);

        res.json(user);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    updateUserRole,
    updateUserStatus
};
