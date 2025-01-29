const authService = require('../services/authService');

const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        const {token, user} = await authService.login(email, password);

        res.json({
            message: 'Login successful',
            user, // Include user info in response
            token // Return token for client-side storage
        });
    } catch (error) {
        res.status(401).json({message: error.message});
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await authService.getProfile(req.user.id); // req.user should come from middleware verifying token
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(404).json({message: error.message});
    }
};

const updateProfile = async (req, res) => {
    const {name, email, password} = req.body;
    const userId = req.user.id; // req.user should be verified from token
    await authService.updateProfile(userId, {name, email, password});
    res.json({message: 'Profile updated successfully'});
};

module.exports = {login, getProfile, updateProfile};
