// import React, { useEffect, useState } from 'react';
// import { AlertTriangle, Clock, CheckCircle, User, LogOut } from 'lucide-react';
// import { examConfig } from '../data/questions';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { get_exam_apptitude_info, get_is_exam_completed } from '../api/get_question';
// import { get_apptitude_exams } from '../api/get_apptitude_exam';
// import ExamCards from './ExamCards';

// const ExamInstructions = () => {
//   const { userData, logout } = useAuth();
//   const navigate = useNavigate();
//   const [cetegorystate, setcetegorystate] = useState('');
//   const [examInfo, setExamInfo] = useState(null);
//   const [minimummarks, setminimummarks] = useState('');
//   const [time_of_exam, settime_of_exam] = useState('');
//   const [total_marks, set_total_marks] = useState('');
//   const [username, setusername] = useState('');
//   const [iscompletedexam, setiscompletedexam] = useState('');
//   const [examTitles, setExamTitles] = useState([]);
//   const [selectedExam, setSelectedExam] = useState(null);
//   // const[username,setusername] = useState('')

//   const formatTime = (time_of_exam) => {
//     console.log("Raw time_of_exam value:", userData);

//     if (!time_of_exam) return '0 minutes';

//     // Handle format [HH:MM:SS]
//     const match = time_of_exam.match(/\[(\d+):(\d+):(\d+)\]/);
//     if (match) {
//       const [_, hours, minutes, seconds] = match;
//       const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
//       if (totalMinutes === 0) {
//         return `${seconds} seconds`;
//       }
//       return `${totalMinutes} minutes`;
//     }

//     // Handle format HH:MM:SS
//     const timeMatch = time_of_exam.match(/(\d+):(\d+):(\d+)/);
//     if (timeMatch) {
//       const [_, hours, minutes, seconds] = timeMatch;
//       const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
//       if (totalMinutes === 0) {
//         return `${seconds} seconds`;
//       }
//       return `${totalMinutes} minutes`;
//     }

//     // Handle format HH:MM
//     const shortTimeMatch = time_of_exam.match(/(\d+):(\d+)/);
//     if (shortTimeMatch) {
//       const [_, hours, minutes] = shortTimeMatch;
//       const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);
//       return `${totalMinutes} minutes`;
//     }

//     // If no format matches, return the original value
//     console.log("No matching time format found, returning original value");
//     return time_of_exam;
//   };

//   useEffect(() => {
//     if (userData) {
//       // console.log("userData", userData);
//       // setcetegorystate(userData.applied_position_preference);
//       setusername(userData.name);
//       // setusername(userData.name)
//     }
//   }, [userData]);

//   useEffect(() => {
//     const fetchExamInfo = async () => {
//       if (username) {
//         try {
//           const get_exam_title = await get_apptitude_exams(username)
//           console.log("get_exam_title", get_exam_title.data.message)
//           setExamTitles(get_exam_title.data.message)
//           // const get_is_completed_exam = await get_is_exam_completed(username)
//           // setiscompletedexam(get_is_completed_exam.data.message[0])
//           console.log("cetegorystate",cetegorystate)
//           const get_exam_info = await get_exam_apptitude_info(cetegorystate);
//           console.log("get_exam_info", get_exam_info.data.message[0]);
//           setminimummarks(get_exam_info.data.message[0].minimum_passing_score);
//           settime_of_exam(get_exam_info.data.message[0].time_of_exam);
//           set_total_marks(get_exam_info.data.message[0].total_marks);
//           setExamInfo(get_exam_info);
//         } catch (error) {
//           console.log("error in the get_exam_apptitude_info", error);
//         }
//       }
//     };

//     fetchExamInfo();
//   }, [cetegorystate, username]);

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//   };

//   const handleExamSelect = (exam) => {
//     setSelectedExam(exam);
//     setcetegorystate(exam.name);
//   };

//   const handleStartExam = async () => {
//     if (!selectedExam) {
//       alert('Please select an exam first');
//       return;
//     }

//     try {
//       // Request fullscreen before navigating
//       const element = document.documentElement;
//       if (element.requestFullscreen) {
//         await element.requestFullscreen();
//       } else if (element.webkitRequestFullscreen) {
//         await element.webkitRequestFullscreen();
//       } else if (element.msRequestFullscreen) {
//         await element.msRequestFullscreen();
//       }
//     } catch (error) {
//       console.error("Error enabling fullscreen:", error);
//     }

