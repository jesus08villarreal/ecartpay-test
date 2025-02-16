const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const AccessToken = require('../../models/AccessToken');

const createTestUser = async (userData = {}) => {
  const defaultUser = {
    email: 'test@example.com',
    password: 'password123',
    role: 'admin'
  };

  const user = new User({ ...defaultUser, ...userData });
  await user.save();

  const jwtSecret = process.env.JWT_SECRET || 'test_secret_key_123';
  
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    jwtSecret,
    { expiresIn: '24h' }
  );

  const accessToken = new AccessToken({
    token,
    userId: user._id,
    isValid: true,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
  });
  await accessToken.save();

  return { user, token: `Bearer ${token}` };
};

module.exports = {
  createTestUser
}; 