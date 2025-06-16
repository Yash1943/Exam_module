import React, { useEffect } from 'react';
import { CheckCircle, XCircle, Clock, AlertTriangle, RotateCcw } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const ExamResults = ({ onRestart }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { examData } = location.state || {};

  useEffect(() => {
    // If examData or results is null, redirect to instructions
    if (!examData || !examData.results) {
      navigate('/instructions');
    }
  }, [examData, navigate]);

  // Render nothing if examData or results is null to prevent further errors while redirecting
  if (!examData || !examData.results) {
    return null;
  }

  const { results, timeSpent = 0, violationCount = 0, studentInfo = {} } = examData;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-600' };
    if (percentage >= 70) return { grade: 'B', color: 'text-blue-600' };
    if (percentage >= 60) return { grade: 'C', color: 'text-yellow-600' };
    return { grade: 'F', color: 'text-red-600' };
  };

  const { grade, color } = getGrade(results.percentage);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
              results.passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {results.passed ? (
                <CheckCircle className="w-10 h-10 text-green-600" />
              ) : (
                <XCircle className="w-10 h-10 text-red-600" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {results.passed ? 'Exam Completed!' : 'Exam Completed!'}
            </h1>
            {/* <p className="text-gray-600">
              {results.passed ? 'You have successfully passed the exam!' : 'You need to score at least 60% to pass.'}
            </p> */}
          </div>

          {/* Score Card */}
          {/* <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold mb-1">{results.percentage}%</div>
                <div className="text-blue-100">Overall Score</div>
              </div>
              <div>
                <div className={`text-3xl font-bold mb-1 ${color}`}>{grade}</div>
                <div className="text-blue-100">Grade</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">{results.correct}</div>
                <div className="text-blue-100">Correct</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1">{formatTime(timeSpent)}</div>
                <div className="text-blue-100">Time Spent</div>
              </div>
            </div>
          </div> */}

          {/* Detailed Results */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Performance Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Questions</span>
                  <span className="font-medium">{results.totalQuestions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Attempted</span>
                  <span className="font-medium text-blue-600">{results.attempted}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Answered Questions</span>
                  <span className="font-medium text-blue-600">{results.attempted || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Correct Answers</span>
                  <span className="font-medium text-green-600">{results.correct}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Incorrect Answers</span>
                  <span className="font-medium text-red-600">{results.incorrect}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Unanswered</span>
                  <span className="font-medium text-gray-500">{results.unanswered}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Exam Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Student ID</span>
                  <span className="font-medium">{studentInfo.studentId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Exam Date</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Time Spent</span>
                  <span className="font-medium">{formatTime(timeSpent)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Passing Score</span>
                  <span className="font-medium">60%</span>
                </div>
                {violationCount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Security Violations</span>
                    <span className="font-medium text-red-600 flex items-center">
                      <AlertTriangle className="w-4 h-4 mr-1" />
                      {violationCount}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div> */}

          {/* Progress Bar */}
          {/* <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Accuracy Rate</span>
              <span className="text-sm font-medium text-gray-700">{results.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-1000 ${
                  results.percentage >= 60 ? 'bg-green-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(results.percentage, 100)}%` }}
              ></div>
            </div>
          </div> */}

          {/* Actions */}
          {/* <div className="text-center space-y-4">
            {!results.passed && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800">
                  <strong>Don't worry!</strong> You can retake the exam to improve your score.
                </p>
              </div>
            )}
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={onRestart}
                className="flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Take Another Exam
              </button>
              
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
              >
                Print Results
              </button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ExamResults;