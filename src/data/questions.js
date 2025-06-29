export const examQuestions =[
  {
    "id": 1,
    "question": "What does OOP stand for?",
    "options": [],
    "correctAnswer": null,
    "subject": "OOP",
    "difficulty": "Easy"
  },
  {
    "id": 2,
    "question": "Which of these is not an OOP principle?",
    "options": ["Inheritance", "Encapsulation", "Compilation", "Polymorphism"],
    "correctAnswer": 2,
    "subject": "OOP",
    "difficulty": "Easy"
  },
  {
    "id": 3,
    "question": "What is encapsulation in OOP?",
    "options": ["Hiding data", "Writing long functions", "Calling multiple functions", "None of the above"],
    "correctAnswer": 0,
    "subject": "OOP",
    "difficulty": "Easy"
  },
  {
    "id": 4,
    "question": "Which OOP principle allows the same method to behave differently?",
    "options": ["Inheritance", "Encapsulation", "Polymorphism", "Constructor"],
    "correctAnswer": 2,
    "subject": "OOP",
    "difficulty": "Medium"
  },
  {
    "id": 5,
    "question": "What is the use of constructor in a class?",
    "options": ["Destroy object", "Initialize object", "Loop a class", "None"],
    "correctAnswer": 1,
    "subject": "OOP",
    "difficulty": "Easy"
  },
  {
    "id": 6,
    "question": "Write a one-line Python class with constructor having name as a parameter.",
    "options": [],
    "correctAnswer": null,
    "subject": "OOP",
    "difficulty": "Medium"
  },
  {
    "id": 7,
    "question": "Which keyword is used for inheritance in Python?",
    "options": ["inherit", "extends", "class", "(BaseClassName)"],
    "correctAnswer": 3,
    "subject": "OOP",
    "difficulty": "Easy"
  },
  {
    "id": 8,
    "question": "What is method overloading?",
    "options": ["Same method name with different parameters", "Same method in different languages", "Using static methods", "Overriding class"],
    "correctAnswer": 0,
    "subject": "OOP",
    "difficulty": "Medium"
  },
  {
    "id": 9,
    "question": "Which OOP principle allows Driver and Rider to inherit from User and have custom behavior?",
    "options": [],
    "correctAnswer": null,
    "subject": "OOP",
    "difficulty": "Hard"
  },
  {
    "id": 10,
    "question": "What is the output of: class A: def show(self): print(\"A\") class B(A): def show(self): print(\"B\") class C(A): def show(self): print(\"C\") class D(B, C): pass d = D(); d.show()",
    "options": ["A", "B", "C", "Error"],
    "correctAnswer": 1,
    "subject": "OOP",
    "difficulty": "Hard"
  },
  {
    "id": 11,
    "question": "Difference between composition and inheritance? Which is better for reusable components?",
    "options": [],
    "correctAnswer": null,
    "subject": "OOP",
    "difficulty": "Hard"
  },
  {
    "id": 12,
    "question": "Which OOP concept hides internal details?",
    "options": ["Abstraction", "Inheritance", "Polymorphism", "Reflection"],
    "correctAnswer": 0,
    "subject": "OOP",
    "difficulty": "Easy"
  },
  {
    "id": 13,
    "question": "A class is a ___ of an object.",
    "options": ["Type", "Blueprint", "Copy", "Function"],
    "correctAnswer": 1,
    "subject": "OOP",
    "difficulty": "Easy"
  },

  {
    "id": 14,
    "question": "What is the output of type([])?",
    "options": ["list", "tuple", "dict", "set"],
    "correctAnswer": 0,
    "subject": "Python",
    "difficulty": "Easy"
  },
  {
    "id": 15,
    "question": "Write a Python function that returns the product of 2 arguments.",
    "options": [],
    "correctAnswer": null,
    "subject": "Python",
    "difficulty": "Medium"
  },
  {
    "id": 16,
    "question": "print(\"5\" * 3) gives?",
    "options": ["15", "555", "Error", "5"],
    "correctAnswer": 1,
    "subject": "Python",
    "difficulty": "Easy"
  },
  {
    "id": 17,
    "question": "Which keyword defines a function?",
    "options": ["def", "function", "lambda", "fun"],
    "correctAnswer": 0,
    "subject": "Python",
    "difficulty": "Easy"
  },
  {
    "id": 18,
    "question": "What will be the output of: i = 1 while True: if i%3 == 0: break print(i) i += 1",
    "options": ["1 2 3", "error", "1 2", "none of the mentioned"],
    "correctAnswer": 2,
    "subject": "Python",
    "difficulty": "Medium"
  },
  {
    "id": 19,
    "question": "What will be the output of x=1 then x<<2?",
    "options": ["4", "2", "1", "8"],
    "correctAnswer": 0,
    "subject": "Python",
    "difficulty": "Medium"
  },
  {
    "id": 20,
    "question": "Python supports the creation of anonymous functions using __________",
    "options": ["pi", "anonymous", "lambda", "none of the mentioned"],
    "correctAnswer": 2,
    "subject": "Python",
    "difficulty": "Medium"
  },

  {
    "id": 21,
    "question": "Output of typeof [] in JavaScript?",
    "options": ["object", "array", "list", "undefined"],
    "correctAnswer": 0,
    "subject": "JavaScript",
    "difficulty": "Easy"
  },
  {
    "id": 22,
    "question": "Write a one-liner to declare const PI = 3.14 in JS.",
    "options": [],
    "correctAnswer": null,
    "subject": "JavaScript",
    "difficulty": "Easy"
  },
  {
    "id": 23,
    "question": "What does console.log(2 + \"3\") print?",
    "options": ["5", "23", "NaN", "Error"],
    "correctAnswer": 1,
    "subject": "JavaScript",
    "difficulty": "Medium"
  },
  {
    "id": 24,
    "question": "What is the output of equalto() when num = 10 and compared using === '10'?",
    "options": ["True", "False", "Compilation error", "Runtime error"],
    "correctAnswer": 1,
    "subject": "JavaScript",
    "difficulty": "Medium"
  },
  {
    "id": 25,
    "question": "What will be output of: var height=123.56; var type =(height>=190)?\"Taller\":\"Little short\";",
    "options": [],
    "correctAnswer": null,
    "subject": "JavaScript",
    "difficulty": "Easy"
  },
  {
    "id": 26,
    "question": "What happens with: var js=0; while(js<10) { console.log(js); js++; }",
    "options": [
      "An exception is thrown",
      "Values are stored in memory",
      "Values from 0 to 9 are shown",
      "An error is displayed"
    ],
    "correctAnswer": 2,
    "subject": "JavaScript",
    "difficulty": "Medium"
  },

  {
    "id": 27,
    "question": "SQL command to delete all records from a table?",
    "options": [],
    "correctAnswer": null,
    "subject": "SQL",
    "difficulty": "Easy"
  },
  {
    "id": 28,
    "question": "Which SQL command is used to add a new column to an existing table?",
    "options": ["ALTER COLUMN", "NEW COLUMN", "INSERT COLUMN", "ALTER TABLE"],
    "correctAnswer": 3,
    "subject": "SQL",
    "difficulty": "Medium"
  },
  {
    "id": 29,
    "question": "Which type of DBMS is MySQL?",
    "options": ["Object-oriented", "Hierarchical", "Relational", "None of the above"],
    "correctAnswer": 2,
    "subject": "SQL",
    "difficulty": "Easy"
  },
  {
    "id": 30,
    "question": "Which keyword is used to sort results?",
    "options": ["GROUP BY", "ORDER BY", "FILTER BY", "SORT"],
    "correctAnswer": 1,
    "subject": "SQL",
    "difficulty": "Medium"
  },
  {
    "id": 31,
    "question": "Write SQL to show names of students with marks > 60 from students table.",
    "options": [],
    "correctAnswer": null,
    "subject": "SQL",
    "difficulty": "Medium"
  },
  {
    "id": 32,
    "question": "Write SQL to get employees with salary > avg salary in their dept.",
    "options": [],
    "correctAnswer": null,
    "subject": "SQL",
    "difficulty": "Hard"
  },
  {
    "id": 33,
    "question": "Difference between LEFT JOIN and FULL OUTER JOIN with example.",
    "options": [],
    "correctAnswer": null,
    "subject": "SQL",
    "difficulty": "Hard"
  },
  {
    "id": 34,
    "question": "Which MySQL data type is used to store large text?",
    "options": ["TEXT", "CHAR", "BIGCHAR", "LARGETEXT"],
    "correctAnswer": 0,
    "subject": "SQL",
    "difficulty": "Easy"
  },
  {
    "id": 35,
    "question": "Which of the following is not an SQL aggregate function?",
    "options": ["COUNT()", "MAX()", "CONCAT()", "SUM()"],
    "correctAnswer": 2,
    "subject": "SQL",
    "difficulty": "Medium"
  },

  {
    "id": 36,
    "question": "Git command to check current branch?",
    "options": [],
    "correctAnswer": null,
    "subject": "Git",
    "difficulty": "Easy"
  },
  {
    "id": 37,
    "question": "What does git commit -m \"msg\" do?",
    "options": ["Adds changes", "Stages file", "Saves snapshot", "Pushes to repo"],
    "correctAnswer": 2,
    "subject": "Git",
    "difficulty": "Medium"
  },
  {
    "id": 38,
    "question": "How to merge main into feature-x safely?",
    "options": [],
    "correctAnswer": null,
    "subject": "Git",
    "difficulty": "Hard"
  },
  {
    "id": 39,
    "question": "Which is shortcut to stage all changes?",
    "options": ["git add", "git commit", "git commit add", "git push -am \"Message\""],
    "correctAnswer": 0,
    "subject": "Git",
    "difficulty": "Medium"
  },
  {
    "id": 40,
    "question": "Which of the following is NOT related to Git?",
    "options": ["branch", "stem", "fork", "staging area"],
    "correctAnswer": 1,
    "subject": "Git",
    "difficulty": "Medium"
  }
]

// Function to shuffle array using Fisher-Yates algorithm
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const examConfig = {
  title: "Samarth Technoverse Apptitude Exam",
  duration: 30, // minutes
  totalQuestions: examQuestions.length,
  passingScore: 60, // percentage
  instructions: [
    "This is a timed exam. You have 30 minutes to complete all questions.",
    "Each question has only one correct answer.",
    "You can navigate between questions using the question palette.",
    "Questions can be marked for review and answered later.",
    "Strict mode is enabled - switching tabs or leaving the exam window will result in automatic submission.",
    "Right-click, copy, and paste are disabled during the exam.",
    "Your progress is automatically saved.",
    "Click 'Submit Exam' when you're ready to finish."
  ]
};