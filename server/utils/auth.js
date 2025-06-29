const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Generate random token
const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate JWT token
const generateJWT = (payload, expiresIn = '7d') => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', { expiresIn });
};

// Verify JWT token
const verifyJWT = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
};

// Hash password
const hashPassword = async (password) => {
  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
};

// Compare password
const comparePassword = async (password, hashedPassword) => {
  const bcrypt = require('bcryptjs');
  return bcrypt.compare(password, hashedPassword);
};

module.exports = {
  generateToken,
  generateJWT,
  verifyJWT,
  hashPassword,
  comparePassword
};