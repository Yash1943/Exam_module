const express = require('express');
const { body, validationResult } = require('express-validator');
const { Exam, ExamAttempt } = require('../models/Exam');
const User = require('../models/User');
const { authenticateToken, checkSubscription } = require('../middleware/auth');

const router = express.Router();

// Get available exams for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const userPlan = user.subscription.plan;

    const exams = await Exam.find({
      isActive: true,
      $or: [
        { 'access.isPublic': true },
        { 'access.subscriptionPlans': { $in: [userPlan] } }
      ]
    }).select('-questions.correctAnswer -questions.explanation');

    res.json({
      success: true,
      data: exams
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

// Get exam details
router.get('/:examId', authenticateToken, checkSubscription, async (req, res) => {
  try {
    const { examId } = req.params;
    const user = await User.findById(req.user.userId);

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    // Check if user has access to this exam
    const userPlan = user.subscription.plan;
    if (!exam.access.isPublic && !exam.access.subscriptionPlans.includes(userPlan)) {
      return res.status(403).json({
        success: false,
        message: 'You do not have access to this exam'
      });
    }

    // Check if user can attempt this exam
    if (!user.canAttemptExam()) {
      return res.status(403).json({
        success: false,
        message: 'You have reached your exam attempt limit'
      });
    }

    // Return exam without correct answers
    const examData = exam.toObject();
    examData.questions = examData.questions.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      subject: q.subject,
      difficulty: q.difficulty,
      marks: q.marks,
      tags: q.tags
    }));

    res.json({
      success: true,
      data: examData
    });
  } catch (error) {
    console.error('Get exam details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch exam details',
      error: error.message
    });
  }
});

// Start exam attempt
router.post('/:examId/start', authenticateToken, checkSubscription, async (req, res) => {
  try {
    const { examId } = req.params;
    const user = await User.findById(req.user.userId);

    // Check if user can attempt exam
    if (!user.canAttemptExam()) {
      return res.status(403).json({
        success: false,
        message: 'You have reached your exam attempt limit'
      });
    }

    // Check for existing in-progress attempt
    const existingAttempt = await ExamAttempt.findOne({
      userId: user._id,
      examId,
      status: 'in_progress'
    });

    if (existingAttempt) {
      return res.json({
        success: true,
        data: {
          attemptId: existingAttempt._id,
          startTime: existingAttempt.startTime
        }
      });
    }

    // Create new exam attempt
    const examAttempt = new ExamAttempt({
      userId: user._id,
      examId,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await examAttempt.save();

    // Increment user's exam attempts
    await user.incrementExamAttempts();

    res.json({
      success: true,
      data: {
        attemptId: examAttempt._id,
        startTime: examAttempt.startTime
      }
    });
  } catch (error) {
    console.error('Start exam error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start exam',
      error: error.message
    });
  }
});

// Submit exam attempt
router.post('/:examId/submit', authenticateToken, [
  body('attemptId').isMongoId(),
  body('answers').isArray(),
  body('timeSpent').isNumeric()
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
    const { attemptId, answers, timeSpent, violations } = req.body;

    const examAttempt = await ExamAttempt.findOne({
      _id: attemptId,
      userId: req.user.userId,
      examId,
      status: 'in_progress'
    });

    if (!examAttempt) {
      return res.status(404).json({
        success: false,
        message: 'Exam attempt not found or already completed'
      });
    }

    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({
        success: false,
        message: 'Exam not found'
      });
    }

    // Calculate score
    let correct = 0;
    let totalMarks = 0;
    const processedAnswers = [];

    exam.questions.forEach((question, index) => {
      const userAnswer = answers.find(a => a.questionId === question._id.toString());
      const isCorrect = userAnswer && userAnswer.selectedAnswer === question.correctAnswer;
      
      if (isCorrect) {
        correct++;
        totalMarks += question.marks;
      }

      processedAnswers.push({
        questionId: question._id,
        selectedAnswer: userAnswer ? userAnswer.selectedAnswer : null,
        isCorrect,
        timeSpent: userAnswer ? userAnswer.timeSpent : 0
      });
    });

    const percentage = (correct / exam.questions.length) * 100;

    // Update exam attempt
    examAttempt.answers = processedAnswers;
    examAttempt.score = {
      total: totalMarks,
      percentage: Math.round(percentage * 100) / 100,
      correct,
      incorrect: exam.questions.length - correct,
      unanswered: exam.questions.length - answers.length
    };
    examAttempt.timeSpent = timeSpent;
    examAttempt.endTime = new Date();
    examAttempt.status = 'completed';
    examAttempt.violations = violations || [];

    await examAttempt.save();

    // Update user's exam history
    const user = await User.findById(req.user.userId);
    user.examHistory.push({
      examId: exam._id,
      score: totalMarks,
      totalQuestions: exam.questions.length,
      correctAnswers: correct,
      timeSpent,
      status: 'completed'
    });
    await user.save();

    // Update exam statistics
    exam.attempts += 1;
    exam.averageScore = ((exam.averageScore * (exam.attempts - 1)) + percentage) / exam.attempts;
    await exam.save();

    res.json({
      success: true,
      message: 'Exam submitted successfully',
      data: {
        score: examAttempt.score,
        timeSpent: examAttempt.timeSpent,
        violations: examAttempt.violations,
        passed: percentage >= exam.settings.passingScore
      }
    });
  } catch (error) {
    console.error('Submit exam error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit exam',
      error: error.message
    });
  }
});

// Get exam results
router.get('/:examId/results/:attemptId', authenticateToken, async (req, res) => {
  try {
    const { examId, attemptId } = req.params;

    const examAttempt = await ExamAttempt.findOne({
      _id: attemptId,
      userId: req.user.userId,
      examId,
      status: 'completed'
    }).populate('examId');

    if (!examAttempt) {
      return res.status(404).json({
        success: false,
        message: 'Exam results not found'
      });
    }

    res.json({
      success: true,
      data: {
        exam: {
          title: examAttempt.examId.title,
          category: examAttempt.examId.category,
          passingScore: examAttempt.examId.settings.passingScore
        },
        score: examAttempt.score,
        timeSpent: examAttempt.timeSpent,
        violations: examAttempt.violations,
        submittedAt: examAttempt.endTime,
        passed: examAttempt.score.percentage >= examAttempt.examId.settings.passingScore
      }
    });
  } catch (error) {
    console.error('Get exam results error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch exam results',
      error: error.message
    });
  }
});

// Get user's exam history
router.get('/history/me', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const examAttempts = await ExamAttempt.find({
      userId: req.user.userId,
      status: 'completed'
    })
    .populate('examId', 'title category')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await ExamAttempt.countDocuments({
      userId: req.user.userId,
      status: 'completed'
    });

    res.json({
      success: true,
      data: {
        attempts: examAttempts,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get exam history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch exam history',
      error: error.message
    });
  }
});

module.exports = router;