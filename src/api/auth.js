const API_BASE_URL = 'http://localhost:3001/api';

// Mock data for testing - all users get full access
const MOCK_POSITION_PREFERENCES = [
  { id: 1, name: 'software_developer', category: 'Software Developer', description: 'Develop and maintain software applications' },
  { id: 2, name: 'data_analyst', category: 'Data Analyst', description: 'Analyze and interpret complex data sets' },
  { id: 3, name: 'ui_ux_designer', category: 'UI/UX Designer', description: 'Design user interfaces and user experiences' },
  { id: 4, name: 'project_manager', category: 'Project Manager', description: 'Manage and coordinate project activities' },
  { id: 5, name: 'quality_assurance', category: 'Quality Assurance', description: 'Test and ensure software quality' },
  { id: 6, name: 'devops_engineer', category: 'DevOps Engineer', description: 'Manage development and operations processes' },
  { id: 7, name: 'business_analyst', category: 'Business Analyst', description: 'Analyze business requirements and processes' },
  { id: 8, name: 'technical_writer', category: 'Technical Writer', description: 'Create technical documentation and content' }
];

// Get position preferences
export const getPositionPreferences = async () => {
  try {
    // Return mock data for testing
    return {
      success: true,
      message: MOCK_POSITION_PREFERENCES
    };
  } catch (error) {
    console.error('Error fetching position preferences:', error);
    return {
      success: true,
      message: MOCK_POSITION_PREFERENCES
    };
  }
};

// Register user
export const registerUser = async (userData) => {
  try {
    // Mock successful registration for testing
    console.log('Mock registration data:', userData);
    
    return {
      success: true,
      message: {
        status: 'success',
        message: 'User registered successfully',
        userId: Math.floor(Math.random() * 1000)
      }
    };
  } catch (error) {
    console.error('Error registering user:', error);
    return {
      success: true,
      message: {
        status: 'success',
        message: 'User registered successfully',
        userId: Math.floor(Math.random() * 1000)
      }
    };
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    // Mock successful login for testing - all users get full access
    console.log('Mock login credentials:', credentials);
    
    return {
      success: true,
      message: {
        status: 'success',
        response: [{
          name: Math.floor(Math.random() * 1000),
          full_name: 'Test User',
          collage_name: 'Test College',
          branch: 'Computer Science',
          addhar_card_no: credentials.aadhar_no,
          applied_position_preference: '1',
          prn_no: 'TEST123',
          phone_no: '9876543210',
          email_id: 'test@example.com',
          semester: 'VII',
          // Full access subscription for testing
          subscription: {
            plan: 'enterprise',
            status: 'active',
            features: {
              maxExamAttempts: -1, // unlimited
              maxAccountAccess: 10,
              examTypes: ['basic', 'intermediate', 'advanced', 'expert'],
              supportLevel: 'premium',
              analyticsAccess: true,
              customBranding: true,
              apiAccess: true
            }
          }
        }]
      }
    };
  } catch (error) {
    console.error('Error logging in user:', error);
    return {
      success: true,
      message: {
        status: 'success',
        response: [{
          name: Math.floor(Math.random() * 1000),
          full_name: 'Test User',
          collage_name: 'Test College',
          branch: 'Computer Science',
          addhar_card_no: credentials.aadhar_no,
          applied_position_preference: '1',
          prn_no: 'TEST123',
          phone_no: '9876543210',
          email_id: 'test@example.com',
          semester: 'VII'
        }]
      }
    };
  }
};

// Check exam status
export const checkExamStatus = async (username) => {
  try {
    // Mock - allow all users to take exam for testing
    return {
      success: true,
      message: 0 // 0 = not completed, 1 = completed
    };
  } catch (error) {
    console.error('Error checking exam status:', error);
    return {
      success: true,
      message: 0
    };
  }
};

// Save exam evaluation
export const saveExamEvaluation = async (evaluationData) => {
  try {
    // Mock successful save for testing
    console.log('Mock exam evaluation saved:', evaluationData);
    
    return {
      success: true,
      message: 'Exam evaluation saved successfully'
    };
  } catch (error) {
    console.error('Error saving exam evaluation:', error);
    return {
      success: true,
      message: 'Exam evaluation saved successfully'
    };
  }
};