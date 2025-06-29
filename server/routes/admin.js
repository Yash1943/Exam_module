const express = require('express');
const { body, validationResult } = require('express-validator');
const { Exam, ExamAttempt } = require('../models/Exam');
const { SubscriptionPlan, Subscription } = require('../models/Subscription');
const User = require('../models/User');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Apply admin authentication to all routes
router.use(authenticateToken);
router.use(requireRole(['admin', 'super_admin']));

// Dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    const [
      totalUsers,
      activeSubscriptions,
      totalExams,
      totalAttempts,
      recentAttempts
    ] = await Promise.all([
      User.countDocuments(),
      Subscription.countDocuments({ status: 'active' }),
      Exam.countDocuments({ isActive: true }),
      ExamAttempt.countDocuments({ status: 'completed' }),
      ExamAttempt.find({ status: 'completed' })
        .populate('userId', 'fullName email')
        .populate('examId', 'title')
        .sort({ createdAt: -1 })
        .limit(10)
    ]);

    // Revenue calculation (simplified)
    const revenue = await Subscription.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          activeSubscriptions,
          totalExams,
          totalAttempts,
          monthlyRevenue: revenue[0]?.total || 0
        },
        recentAttempts
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
});

// User management
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';

    const query = search ? {
      $or: [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error.message
    });
  }
});

// Update user subscription limits
router.put('/users/:userId/limits', [
  body('maxExamAttempts').isInt({ min: 0 }),
  body('maxAccountAccess').isInt({ min: 1 })
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

    const { userId } = req.params;
    const { maxExamAttempts, maxAccountAccess } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.subscription.limits.maxExamAttempts = maxExamAttempts;
    user.subscription.limits.maxAccountAccess = maxAccountAccess;
    await user.save();

    res.json({
      success: true,
      message: 'User limits updated successfully',
      data: user.subscription.limits
    });
  } catch (error) {
    console.error('Update user limits error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user limits',
      error: error.message
    });
  }
});

// Exam management
router.get('/exams', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const exams = await Exam.find()
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Exam.countDocuments();

    res.json({
      success: true,
      data: {
        exams,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get exams error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch exams',
      error: error.message
    });
  }
});

// Create exam
router.post('/exams', [
  body('title').trim().isLength({ min: 1 }),
  body('category').trim().isLength({ min: 1 }),
  body('questions').isArray({ min: 1 }),
  body('settings.duration').isInt({ min: 1 }),
  body('settings.totalMarks').isInt({ min: 1 })
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

    const examData = {
      ...req.body,
      createdBy: req.user.userId
    };

    const exam = new Exam(examData);
    await exam.save();

    res.status(201).json({
      success: true,
      message: 'Exam created successfully',
      data: exam
    });
  } catch (error) {
    console.error('Create exam error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create exam',
      error: error.message
    });
  }
});

// Update exam
router.put('/exams/:examId', [
  body('title').optional().trim().isLength({ min: 1 }),
  body('category').optional().trim().isLength({ min: 1 }),
  body('questions').optional().isArray({ min: 1 }),
  body('settings.duration').optional().isInt({ min: 1 }),
  body('settings.totalMarks').optional().isInt({ min: 1 })
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

    const { examId } = req.params;
    const updateData = req.body;

    const exam = await Exam.findByIdAndUpdate(
      examId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    res.json({
      success: true,
      message: 'Exam updated successfully',
      data: exam
    });
  } catch (error) {
    console.error('Update exam error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update exam',
      error: error.message
    });
  }
});

// Delete exam
router.delete('/exams/:examId', async (req, res) => {
  try {
    const { examId } = req.params;

    const exam = await Exam.findByIdAndUpdate(
      examId,
      { isActive: false },
      { new: true }
    );

    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    res.json({
      success: true,
      message: 'Exam deactivated successfully'
    });
  } catch (error) {
    console.error('Delete exam error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete exam',
      error: error.message
    });
  }
});

// Subscription plan management
router.get('/subscription-plans', async (req, res) => {
  try {
    const plans = await SubscriptionPlan.find().sort({ sortOrder: 1 });

    res.json({
      success: true,
      data: plans
    });
  } catch (error) {
    console.error('Get subscription plans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subscription plans',
      error: error.message
    });
  }
});

// Create subscription plan
router.post('/subscription-plans', [
  body('name').trim().isLength({ min: 1 }),
  body('displayName').trim().isLength({ min: 1 }),
  body('price.monthly').isFloat({ min: 0 }),
  body('price.yearly').isFloat({ min: 0 }),
  body('features.maxExamAttempts').isInt({ min: 1 }),
  body('features.maxAccountAccess').isInt({ min: 1 })
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

    const plan = new SubscriptionPlan(req.body);
    await plan.save();

    res.status(201).json({
      success: true,
      message: 'Subscription plan created successfully',
      data: plan
    });
  } catch (error) {
    console.error('Create subscription plan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create subscription plan',
      error: error.message
    });
  }
});

// Analytics
router.get('/analytics', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const [
      userGrowth,
      examStats,
      subscriptionStats,
      topExams
    ] = await Promise.all([
      User.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      ExamAttempt.aggregate([
        { $match: { ...dateFilter, status: 'completed' } },
        {
          $group: {
            _id: null,
            totalAttempts: { $sum: 1 },
            averageScore: { $avg: "$score.percentage" },
            passRate: {
              $avg: { $cond: [{ $gte: ["$score.percentage", 60] }, 1, 0] }
            }
          }
        }
      ]),
      Subscription.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            revenue: { $sum: "$amount" }
          }
        }
      ]),
      ExamAttempt.aggregate([
        { $match: { ...dateFilter, status: 'completed' } },
        {
          $group: {
            _id: "$examId",
            attempts: { $sum: 1 },
            averageScore: { $avg: "$score.percentage" }
          }
        },
        { $sort: { attempts: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'exams',
            localField: '_id',
            foreignField: '_id',
            as: 'exam'
          }
        }
      ])
    ]);

    res.json({
      success: true,
      data: {
        userGrowth,
        examStats: examStats[0] || { totalAttempts: 0, averageScore: 0, passRate: 0 },
        subscriptionStats,
        topExams
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data',
      error: error.message
    });
  }
});

module.exports = router;