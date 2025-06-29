const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const { User, PositionPreference, ExamAttempt } = require('../models');

const router = express.Router();

// Get position preferences
router.get('/position-preferences', async (req, res) => {
  try {
    const preferences = await PositionPreference.findAll({
      where: { isActive: true },
      attributes: ['id', 'name', 'category', 'description'],
      order: [['category', 'ASC']]
    });

    res.json({
      success: true,
      message: preferences
    });
  } catch (error) {
    console.error('Get position preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch position preferences',
      error: error.message
    });
  }
});

// Register user
router.post('/register', [
  body('full_name').trim().isLength({ min: 2 }).withMessage('Full name must be at least 2 characters'),
  body('college_name').trim().isLength({ min: 2 }).withMessage('College name must be at least 2 characters'),
  body('branch').trim().isLength({ min: 2 }).withMessage('Branch must be at least 2 characters'),
  body('aadhar_card_no').isLength({ min: 12, max: 12 }).withMessage('Aadhar card number must be 12 digits'),
  body('applied_position_preference').isInt().withMessage('Position preference is required'),
  body('prn_no').trim().isLength({ min: 1 }).withMessage('PRN number is required'),
  body('phone_no').isMobilePhone('en-IN').withMessage('Please enter a valid Indian mobile number'),
  body('email_id').isEmail().withMessage('Please enter a valid email address'),
  body('semester').isIn(['1', '2', '3', '4', '5', '6', '7', '8']).withMessage('Please select a valid semester'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: {
          status: 'error',
          message: 'Validation errors',
          errors: errors.array()
        }
      });
    }

    const {
      full_name,
      college_name,
      branch,
      aadhar_card_no,
      applied_position_preference,
      prn_no,
      phone_no,
      email_id,
      semester,
      password
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { aadharCardNo: aadhar_card_no },
          { emailId: email_id }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: true,
        message: {
          status: 'error',
          message: 'User already exists with this Aadhar number or email'
        }
      });
    }

    // Check if position preference exists
    const positionPreference = await PositionPreference.findByPk(applied_position_preference);
    if (!positionPreference) {
      return res.status(400).json({
        success: true,
        message: {
          status: 'error',
          message: 'Invalid position preference selected'
        }
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      fullName: full_name,
      collegeName: college_name,
      branch,
      aadharCardNo: aadhar_card_no,
      appliedPositionPreference: applied_position_preference,
      prnNo: prn_no,
      phoneNo: phone_no,
      emailId: email_id,
      semester,
      password: hashedPassword
    });

    res.status(201).json({
      success: true,
      message: {
        status: 'success',
        message: 'User registered successfully',
        userId: user.id
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: true,
      message: {
        status: 'error',
        message: 'Registration failed. Please try again.'
      }
    });
  }
});

// Login user
router.post('/login', [
  body('aadhar_no').isLength({ min: 12, max: 12 }).withMessage('Please enter a valid Aadhar number'),
  body('password').exists().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: {
          status: 'error',
          response: []
        }
      });
    }

    const { aadhar_no, password } = req.body;

    // Find user by Aadhar number
    const user = await User.findOne({
      where: { aadharCardNo: aadhar_no },
      include: [{
        model: PositionPreference,
        as: 'positionPreference',
        attributes: ['name', 'category']
      }]
    });

    if (!user) {
      return res.status(401).json({
        success: true,
        message: {
          status: 'error',
          response: []
        }
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: true,
        message: {
          status: 'error',
          response: []
        }
      });
    }

    // Return user data
    res.json({
      success: true,
      message: {
        status: 'success',
        response: [{
          name: user.id,
          full_name: user.fullName,
          collage_name: user.collegeName,
          branch: user.branch,
          addhar_card_no: user.aadharCardNo,
          applied_position_preference: user.appliedPositionPreference,
          prn_no: user.prnNo,
          phone_no: user.phoneNo,
          email_id: user.emailId,
          semester: user.semester
        }]
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: true,
      message: {
        status: 'error',
        response: []
      }
    });
  }
});

// Check if exam is completed
router.get('/exam-status/:username', async (req, res) => {
  try {
    const { username } = req.params;

    const examAttempt = await ExamAttempt.findOne({
      where: {
        userId: username,
        isCompleted: true
      }
    });

    res.json({
      success: true,
      message: examAttempt ? 1 : 0
    });
  } catch (error) {
    console.error('Check exam status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check exam status',
      error: error.message
    });
  }
});

// Save exam evaluation
router.post('/save-evaluation', [
  body('username').isInt().withMessage('Username must be a valid user ID'),
  body('exam_type').isInt().withMessage('Exam type is required'),
  body('total_marks').isInt().withMessage('Total marks must be a number'),
  body('participant_evaluation').isArray().withMessage('Participant evaluation must be an array')
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

    const { username, exam_type, total_marks, participant_evaluation } = req.body;

    // Check if user exists
    const user = await User.findByPk(username);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if exam already completed
    const existingAttempt = await ExamAttempt.findOne({
      where: {
        userId: username,
        isCompleted: true
      }
    });

    if (existingAttempt) {
      return res.status(400).json({
        success: false,
        message: 'Exam already completed'
      });
    }

    // Save exam attempt
    const examAttempt = await ExamAttempt.create({
      userId: username,
      examType: exam_type,
      totalMarks: total_marks,
      participantEvaluation: participant_evaluation,
      isCompleted: true
    });

    res.status(201).json({
      success: true,
      message: 'Exam evaluation saved successfully',
      data: examAttempt
    });
  } catch (error) {
    console.error('Save evaluation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save exam evaluation',
      error: error.message
    });
  }
});

module.exports = router;