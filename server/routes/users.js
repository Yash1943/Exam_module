const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { ExamAttempt } = require('../models/Exam');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, [
  body('fullName').optional().trim().isLength({ min: 2 }),
  body('profile.collegeName').optional().trim(),
  body('profile.branch').optional().trim(),
  body('profile.semester').optional().trim(),
  body('profile.prnNo').optional().trim(),
  body('profile.phoneNo').optional().isMobilePhone(),
  body('profile.aadharCardNo').optional().isLength({ min: 12, max: 12 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const updateData = {};
    if (req.body.fullName) updateData.fullName = req.body.fullName;
    if (req.body.profile) updateData.profile = req.body.profile;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

// Change password
router.put('/change-password', authenticateToken, [
  body('currentPassword').exists(),
  body('newPassword').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password',
      error: error.message
    });
  }
});

// Get user statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    const [
      totalAttempts,
      completedAttempts,
      averageScore,
      bestScore,
      recentAttempts
    ] = await Promise.all([
      ExamAttempt.countDocuments({ userId }),
      ExamAttempt.countDocuments({ userId, status: 'completed' }),
      ExamAttempt.aggregate([
        { $match: { userId: userId, status: 'completed' } },
        { $group: { _id: null, avg: { $avg: '$score.percentage' } } }
      ]),
      ExamAttempt.findOne({ userId, status: 'completed' })
        .sort({ 'score.percentage': -1 })
        .select('score'),
      ExamAttempt.find({ userId, status: 'completed' })
        .populate('examId', 'title category')
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    const user = await User.findById(userId);

    res.json({
      success: true,
      data: {
        totalAttempts,
        completedAttempts,
        averageScore: averageScore[0]?.avg || 0,
        bestScore: bestScore?.score.percentage || 0,
        recentAttempts,
        subscription: {
          plan: user.subscription.plan,
          status: user.subscription.status,
          limits: user.subscription.limits,
          endDate: user.subscription.endDate
        }
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics',
      error: error.message
    });
  }
});

// Delete user account
router.delete('/account', authenticateToken, [
  body('password').exists(),
  body('confirmDelete').equals('DELETE')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { password } = req.body;

    const user = await User.findById(req.user.userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Password is incorrect'
      });
    }

    // Cancel subscription if active
    if (user.subscription.stripeSubscriptionId) {
      try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        await stripe.subscriptions.del(user.subscription.stripeSubscriptionId);
      } catch (stripeError) {
        console.error('Error cancelling subscription:', stripeError);
      }
    }

    // Soft delete - deactivate account
    user.isActive = false;
    user.email = `deleted_${Date.now()}_${user.email}`;
    await user.save();

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account',
      error: error.message
    });
  }
});

module.exports = router;