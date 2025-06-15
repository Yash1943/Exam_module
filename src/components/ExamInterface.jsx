import React, { useState, useEffect } from "react";
import { Clock, AlertTriangle, CheckCircle, Flag, ArrowLeft, ArrowRight } from "lucide-react";
import { useTimer } from "../hooks/useTimer";
import { useExamSecurity } from "../hooks/useExamSecurity";
import { useLocation, useNavigate } from "react-router-dom";
import { get_exam_apptitude_questions, save_apptitude_evalution } from "../api/get_question";
import { makePostApiCall } from "../api/makeapicall";

const ExamInterface = ({ onExamComplete }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { studentInfo, examInfo, timeOfExam, totalMarks } = location.state || {};

  // Helper to parse time string into seconds
  const parseTime = (timeString) => {
    if (!timeString) return 0;
    const match = timeString.match(/\[(\d+):(\d+):(\d+)\]/);
    if (match) {
      const [_, hours, minutes, seconds] = match;
      return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
    }
    return 0;
  };

  // Helper to format time for display
  const formatExamTime = (time_of_exam) => {
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

    return time_of_exam;
  };

  const initialTimeInSeconds = parseTime(timeOfExam);

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [violationCount, setViolationCount] = useState(0);
  const [showViolationWarning, setShowViolationWarning] = useState(false);

  const handleTimeUp = () => {
    submitExam();
  };

  const { timeLeft, startTimer, formatTime } = useTimer(initialTimeInSeconds, handleTimeUp);

  const handleViolation = (message) => {
    setViolationCount((prev) => prev + 1);
    setShowViolationWarning(true);

    if (violationCount >= 2) {
      alert("Multiple violations detected. Exam will be submitted automatically.");
      submitExam();
    } else {
      alert(message);
      setTimeout(() => setShowViolationWarning(false), 5000);
    }
  };

  useExamSecurity(true, handleViolation);

  useEffect(() => {
    if (initialTimeInSeconds > 0) {
      startTimer();
    }
    // Prevent zooming
    document.addEventListener(
      "wheel",
      (e) => {
        if (e.ctrlKey) {
          e.preventDefault();
        }
      },
      { passive: false }
    );
    // Cleanup function for event listener
    return () => {
      document.removeEventListener(
        "wheel",
        (e) => {
          if (e.ctrlKey) {
            e.preventDefault();
          }
        },
        { passive: false }
      );
    };
  }, [initialTimeInSeconds, startTimer]);

  // Fetch and parse questions
  useEffect(() => {
    const fetchQuestions = async () => {
      if (examInfo?.data?.message[0]?.category) {
        try {
          const fetchedQuestions = await get_exam_apptitude_questions(1);
          console.log("fetchedQuestions", fetchedQuestions.data.message);

          const parsedQuestions = fetchedQuestions.data.message.map((q) => ({
            ...q,
            option: JSON.parse(q.option),
            answer: JSON.parse(q.answer),
            id: q.id || Math.random().toString(36).substr(2, 9), // Ensure each question has a unique ID
          }));
          setQuestions(parsedQuestions);
          // Initialize selectedAnswers with empty values for each question
          const initialAnswers = {};
          parsedQuestions.forEach((q) => {
            initialAnswers[q.id] = undefined;
          });
          setSelectedAnswers(initialAnswers);
        } catch (error) {
          console.error("Error fetching questions:", error);
        }
      } else {
        console.warn("Exam category not available in examInfo.");
      }
    };
    fetchQuestions();
  }, [examInfo]);

  // Redirect if no student info
  useEffect(() => {
    if (!studentInfo) {
      navigate("/instructions");
    }
  }, [studentInfo, navigate]);

  const handleOptionSelect = (questionId, value) => {
    console.log("Selecting answer:", { questionId, value });
    setSelectedAnswers((prev) => {
      const newAnswers = { ...prev };
      newAnswers[questionId] = value;
      return newAnswers;
    });
  };

  const handleMarkForReviewToggle = (questionId) => {
    setMarkedForReview((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const submitExam = async () => {
    const results = calculateResults();
    const timeSpent = initialTimeInSeconds - timeLeft;
    console.log("studentInfo", studentInfo);
    const username = studentInfo.name;
    const exam_type = studentInfo.applied_position_preference;
    //    {
    //     "studentId": "123",
    //     "name": 1,
    //     "full_name": "yash",
    //     "collage_name": "sk",
    //     "branch": "IT",
    //     "addhar_card_no": "123",
    //     "applied_position_preference": "1",
    //     "prn_no": "123",
    //     "phone_no": 123,
    //     "email_id": "yash@sd.com",
    //     "semester": "VII"
    // }
    console.log("results", results); //{
    //     "totalQuestions": 4,
    //     "attempted": 4,
    //     "correct": 3,
    //     "incorrect": 1,
    //     "unanswered": 0,
    //     "percentage": 75,
    //     "passed": true
    // }
    const total_marks = results.correct;
    const participant_evaluation = questions.map((question) => {
      const userAnswer = selectedAnswers[question.id];
      const isCorrect =
        question.option && question.option.length > 0
          ? question.option[userAnswer] === question.answer
          : String(userAnswer).toLowerCase().trim() ===
            String(question.answer).toLowerCase().trim();

      return {
        question: question.question,
        answer:
          userAnswer !== undefined
            ? question.option
              ? question.option[userAnswer]
              : userAnswer
            : "Not answered",
        Evaluation: isCorrect ? "Correct" : "Incorrect",
      };
    });

    console.log("participant_evaluation", participant_evaluation);

    const parrticipant_score_save = await makePostApiCall(
      "samcore.samcore_api.save_apptitude_evalution",
      {
        username,
        exam_type,
        total_marks,
        participant_evaluation,
      }
    );

    console.log("parrticipant_score_save", parrticipant_score_save);

    console.log("Exam Results:", {
      results,
      timeSpent,
      violationCount,
      studentInfo: {
        id: studentInfo?.studentId,
        name: studentInfo?.full_name,
      },
    });

    navigate("/results", {
      state: {
        examData: {
          results,
          timeSpent,
          violationCount,
          studentInfo,
        },
      },
    });
  };

  const calculateResults = () => {
    let correct = 0;
    let attempted = 0;

    questions.forEach((question) => {
      const selectedAnswer = selectedAnswers[question.id];
      if (selectedAnswer !== undefined && selectedAnswer !== "") {
        attempted++;

        if (question.option && question.option.length > 0) {
          // Multiple choice question
          if (question.option[selectedAnswer] === question.answer) {
            correct++;
          }
        } else {
          // Text input question
          const userAnswer = String(selectedAnswer).toLowerCase().trim();
          const correctAnswer = String(question.answer).toLowerCase().trim();

          if (userAnswer === correctAnswer || userAnswer.includes(correctAnswer)) {
            correct++;
          }
        }
      }
    });

    const percentage = attempted > 0 ? (correct / questions.length) * 100 : 0;

    return {
      totalQuestions: questions.length,
      attempted,
      correct,
      incorrect: attempted - correct,
      unanswered: questions.length - attempted,
      percentage: Math.round(percentage * 100) / 100,
      passed: percentage >= (examInfo?.data?.message[0]?.minimum_passing_score || 0),
    };
  };

  const getQuestionStatus = (questionId) => {
    const selectedAnswer = selectedAnswers[questionId];
    const isMarked = markedForReview.has(questionId);

    if (selectedAnswer !== undefined && selectedAnswer !== "") {
      return isMarked ? "answered-marked" : "answered";
    }
    return isMarked ? "marked" : "unanswered";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "answered":
        return "bg-green-500 text-white";
      case "answered-marked":
        return "bg-orange-500 text-white";
      case "marked":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const currentQ = questions[currentQuestionIndex] || {}; // Fallback to empty object if questions not loaded

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleQuestionPaletteClick = (index) => {
    setCurrentQuestionIndex(index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">MCQ Exam</h1>
              <p className="text-sm text-gray-600">Student: {studentInfo?.studentId}</p>
            </div>

            <div className="flex items-center space-x-6">
              {violationCount > 0 && (
                <div className="flex items-center text-red-600">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">Violations: {violationCount}</span>
                </div>
              )}

              <div
                className={`flex items-center px-3 py-2 rounded-lg ${
                  timeLeft < 300 ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                }`}>
                <Clock className="w-4 h-4 mr-2" />
                <span className="font-mono font-semibold">
                  {typeof formatTime === "function" ? formatTime() : "00:00"}
                </span>
              </div>

              <button
                onClick={submitExam}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Submit Exam
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Violation Warning */}
      {showViolationWarning && (
        <div className="bg-red-500 text-white px-4 py-2 text-center">
          <p className="font-medium">
            ⚠️ Security Violation Detected! Avoid switching tabs or leaving the exam window.
          </p>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Panel */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{currentQ.subject}</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      currentQ.difficulty === "Easy"
                        ? "bg-green-100 text-green-700"
                        : currentQ.difficulty === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                    {currentQ.difficulty}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-lg text-gray-900 leading-relaxed">{currentQ.question}</p>
              </div>

              <div className="space-y-3 mb-6">
                {currentQ.option && currentQ.option.length > 0 ? (
                  // Multiple choice questions
                  currentQ.option.map((option, index) => (
                    <label
                      key={`${currentQ.id}-${index}`}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedAnswers[currentQ.id] === index
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}>
                      <input
                        type="radio"
                        name={`question-${currentQ.id}`}
                        value={index}
                        checked={selectedAnswers[currentQ.id] === index}
                        onChange={() => handleOptionSelect(currentQ.id, index)}
                        className="mr-3 text-blue-500"
                      />
                      <span className="text-gray-900">{option}</span>
                    </label>
                  ))
                ) : (
                  // Text input questions
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <textarea
                      value={selectedAnswers[currentQ.id] || ""}
                      onChange={(e) => handleOptionSelect(currentQ.id, e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px] resize-none"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleMarkForReviewToggle(currentQ.id)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    markedForReview.has(currentQ.id)
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}>
                  <Flag className="w-4 h-4 mr-2" />
                  {markedForReview.has(currentQ.id) ? "Unmark" : "Mark for Review"}
                </button>

                <div className="flex space-x-4">
                  <button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="flex items-center px-4 py-2 rounded-lg font-medium transition-colors bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </button>
                  <button
                    onClick={handleNextQuestion}
                    disabled={
                      currentQuestionIndex === questions.length - 1 || questions.length === 0
                    }
                    className="flex items-center px-4 py-2 rounded-lg font-medium transition-colors bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Question Palette and Progress */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Question Palette</h3>
              <div className="grid grid-cols-5 gap-3">
                {questions.map((q, index) => (
                  <button
                    key={q.id || index}
                    onClick={() => handleQuestionPaletteClick(index)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-semibold transition-colors
                      ${getStatusColor(getQuestionStatus(q.id))}
                      ${index === currentQuestionIndex ? "ring-2 ring-blue-500 ring-offset-2" : ""}
                    `}>
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                    Answered:
                  </span>
                  <span className="font-semibold">{Object.keys(selectedAnswers).length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <span className="w-3 h-3 bg-gray-200 rounded-full mr-2"></span>
                    Not Answered:
                  </span>
                  <span className="font-semibold">
                    {questions.length - Object.keys(selectedAnswers).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                    Marked for Review:
                  </span>
                  <span className="font-semibold">{markedForReview.size}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center">
                    <span className="w-3 h-3 bg-orange-500 rounded-full mr-2"></span>
                    Answered & Marked:
                  </span>
                  <span className="font-semibold">
                    {
                      Array.from(markedForReview).filter((id) => selectedAnswers[id] !== undefined)
                        .length
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamInterface;
