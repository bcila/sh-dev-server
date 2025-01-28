const authService = require('../services/authService');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { token, user } = await authService.login(email, password);
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 gün
    });

    res.json({ 
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await authService.getProfile(req.user.id);
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  const { name, email, password } = req.body;
  const userId = req.user.id;
  await authService.updateProfile(userId, { name, email, password });
  res.json({ message: 'Profile updated successfully' });
};

module.exports = { login, getProfile, updateProfile };