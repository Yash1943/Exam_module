import React from "react";
import { BookOpen, CheckCircle } from "lucide-react";

const ExamCards = ({ examTitles, onExamSelect, selectedExam }) => {
  // Function to generate a random color based on the category name
  const getCategoryColor = (category) => {
    const colors = [
      "bg-blue-100 text-blue-600",
      "bg-purple-100 text-purple-600",
      "bg-green-100 text-green-600",
      "bg-yellow-100 text-yellow-600",
      "bg-red-100 text-red-600",
      "bg-indigo-100 text-indigo-600",
      "bg-pink-100 text-pink-600",
      "bg-orange-100 text-orange-600",
    ];

    // Use the category name to consistently generate the same color
    const index =
      category.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
    return colors[index];
  };

  return (
    <div className="space-y-8">
      {/* Completed Exams Section */}
      {examTitles.completed_exams && examTitles.completed_exams.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Completed Exams</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {examTitles.completed_exams.map((exam, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200 opacity-75">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${getCategoryColor(exam.category)}`}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{exam.exam_name}</h3>
                      {/* <span className="flex items-center text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Completed
                      </span> */}
                    </div>

                    <span className="flex items-center text-green-600 text-sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Completed
                      </span>
                    {/* <p className="text-gray-600">
                      {exam.category}
                    </p> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Remaining Exams Section */}
      {examTitles.remaining_exams && examTitles.remaining_exams.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Exams</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {examTitles.remaining_exams.map((exam, index) => (
              <div
                key={index}
                onClick={() => onExamSelect({ ...exam, category: exam.name })}
                className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${
                  selectedExam?.name === exam.name
                    ? "border-green-500 shadow-green-100"
                    : "border-transparent hover:border-gray-200"
                }`}>
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${getCategoryColor(exam.category)}`}>
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{exam.exam_name}</h3>
                    {/* <p className="text-gray-600">
                      {exam.category}
                    </p> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Exams Available Message */}
      {(!examTitles.remaining_exams || examTitles.remaining_exams.length === 0) &&
        (!examTitles.completed_exams || examTitles.completed_exams.length === 0) && (
          <div className="text-center py-8">
            <p className="text-gray-600">No exams available at the moment.</p>
          </div>
        )}
    </div>
  );
};

export default ExamCards;
