const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Check if user still exists and is active
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(403).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// Check user role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Check subscription status and limits
const checkSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if subscription is active
    if (user.subscription.status !== 'active' && user.subscription.plan !== 'free') {
      return res.status(403).json({
        success: false,
        message: 'Active subscription required'
      });
    }

    // Check if subscription has expired
    if (user.subscription.endDate && user.subscription.endDate < new Date()) {
      user.subscription.status = 'expired';
      await user.save();
      
      return res.status(403).json({
        success: false,
        message: 'Subscription has expired'
      });
    }

    req.userSubscription = user.subscription;
    next();
  } catch (error) {
    console.error('Subscription check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify subscription',
      error: error.message
    });
  }
};

// Rate limiting for exam attempts
const examAttemptLimit = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.canAttemptExam()) {
      return res.status(429).json({
        success: false,
        message: 'Exam attempt limit reached for your subscription plan',
        data: {
          currentAttempts: user.subscription.limits.examAttempts,
          maxAttempts: user.subscription.limits.maxExamAttempts
        }
      });
    }

    next();
  } catch (error) {
    console.error('Exam attempt limit check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check exam attempt limits',
      error: error.message
    });
  }
};

module.exports = {
  authenticateToken,
  requireRole,
  checkSubscription,
  examAttemptLimit
};