//     // Navigate to exam interface with user data and exam info
//     navigate('/exam', {
//       state: {
//         studentInfo: userData,
//         examInfo: examInfo,
//         timeOfExam: time_of_exam,
//         totalMarks: total_marks,
//         selectedExam: selectedExam
//       }
//     });
//   };

//   return (
//     <div className="fixed inset-0 bg-gray-50 overflow-auto">
//       <div className="max-w-7xl mx-auto h-full py-8 px-4">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

//         <div className="lg:col-span-1">
//             <div className="bg-white rounded-xl shadow-lg p-6">
//               <div className="text-center mb-6">
//                 <div className="mx-auto w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
//                   <User className="w-10 h-10 text-[#1c2e4a]" />
//                 </div>
//                 <h2 className="text-xl font-bold text-gray-900">{userData?.full_name || 'Student'}</h2>
//                 <p className="text-gray-600">Aadhar Card No: {userData?.studentId}</p>
//               </div>

//               <div className="space-y-4">
//                 <div className="border-t border-gray-200 pt-4">
//                   <h3 className="font-semibold text-gray-900 mb-3">Profile Information</h3>
//                   <div className="space-y-2 text-sm">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">College:</span>
//                       <span className="font-medium">{userData?.collage_name}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Branch:</span>
//                       <span className="font-medium">{userData?.branch}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Semester:</span>
//                       <span className="font-medium">{userData?.semester}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Email:</span>
//                       <span className="font-medium">{userData?.email_id}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <button
//                   onClick={handleLogout}
//                   className="w-full flex items-center justify-center px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
//                 >
//                   <LogOut className="w-4 h-4 mr-2" />
//                   Logout
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Main Content */}
//           <div className="lg:col-span-3">
//             <div className="bg-white rounded-xl shadow-lg p-8">
//                 <>

//                   <div className="text-center mb-8">
//                     <h1 className="text-3xl font-bold text-gray-900 mb-2">{examConfig.title}</h1>
//                     <div className="flex justify-center items-center space-x-6 text-sm text-gray-600">
//                       <div className="flex items-center">
//                         {/* <Clock className="w-4 h-4 mr-1" /> */}
//                         {/* Duration: {formatTime(time_of_exam)} */}
//                       </div>
//                       <div className="flex items-center">
//                         {/* <CheckCircle className="w-4 h-4 mr-1" />
//                         Questions: {examConfig.totalQuestions} */}
//                       </div>
//                       <div className="flex items-center">
//                         {/* <AlertTriangle className="w-4 h-4 mr-1" />
//                         Passing: {minimummarks}% */}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="mb-8">
//                     <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
//                       <div className="flex items-center">
//                         <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
//                         <h3 className="font-semibold text-red-800">Strict Mode Enabled</h3>
//                       </div>
//                       <p className="text-red-700 mt-2">
//                         This exam operates in strict mode. Any attempt to switch tabs, leave the exam window,
//                         or use prohibited actions will result in automatic submission of your exam.
//                       </p>
//                     </div>

//                     <h2 className="text-xl font-semibold text-gray-900 mb-4">Exam Instructions</h2>
//                     <div className="space-y-3">
//                       <div className="flex items-start">
//                         <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
//                           1
//                         </span>
//                         <p className="text-gray-700">This is a timed exam. You have {formatTime(time_of_exam)} to complete all questions.</p>
//                       </div>
//                       <div className="flex items-start">
//                         <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
//                           2
//                         </span>
//                         <p className="text-gray-700">Each question has only one correct answer.</p>
//                       </div>
//                       <div className="flex items-start">
//                         <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
//                           3
//                         </span>
//                         <p className="text-gray-700">You can navigate between questions using the question palette.</p>
//                       </div>
//                       <div className="flex items-start">
//                         <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
//                           4
//                         </span>
//                         <p className="text-gray-700">Questions can be marked for review and answered later.</p>
//                       </div>
//                       <div className="flex items-start">
//                         <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
//                           5
//                         </span>
//                         <p className="text-gray-700">Strict mode is enabled - switching tabs or leaving the exam window will result in automatic submission.</p>
//                       </div>
//                       <div className="flex items-start">
//                         <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
//                           6
//                         </span>
//                         <p className="text-gray-700">Right-click, copy, and paste are disabled during the exam.</p>
//                       </div>
//                       <div className="flex items-start">
//                         <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
//                           7
//                         </span>
//                         <p className="text-gray-700">Your progress is automatically saved.</p>
//                       </div>
//                       <div className="flex items-start">
//                         <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
//                           8
//                         </span>
//                         <p className="text-gray-700">Click 'Submit Exam' when you're ready to finish.</p>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
//                     <h3 className="font-semibold text-yellow-800 mb-2">Important Notes:</h3>
//                     <ul className="text-yellow-700 space-y-1 text-sm">
//                       <li>• Ensure you have a stable internet connection</li>
//                       <li>• Close all other applications and browser tabs</li>
//                       <li>• Use a desktop or laptop for the best experience</li>
//                       <li>• Do not refresh the page during the exam</li>
//                     </ul>
//                   </div>

