const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const AccessToken = require('../../models/AccessToken');

const createTestUser = async (userData = {}) => {
  const defaultUser = {
    email: 'test@example.com',
    password: 'password123',
    role: 'user'
  };

  const user = new User({ ...defaultUser, ...userData });
  await user.save();

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET || 'test-secret',
    { expiresIn: '24h' }
  );

  const accessToken = new AccessToken({
    token,
    userId: user._id,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
  });
  await accessToken.save();

  return { user, token };
};

module.exports = {
  createTestUser
}; 