const authService = require('../services/authService');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await authService.login(email, password);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',   // false for dev
      sameSite: 'Strict',
      maxAge: 3600000 // 1 hour
    });

    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await authService.getProfile(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

module.exports = { login, getProfile };
