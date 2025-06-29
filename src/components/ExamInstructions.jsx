import React, { useEffect, useState } from 'react';
import { AlertTriangle, Clock, CheckCircle, User, LogOut } from 'lucide-react';
import { examConfig } from '../data/questions';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { get_exam_apptitude_info , get_is_exam_completed } from '../api/get_question';

const ExamInstructions = () => {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const [cetegorystate, setcetegorystate] = useState('');
  const [examInfo, setExamInfo] = useState(null);
  const [minimummarks, setminimummarks] = useState('');
  const [time_of_exam, settime_of_exam] = useState('');
  const [total_marks, set_total_marks] = useState('');
  const[username,setusername] = useState('')
  const[iscompletedexam , setiscompletedexam] = useState('')

  const formatTime = (time_of_exam) => {
    // console.log("Raw time_of_exam value:", time_of_exam);
    
    if (!time_of_exam) return '0 minutes';
    
    // Handle format [HH:MM:SS]
    const match = time_of_exam.match(/\[(\d+):(\d+):(\d+)\]/);
    if (match) {
      const [_, hours, minutes, seconds] = match;
      const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
      if (totalMinutes === 0) {
        return `${seconds} seconds`;
      }
      return `${totalMinutes} minutes`;
    }
    
    // Handle format HH:MM:SS
    const timeMatch = time_of_exam.match(/(\d+):(\d+):(\d+)/);
    if (timeMatch) {
      const [_, hours, minutes, seconds] = timeMatch;
      const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
      if (totalMinutes === 0) {
        return `${seconds} seconds`;
      }
      return `${totalMinutes} minutes`;
    }
    
    // Handle format HH:MM
    const shortTimeMatch = time_of_exam.match(/(\d+):(\d+)/);
    if (shortTimeMatch) {
      const [_, hours, minutes] = shortTimeMatch;
      const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
      return `${totalMinutes} minutes`;
    }
    
    // If no format matches, return the original value
    console.log("No matching time format found, returning original value");
    return time_of_exam;
  };

  useEffect(() => {
    if (userData) {
      // console.log("userData", userData);
      setcetegorystate(userData.applied_position_preference);
      setusername(userData.name);
    }
  }, [userData]);

  useEffect(() => {
    const fetchExamInfo = async () => {
      if (cetegorystate) {
        try {
          // console.log("username",username)
          const get_is_completed_exam = await get_is_exam_completed(username)
          // console.log("get_is_completed_exam",get_is_completed_exam.data.message)
          setiscompletedexam(get_is_completed_exam.data.message)
          const get_exam_info = await get_exam_apptitude_info(cetegorystate);
          // console.log("get_exam_info", get_exam_info);
          setminimummarks(get_exam_info.data.message[0].minimum_passing_score);
          settime_of_exam(get_exam_info.data.message[0].time_of_exam);
          set_total_marks(get_exam_info.data.message[0].total_marks);
          setExamInfo(get_exam_info);
        } catch (error) {
          console.log("error in the get_exam_apptitude_info", error);
        }
      }
    };

    fetchExamInfo();
  }, [cetegorystate,username]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleStartExam = async () => {
    try {
      // Request fullscreen before navigating
      const element = document.documentElement;
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      }
    } catch (error) {
      console.error("Error enabling fullscreen:", error);
    }
    
    // Navigate to exam interface with user data and exam info
    navigate('/exam', { state: { studentInfo: userData, examInfo: examInfo, timeOfExam: time_of_exam, totalMarks: total_marks } });
  };

  return (
    <div className="fixed inset-0 bg-gray-50 overflow-auto">
      <div className="max-w-7xl mx-auto h-full py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

        <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <User className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">{userData?.full_name || 'Student'}</h2>
                <p className="text-gray-600">Aadhar Card No: {userData?.studentId}</p>
              </div>

              <div className="space-y-4">
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Profile Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">College:</span>
                      <span className="font-medium">{userData?.collage_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Branch:</span>
                      <span className="font-medium">{userData?.branch}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Semester:</span>
                      <span className="font-medium">{userData?.semester}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{userData?.email_id}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-8">
              {iscompletedexam === 1 ? (
                <div className="text-center">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                    <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-yellow-800 mb-2">Exam Already Completed</h2>
                    <p className="text-yellow-700 mb-4">
                      You have already submitted this exam. You cannot take the exam again.
                    </p>
                    {/* <button
                      onClick={handleLogout}
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                    >
                      Logout
                    </button> */}
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{examConfig.title}</h1>
                    <div className="flex justify-center items-center space-x-6 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Duration: {formatTime(time_of_exam)}
                      </div>
                      <div className="flex items-center">
                        {/* <CheckCircle className="w-4 h-4 mr-1" />
                        Questions: {examConfig.totalQuestions} */}
                      </div>
                      <div className="flex items-center">
                        {/* <AlertTriangle className="w-4 h-4 mr-1" />
                        Passing: {minimummarks}% */}
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <div className="flex items-center">
                        <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                        <h3 className="font-semibold text-red-800">Strict Mode Enabled</h3>
                      </div>
                      <p className="text-red-700 mt-2">
                        This exam operates in strict mode. Any attempt to switch tabs, leave the exam window, 
                        or use prohibited actions will result in automatic submission of your exam.
                      </p>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Exam Instructions</h2>
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                          1
                        </span>
                        <p className="text-gray-700">This is a timed exam. You have {formatTime(time_of_exam)} to complete all questions.</p>
                      </div>
                      <div className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                          2
                        </span>
                        <p className="text-gray-700">Each question has only one correct answer.</p>
                      </div>
                      <div className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                          3
                        </span>
                        <p className="text-gray-700">You can navigate between questions using the question palette.</p>
                      </div>
                      <div className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                          4
                        </span>
                        <p className="text-gray-700">Questions can be marked for review and answered later.</p>
                      </div>
                      <div className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                          5
                        </span>
                        <p className="text-gray-700">Strict mode is enabled - switching tabs or leaving the exam window will result in automatic submission.</p>
                      </div>
                      <div className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                          6
                        </span>
                        <p className="text-gray-700">Right-click, copy, and paste are disabled during the exam.</p>
                      </div>
                      <div className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                          7
                        </span>
                        <p className="text-gray-700">Your progress is automatically saved.</p>
                      </div>
                      <div className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                          8
                        </span>
                        <p className="text-gray-700">Click 'Submit Exam' when you're ready to finish.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
                    <h3 className="font-semibold text-yellow-800 mb-2">Important Notes:</h3>
                    <ul className="text-yellow-700 space-y-1 text-sm">
                      <li>• Ensure you have a stable internet connection</li>
                      <li>• Close all other applications and browser tabs</li>
                      <li>• Use a desktop or laptop for the best experience</li>
                      <li>• Do not refresh the page during the exam</li>
                    </ul>
                  </div>

                  <div className="text-center">
                    <button
                      onClick={handleStartExam}
                      className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors text-lg focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      I Understand - Start Exam
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamInstructions;