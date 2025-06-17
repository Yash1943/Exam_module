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
      navigate('/');
    }

    // Prevent browser back navigation
    const handlePopState = (event) => {
      event.preventDefault();
      // Replace the current history entry with the exam results
      window.history.pushState(null, '', window.location.href);
      // Show a message to the user
      // alert('Please use the "Take Another Exam" button to restart the exam.');
    };

    // Add event listener for popstate
    window.addEventListener('popstate', handlePopState);

    // Push a new history entry to prevent immediate back navigation
    window.history.pushState(null, '', window.location.href);

    // Cleanup function
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
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