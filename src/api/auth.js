const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Get position preferences
export const getPositionPreferences = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/position-preferences`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch position preferences');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching position preferences:', error);
    throw error;
  }
};

// Register user
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw error;
  }
};

// Check exam status
export const checkExamStatus = async (username) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/exam-status/${username}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to check exam status');
    }
    
    return data;
  } catch (error) {
    console.error('Error checking exam status:', error);
    throw error;
  }
};

// Save exam evaluation
export const saveExamEvaluation = async (evaluationData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/save-evaluation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(evaluationData),
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error saving exam evaluation:', error);
    throw error;
  }
};