// Mock API calls for testing with localhost
const API_BASE_URL = 'http://localhost:3001/api';

export const makeApiCall = async (endpoint, params) => {
  try {
    console.log('Mock API call to:', endpoint, 'with params:', params);
    
    // Mock successful responses for testing
    return {
      success: true,
      data: {
        message: 'Mock response for testing'
      }
    };
  } catch (error) {
    console.error('Mock API call error:', error);
    return {
      success: true,
      data: {
        message: 'Mock response for testing'
      }
    };
  }
};

export const makePostApiCall = async (endpoint, data) => {
  try {
    console.log('Mock POST API call to:', endpoint, 'with data:', data);
    
    // Mock successful responses for testing
    return {
      success: true,
      data: {
        message: 'Mock POST response for testing'
      }
    };
  } catch (error) {
    console.error('Mock POST API call error:', error);
    return {
      success: true,
      data: {
        message: 'Mock POST response for testing'
      }
    };
  }
};

export const handleApiError = (error, endpoint) => {
  console.error(`Mock API error for ${endpoint}:`, error);
  
  return {
    success: true,
    message: 'Mock error handling - returning success for testing'
  };
};