import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Signup from './components/Signup';
import ExamInstructions from './components/ExamInstructions';
import ExamInterface from './components/ExamInterface';
import ExamResults from './components/ExamResults';
import Dashboard from './components/Dashboard';
import SubscriptionPlans from './components/SubscriptionPlans';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function App() {
  const [currentScreen, setCurrentScreen] = useState('login');
  const [studentInfo, setStudentInfo] = useState(null);
  const [examData, setExamData] = useState({
    results: null,
    timeSpent: 0,
    violationCount: 0,
    studentInfo: null
  });

  const handleLogin = (userData) => {
    setStudentInfo(userData);
  };

  const handleStartExam = () => {
    setCurrentScreen('exam');
  };

  const handleExamComplete = (results, timeSpent, violationCount) => {
    setExamData({
      results,
      timeSpent,
      violationCount,
      studentInfo
    });
  };

  const handleRestart = () => {
    setExamData({
      results: null,
      timeSpent: 0,
      violationCount: 0,
      studentInfo: null
    });
    setCurrentScreen('login');
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginForm onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/subscription" 
            element={
              <ProtectedRoute>
                <SubscriptionPlans />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/instructions" 
            element={
              <ProtectedRoute>
                <ExamInstructions onStartExam={handleStartExam} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/exam" 
            element={
              <ProtectedRoute>
                <ExamInterface 
                  studentInfo={studentInfo} 
                  onExamComplete={handleExamComplete} 
                />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/results" 
            element={
              <ProtectedRoute>
                <ExamResults 
                  onRestart={handleRestart} 
                />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;