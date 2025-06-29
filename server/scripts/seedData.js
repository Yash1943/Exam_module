const { SubscriptionPlan } = require('../models/Subscription');
const { Exam } = require('../models/Exam');
const User = require('../models/User');
const { testConnection } = require('../config/database');
const { runMigrations } = require('./migrate');
require('dotenv').config();

// Seed subscription plans
const seedSubscriptionPlans = async () => {
  try {
    console.log('📦 Seeding subscription plans...');

    const plans = [
      {
        name: 'free',
        displayName: 'Free',
        description: 'Basic access to limited exams',
        price: { monthly: 0, yearly: 0 },
        features: {
          maxExamAttempts: 1,
          maxAccountAccess: 1,
          examTypes: ['basic'],
          supportLevel: 'basic',
          analyticsAccess: false,
          customBranding: false,
          apiAccess: false
        },
        sortOrder: 1
      },
      {
        name: 'basic',
        displayName: 'Basic',
        description: 'Perfect for individual learners',
        price: { monthly: 9.99, yearly: 99.99 },
        features: {
          maxExamAttempts: 10,
          maxAccountAccess: 1,
          examTypes: ['basic', 'intermediate'],
          supportLevel: 'basic',
          analyticsAccess: true,
          customBranding: false,
          apiAccess: false
        },
        sortOrder: 2
      },
      {
        name: 'premium',
        displayName: 'Premium',
        description: 'Best for serious learners and professionals',
        price: { monthly: 19.99, yearly: 199.99 },
        features: {
          maxExamAttempts: 50,
          maxAccountAccess: 3,
          examTypes: ['basic', 'intermediate', 'advanced'],
          supportLevel: 'priority',
          analyticsAccess: true,
          customBranding: true,
          apiAccess: false
        },
        sortOrder: 3
      },
      {
        name: 'enterprise',
        displayName: 'Enterprise',
        description: 'For organizations and institutions',
        price: { monthly: 49.99, yearly: 499.99 },
        features: {
          maxExamAttempts: -1, // unlimited
          maxAccountAccess: 10,
          examTypes: ['basic', 'intermediate', 'advanced', 'expert'],
          supportLevel: 'premium',
          analyticsAccess: true,
          customBranding: true,
          apiAccess: true
        },
        sortOrder: 4
      }
    ];

    for (const planData of plans) {
      const existingPlan = await SubscriptionPlan.findByName(planData.name);
      if (!existingPlan) {
        await SubscriptionPlan.create(planData);
        console.log(`✅ Created plan: ${planData.displayName}`);
      } else {
        console.log(`⏭️  Plan already exists: ${planData.displayName}`);
      }
    }

    console.log('✅ Subscription plans seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding subscription plans:', error);
    throw error;
  }
};

