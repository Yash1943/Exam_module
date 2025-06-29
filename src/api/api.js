const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem('token');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async forgotPassword(email) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token, password) {
    return this.request(`/auth/reset-password/${token}`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  }

  async verifyEmail(token) {
    return this.request(`/auth/verify-email/${token}`);
  }

  // User endpoints
  async getUserProfile() {
    return this.request('/users/profile');
  }

  async updateUserProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData) {
    return this.request('/users/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  async getUserStats() {
    return this.request('/users/stats');
  }

  async deleteAccount(password) {
    return this.request('/users/account', {
      method: 'DELETE',
      body: JSON.stringify({ password, confirmDelete: 'DELETE' }),
    });
  }

  // Exam endpoints
  async getExams() {
    return this.request('/exams');
  }

  async getExam(examId) {
    return this.request(`/exams/${examId}`);
  }

  async startExam(examId) {
    return this.request(`/exams/${examId}/start`, {
      method: 'POST',
    });
  }

  async submitExam(examId, submissionData) {
    return this.request(`/exams/${examId}/submit`, {
      method: 'POST',
      body: JSON.stringify(submissionData),
    });
  }

  async getExamResults(examId, attemptId) {
    return this.request(`/exams/${examId}/results/${attemptId}`);
  }

  async getExamHistory(page = 1, limit = 10) {
    return this.request(`/exams/history/me?page=${page}&limit=${limit}`);
  }

  // Subscription endpoints
  async getSubscriptionPlans() {
    return this.request('/subscriptions/plans');
  }

  async getCurrentSubscription() {
    return this.request('/subscriptions/current');
  }

  async createCheckoutSession(planId, billingCycle) {
    return this.request('/subscriptions/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify({ planId, billingCycle }),
    });
  }

  async handleSubscriptionSuccess(sessionId) {
    return this.request('/subscriptions/success', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    });
  }

  async cancelSubscription() {
    return this.request('/subscriptions/cancel', {
      method: 'POST',
    });
  }

  // Admin endpoints
  async getAdminDashboard() {
    return this.request('/admin/dashboard');
  }

  async getUsers(page = 1, limit = 20, search = '') {
    return this.request(`/admin/users?page=${page}&limit=${limit}&search=${search}`);
  }

  async updateUserLimits(userId, limits) {
    return this.request(`/admin/users/${userId}/limits`, {
      method: 'PUT',
      body: JSON.stringify(limits),
    });
  }

  async getAdminExams(page = 1, limit = 20) {
    return this.request(`/admin/exams?page=${page}&limit=${limit}`);
  }

  async createExam(examData) {
    return this.request('/admin/exams', {
      method: 'POST',
      body: JSON.stringify(examData),
    });
  }

  async updateExam(examId, examData) {
    return this.request(`/admin/exams/${examId}`, {
      method: 'PUT',
      body: JSON.stringify(examData),
    });
  }

  async deleteExam(examId) {
    return this.request(`/admin/exams/${examId}`, {
      method: 'DELETE',
    });
  }

  async getSubscriptionPlansAdmin() {
    return this.request('/admin/subscription-plans');
  }

  async createSubscriptionPlan(planData) {
    return this.request('/admin/subscription-plans', {
      method: 'POST',
      body: JSON.stringify(planData),
    });
  }

  async getAnalytics(startDate, endDate) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    return this.request(`/admin/analytics?${params.toString()}`);
  }
}

export const apiClient = new ApiClient();
export default apiClient;