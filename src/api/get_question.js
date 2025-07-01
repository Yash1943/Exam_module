// Mock exam data for testing
const MOCK_EXAM_INFO = {
  data: {
    message: [{
      category: 'Software Developer',
      minimum_passing_score: 60,
      time_of_exam: '[00:30:00]', // 30 minutes
      total_marks: 100
    }]
  }
};

const MOCK_QUESTIONS = {
  data: {
    message: [
      {
        id: 1,
        question: "What does OOP stand for?",
        option: JSON.stringify(["Object-Oriented Programming", "Object-Oriented Process", "Objective-Oriented Programming", "None of the above"]),
        answer: "Object-Oriented Programming",
        marks: 2,
        question_leval: "Easy",
        subject: "Programming"
      },
      {
        id: 2,
        question: "Which of these is not an OOP principle?",
        option: JSON.stringify(["Inheritance", "Encapsulation", "Compilation", "Polymorphism"]),
        answer: "Compilation",
        marks: 2,
        question_leval: "Easy",
        subject: "Programming"
      },
      {
        id: 3,
        question: "What is encapsulation in OOP?",
        option: JSON.stringify(["Hiding data", "Writing long functions", "Calling multiple functions", "None of the above"]),
        answer: "Hiding data",
        marks: 3,
        question_leval: "Medium",
        subject: "Programming"
      },
      {
        id: 4,
        question: "Which OOP principle allows the same method to behave differently?",
        option: JSON.stringify(["Inheritance", "Encapsulation", "Polymorphism", "Constructor"]),
        answer: "Polymorphism",
        marks: 3,
        question_leval: "Medium",
        subject: "Programming"
      },
      {
        id: 5,
        question: "What is the use of constructor in a class?",
        option: JSON.stringify(["Destroy object", "Initialize object", "Loop a class", "None"]),
        answer: "Initialize object",
        marks: 2,
        question_leval: "Easy",
        subject: "Programming"
      },
      {
        id: 6,
        question: "Which keyword is used for inheritance in Python?",
        option: JSON.stringify(["inherit", "extends", "class", "(BaseClassName)"]),
        answer: "(BaseClassName)",
        marks: 2,
        question_leval: "Easy",
        subject: "Python"
      },
      {
        id: 7,
        question: "What is method overloading?",
        option: JSON.stringify(["Same method name with different parameters", "Same method in different languages", "Using static methods", "Overriding class"]),
        answer: "Same method name with different parameters",
        marks: 3,
        question_leval: "Medium",
        subject: "Programming"
      },
      {
        id: 8,
        question: "What is the output of type([])?",
        option: JSON.stringify(["list", "tuple", "dict", "set"]),
        answer: "list",
        marks: 2,
        question_leval: "Easy",
        subject: "Python"
      },
      {
        id: 9,
        question: "Which keyword defines a function in Python?",
        option: JSON.stringify(["def", "function", "lambda", "fun"]),
        answer: "def",
        marks: 2,
        question_leval: "Easy",
        subject: "Python"
      },
      {
        id: 10,
        question: "Output of typeof [] in JavaScript?",
        option: JSON.stringify(["object", "array", "list", "undefined"]),
        answer: "object",
        marks: 3,
        question_leval: "Medium",
        subject: "JavaScript"
      }
    ]
  }
};

export const get_exam_apptitude_info = async (categoryType) => {
  try {
    console.log('Mock exam info for category:', categoryType);
    return MOCK_EXAM_INFO;
  } catch (error) {
    console.error('Error fetching exam info:', error);
    return MOCK_EXAM_INFO;
  }
};

export const get_exam_apptitude_questions = async (categoryType) => {
  try {
    console.log('Mock questions for category:', categoryType);
    return MOCK_QUESTIONS;
  } catch (error) {
    console.error('Error fetching questions:', error);
    return MOCK_QUESTIONS;
  }
};

export const get_is_exam_completed = async (username) => {
  try {
    console.log('Mock exam completion check for user:', username);
    // Return 0 for testing - allows all users to take exam
    return {
      data: {
        message: 0
      }
    };
  } catch (error) {
    console.error('Error checking exam completion:', error);
    return {
      data: {
        message: 0
      }
    };
  }
};

export const save_apptitude_evalution = async (username, exam_type, total_marks, participant_evaluation) => {
  try {
    console.log('Mock saving evaluation:', { username, exam_type, total_marks, participant_evaluation });
    return {
      success: true,
      message: 'Evaluation saved successfully'
    };
  } catch (error) {
    console.error('Error saving evaluation:', error);
    return {
      success: true,
      message: 'Evaluation saved successfully'
    };
  }
};