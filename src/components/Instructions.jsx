import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { get_exam_title } from '../api/get_question';
import ExamCards from './ExamCards';

const Instructions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [examTitles, setExamTitles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExamTitles = async () => {
      try {
        const response = await get_exam_title();
        if (response.success) {
          setExamTitles(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching exam titles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExamTitles();
  }, []);

  const handleStartExam = () => {
    if (location.state?.studentInfo) {
      navigate('/exam', {
        state: {
          studentInfo: location.state.studentInfo,
          examInfo: location.state.examInfo,
          timeOfExam: location.state.timeOfExam,
          totalMarks: location.state.totalMarks
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Exam Instructions
          </h1>

          {/* Exam Cards Section */}
          {loading ? (
            <div className="text-center py-4">Loading exam categories...</div>
          ) : (
            <ExamCards examTitles={examTitles} />
          )}

          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">
                Important Instructions
              </h2>
              <ul className="space-y-3 text-blue-800">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Please ensure you have a stable internet connection before starting the exam.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>The exam will be conducted in full-screen mode. Do not exit full-screen during the exam.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>You cannot switch between tabs or windows during the exam.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Each question carries equal marks. There is no negative marking.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>The timer will start as soon as you begin the exam and cannot be paused.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>You can mark questions for review and return to them later.</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>The exam will automatically submit when the time is up.</span>
                </li>
              </ul>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleStartExam}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Start Exam
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instructions; 