import React from 'react';

const QuestionList = ({ questions }) => {
  // Function to get color based on difficulty level
  const getDifficultyColor = (level) => {
    switch (level.toLowerCase()) {
      case 'Easy':
        return 'bg-green-100 text-green-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hard':
        return 'bg-red-100 text-red-800';
      case 'Extreme':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6 p-4">
      {questions.map((question, index) => {
        console.log('Question Level:', question.question_leval);
        return (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Question {index + 1}
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(question.question_leval)}`}>
                {question.question_leval}
              </span>
            </div>
            
            <p className="text-gray-700 mb-4">{question.question}</p>
            
            <div className="space-y-2">
              {JSON.parse(question.option).map((option, optIndex) => (
                <div 
                  key={optIndex}
                  className={`p-3 rounded-lg border ${
                    option === JSON.parse(question.answer)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              Marks: {question.marks}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuestionList; 