//                     <div className="mb-8">
//                     <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Exams</h2>
//                     <ExamCards
//                       examTitles={examTitles}
//                       onExamSelect={handleExamSelect}
//                       selectedExam={selectedExam}
//                     />
//                   </div>
//                 {examTitles.remaining_exams && examTitles.remaining_exams.length > 0 &&
//                   <div className="text-center">
//                     <button
//                       onClick={handleStartExam}
//                       className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-8 rounded-lg transition-colors text-lg focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
//                     >
//                       {selectedExam ? `Start ${selectedExam.exam_name}` : 'Select an Exam'}
//                     </button>
//                   </div>
//                   }
//                 </>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExamInstructions;
import React, { useEffect, useState } from "react";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  User,
  LogOut,
  BookOpen,
  Shield,
  Timer,
  Users,
  Award,
} from "lucide-react";
import { examConfig } from "../data/questions";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { get_exam_apptitude_info, get_is_exam_completed } from "../api/get_question";
import { get_apptitude_exams } from "../api/get_apptitude_exam";
import ExamCards from "./ExamCards";

const ExamInstructions = () => {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();
  const [cetegorystate, setcetegorystate] = useState("");
  const [examInfo, setExamInfo] = useState(null);
  const [minimummarks, setminimummarks] = useState("");
  const [time_of_exam, settime_of_exam] = useState("");
  const [total_marks, set_total_marks] = useState("");
  const [username, setusername] = useState("");
  const [iscompletedexam, setiscompletedexam] = useState("");
  const [examTitles, setExamTitles] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);

  const formatTime = (time_of_exam) => {
    console.log("Raw time_of_exam value:", time_of_exam);

    if (!time_of_exam) return "0 minutes";

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
      setusername(userData.name);
    }
  }, [userData]);

  useEffect(() => {
    const fetchExamInfo = async () => {
      if (username) {
        try {
          const get_exam_title = await get_apptitude_exams(username);
          console.log("get_exam_title", get_exam_title.data.message);
          setExamTitles(get_exam_title.data.message);
          console.log("cetegorystate", cetegorystate);
          const get_exam_info = await get_exam_apptitude_info(cetegorystate);
          console.log("get_exam_info", get_exam_info.data.message[0]);
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
  }, [cetegorystate, username]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleExamSelect = (exam) => {
    setSelectedExam(exam);
    setcetegorystate(exam.name);
  };

  const handleStartExam = async () => {
    if (!selectedExam) {
      alert("Please select an exam first");
      return;
    }

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
    navigate("/exam", {
      state: {
        studentInfo: userData,
        examInfo: examInfo,
        timeOfExam: time_of_exam,
        totalMarks: total_marks,
        selectedExam: selectedExam,
      },
    });
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden">
      {/* Top Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200/60 px-6 py-3">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Aptitude Examination Portal</h1>
              <p className="text-xs text-gray-600">Secure Testing Environment</p>
            </div>
          </div>
          {/* <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>Student Portal</span>
          </div> */}
        </div>
      </div>

      <div className="h-[calc(100vh-80px)] flex">
        {/* Left Sidebar - Student Profile */}
        <div className="w-80 bg-white/70 backdrop-blur-sm border-r border-gray-200/50 p-4">
          <div className="h-full flex flex-col">
            {/* Profile Header */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-4 text-white mb-4">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3">
                  <User className="w-8 h-8" />
                </div>
                <h2 className="text-lg font-bold">{userData?.full_name || "Student"}</h2>
                <p className="text-blue-100 text-sm">ID: {userData?.studentId}</p>
              </div>
            </div>

            {/* Profile Details */}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-3 text-sm">Profile Information</h3>
              <div className="space-y-2">
                {[
                  { label: "College", value: userData?.collage_name },
                  { label: "Branch", value: userData?.branch },
                  { label: "Semester", value: userData?.semester },
                  { label: "Email", value: userData?.email_id },
                ].map((item, index) => (
                  <div key={index} className="bg-gray-50/80 rounded-lg p-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-xs">{item.label}</span>
                      <span className="font-medium text-gray-900 text-xs truncate max-w-32">
                        {item.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-lg transition-colors text-sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-hidden">
          <div className="h-full grid grid-rows-[auto,auto,1fr,auto] gap-4">
            {/* Header Section */}
            {/* <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{examConfig.title}</h1>
              <div className="flex justify-center space-x-6">
                <div className="bg-blue-100 px-3 py-1 rounded-full text-sm">
                  <Timer className="w-4 h-4 inline mr-1" />
                  {formatTime(time_of_exam)}
                </div>
                <div className="bg-green-100 px-3 py-1 rounded-full text-sm">
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  {examConfig.totalQuestions} Questions
                </div>
                <div className="bg-amber-100 px-3 py-1 rounded-full text-sm">
                  <Award className="w-4 h-4 inline mr-1" />
                  {minimummarks}% Pass
                </div>
              </div>
            </div> */}

            {/* Security Notice */}
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-400 rounded-lg p-3">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-red-600 mr-2" />
                <div>
                  <h3 className="font-semibold text-red-800 text-sm">🔒 Strict Mode Enabled</h3>
                  <p className="text-red-700 text-xs">
                    Switching tabs or leaving the window will auto-submit your exam.
                  </p>
                </div>
              </div>
            </div>

            {/* Instructions Grid */}
            <div className="grid grid-cols-2 gap-4 overflow-auto">
              {/* Instructions Column */}
              <div className="bg-white/80 rounded-xl p-4 border border-gray-200/50">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Examination Guidelines</h2>
                <div className="space-y-2">
                  {[
                    {
                      icon: <Clock className="w-4 h-4" />,
                      text: `Complete all questions within ${formatTime(time_of_exam)}`,
                    },
                    {
                      icon: <CheckCircle className="w-4 h-4" />,
                      text: "Each question has only one correct answer",
                    },
                    {
                      icon: <BookOpen className="w-4 h-4" />,
                      text: "Use question palette for navigation",
                    },
                    {
                      icon: <AlertTriangle className="w-4 h-4" />,
                      text: "Mark questions for review if needed",
                    },
                    {
                      icon: <Shield className="w-4 h-4" />,
                      text: "Avoid switching tabs (auto-submit)",
                    },
                    {
                      icon: <User className="w-4 h-4" />,
                      text: "Right-click, copy, paste disabled",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                      <div className="text-blue-600">{item.icon}</div>
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 bg-amber-50 rounded-lg p-3 border border-amber-200">
                  <h3 className="font-semibold text-amber-800 text-sm mb-2">Pre-Exam Checklist:</h3>
                  <div className="space-y-1">
                    {[
                      "Stable internet connection",
                      "Close other applications",
                      "Use desktop/laptop",
                      "Don't refresh the page",
                    ].map((item, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                        <span className="text-amber-700 text-xs">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Available Exams Column */}
              <div className="bg-white/80 rounded-xl p-4 border border-gray-200/50">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Available Examinations</h2>
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-auto">
                    <ExamCards
                      examTitles={examTitles}
                      onExamSelect={handleExamSelect}
                      selectedExam={selectedExam}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Start Exam Button */}
            {examTitles.remaining_exams && examTitles.remaining_exams.length > 0 && (
              <div className="text-center">
                <button
                  onClick={handleStartExam}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 focus:ring-4 focus:ring-green-300 focus:outline-none">
                  {selectedExam
                    ? `🚀 Start ${selectedExam.exam_name}`
                    : "📝 Select an Exam to Begin"}
                </button>
                {selectedExam && (
                  <p className="text-gray-600 mt-2 text-xs">
                    Click to enter fullscreen mode and begin examination
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamInstructions;