// Seed sample exams
const seedExams = async () => {
  try {
    console.log('📚 Seeding sample exams...');

    // Create admin user first
    let adminUser = await User.findByEmail('admin@mcqexam.com');
    if (!adminUser) {
      adminUser = await User.create({
        email: 'admin@mcqexam.com',
        password: 'admin123',
        fullName: 'System Administrator',
        role: 'admin',
        emailVerified: true
      });
      console.log('✅ Created admin user');
    }

    const sampleExams = [
      {
        title: 'JavaScript Fundamentals',
        description: 'Test your knowledge of JavaScript basics',
        category: 'Programming',
        questions: [
          {
            id: 1,
            question: 'What is the output of typeof []?',
            options: ['array', 'object', 'list', 'undefined'],
            correctAnswer: 1,
            subject: 'JavaScript',
            difficulty: 'Easy',
            marks: 1,
            explanation: 'In JavaScript, arrays are actually objects, so typeof [] returns "object".'
          },
          {
            id: 2,
            question: 'Which method is used to add an element to the end of an array?',
            options: ['push()', 'pop()', 'shift()', 'unshift()'],
            correctAnswer: 0,
            subject: 'JavaScript',
            difficulty: 'Easy',
            marks: 1,
            explanation: 'The push() method adds one or more elements to the end of an array.'
          },
          {
            id: 3,
            question: 'What does the "this" keyword refer to in JavaScript?',
            options: ['The current function', 'The global object', 'The calling object', 'The parent object'],
            correctAnswer: 2,
            subject: 'JavaScript',
            difficulty: 'Medium',
            marks: 2,
            explanation: 'The "this" keyword refers to the object that is calling the function.'
          }
        ],
        settings: {
          duration: 30,
          totalMarks: 4,
          passingScore: 60,
          shuffleQuestions: true,
          showResults: true,
          allowReview: true,
          strictMode: true
        },
        access: {
          subscriptionPlans: ['free', 'basic', 'premium', 'enterprise'],
          isPublic: true
        },
        createdBy: adminUser.id
      },
      {
        title: 'Python Programming Basics',
        description: 'Fundamental concepts of Python programming',
        category: 'Programming',
        questions: [
          {
            id: 1,
            question: 'Which of the following is used to define a function in Python?',
            options: ['function', 'def', 'define', 'func'],
            correctAnswer: 1,
            subject: 'Python',
            difficulty: 'Easy',
            marks: 1,
            explanation: 'The "def" keyword is used to define a function in Python.'
          },
          {
            id: 2,
            question: 'What is the output of print(2 ** 3)?',
            options: ['6', '8', '9', '23'],
            correctAnswer: 1,
            subject: 'Python',
            difficulty: 'Easy',
            marks: 1,
            explanation: '** is the exponentiation operator in Python, so 2 ** 3 = 8.'
          },
          {
            id: 3,
            question: 'Which data type is mutable in Python?',
            options: ['tuple', 'string', 'list', 'int'],
            correctAnswer: 2,
            subject: 'Python',
            difficulty: 'Medium',
            marks: 2,
            explanation: 'Lists are mutable in Python, meaning they can be modified after creation.'
          }
        ],
        settings: {
          duration: 25,
          totalMarks: 4,
          passingScore: 60,
          shuffleQuestions: true,
          showResults: true,
          allowReview: true,
          strictMode: true
        },
        access: {
          subscriptionPlans: ['basic', 'premium', 'enterprise'],
          isPublic: false
        },
        createdBy: adminUser.id
      },
      {
        title: 'Advanced Data Structures',
        description: 'Complex data structures and algorithms',
        category: 'Computer Science',
        questions: [
          {
            id: 1,
            question: 'What is the time complexity of binary search?',
            options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
            correctAnswer: 1,
            subject: 'Algorithms',
            difficulty: 'Medium',
            marks: 2,
            explanation: 'Binary search has O(log n) time complexity as it divides the search space in half each time.'
          },
          {
            id: 2,
            question: 'Which data structure uses LIFO principle?',
            options: ['Queue', 'Stack', 'Array', 'Linked List'],
            correctAnswer: 1,
            subject: 'Data Structures',
            difficulty: 'Easy',
            marks: 1,
            explanation: 'Stack follows Last In First Out (LIFO) principle.'
          },
          {
            id: 3,
            question: 'What is the worst-case time complexity of QuickSort?',
            options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
            correctAnswer: 2,
            subject: 'Algorithms',
            difficulty: 'Hard',
            marks: 3,
            explanation: 'QuickSort has O(n²) worst-case time complexity when the pivot is always the smallest or largest element.'
          }
        ],
        settings: {
          duration: 45,
          totalMarks: 6,
          passingScore: 70,
          shuffleQuestions: true,
          showResults: true,
          allowReview: true,
          strictMode: true
        },
        access: {
          subscriptionPlans: ['premium', 'enterprise'],
          isPublic: false
        },
        createdBy: adminUser.id
      }
    ];

    for (const examData of sampleExams) {
      const existingExam = await Exam.findById(1); // Check if any exam exists
      if (!existingExam) {
        await Exam.create(examData);
        console.log(`✅ Created exam: ${examData.title}`);
      }
    }

    console.log('✅ Sample exams seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding exams:', error);
    throw error;
  }
};

// Run seeding
const runSeed = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Test connection
    const connected = await testConnection();
    if (!connected) {
      throw new Error('Database connection failed');
    }

    // Run migrations first
    await runMigrations();
    
    // Seed data
    await seedSubscriptionPlans();
    await seedExams();
    
    console.log('🎉 Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  runSeed();
}

module.exports = { runSeed };