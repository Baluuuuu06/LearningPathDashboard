import os
import sys
from loguru import logger
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.db import db

def seed_questions():
    logger.info("Seeding Question Bank...")
    
    questions = [
        # Python - Beginner
        {
            "topic": "Python",
            "difficulty": "beginner",
            "format": "mcq",
            "questionText": "What is the correct syntax to output 'Hello World' in Python?",
            "options": ["p('Hello World')", "echo 'Hello World'", "print('Hello World')", "printf('Hello World')"],
            "correctAnswers": ["print('Hello World')"],
            "explanation": "The print() function is the standard way to output data to the console in Python.",
            "tags": ["syntax", "basics"]
        },
        {
            "topic": "Python",
            "difficulty": "beginner",
            "format": "mcq",
            "questionText": "Which of the following is used to define a function in Python?",
            "options": ["function", "def", "func", "define"],
            "correctAnswers": ["def"],
            "explanation": "The 'def' keyword is used to declare a function in Python.",
            "tags": ["functions", "basics"]
        },
        {
            "topic": "Python",
            "difficulty": "beginner",
            "format": "multi_select",
            "questionText": "Which of these are valid built-in data types in Python?",
            "options": ["list", "tuple", "array", "dict"],
            "correctAnswers": ["list", "tuple", "dict"],
            "explanation": "Array is not a built-in type in standard Python (lists are used instead, or arrays from the array/numpy modules).",
            "tags": ["data_types"]
        },
        
        # Python - Intermediate
        {
            "topic": "Python",
            "difficulty": "intermediate",
            "format": "code_snippet",
            "questionText": "What will be the output of this code?",
            "codeSnippet": "x = [1, 2, 3]\ny = x\ny.append(4)\nprint(x)",
            "options": ["[1, 2, 3]", "[1, 2, 3, 4]", "Error", "None"],
            "correctAnswers": ["[1, 2, 3, 4]"],
            "explanation": "Lists are mutable, and assigning y = x creates a reference to the same list. Modifying y also modifies x.",
            "tags": ["lists", "mutability"]
        },
        
        # React - Beginner
        {
            "topic": "React",
            "difficulty": "beginner",
            "format": "mcq",
            "questionText": "What hook is used to manage state in a functional component?",
            "options": ["useEffect", "useState", "useReducer", "useContext"],
            "correctAnswers": ["useState"],
            "explanation": "useState is the primary hook for adding React state to function components.",
            "tags": ["hooks", "basics"]
        },
        {
            "topic": "React",
            "difficulty": "intermediate",
            "format": "mcq",
            "questionText": "Why should you never mutate state directly in React?",
            "options": [
                "It causes an infinite loop",
                "React won't know the state changed and won't re-render",
                "It throws a syntax error",
                "It deletes the component"
            ],
            "correctAnswers": ["React won't know the state changed and won't re-render"],
            "explanation": "React relies on state immutability to detect changes via shallow comparison. Mutating state directly bypasses the setState trigger.",
            "tags": ["state", "rendering"]
        },
        {
            "topic": "React",
            "difficulty": "intermediate",
            "format": "multi_select",
            "questionText": "Which hooks can trigger a component re-render?",
            "options": ["useState", "useRef", "useReducer", "useContext"],
            "correctAnswers": ["useState", "useReducer", "useContext"],
            "explanation": "useRef does not trigger re-renders when its .current value changes.",
            "tags": ["hooks"]
        },
        
        # JavaScript - Beginner
        {
            "topic": "JavaScript",
            "difficulty": "beginner",
            "format": "mcq",
            "questionText": "Which keyword is used to declare a block-scoped variable that cannot be reassigned?",
            "options": ["var", "let", "const", "static"],
            "correctAnswers": ["const"],
            "explanation": "const declares a block-scoped variable that cannot be reassigned.",
            "tags": ["variables"]
        },
        {
            "topic": "JavaScript",
            "difficulty": "intermediate",
            "format": "code_snippet",
            "questionText": "What does this evaluate to?",
            "codeSnippet": "typeof null",
            "options": ["'null'", "'undefined'", "'object'", "'number'"],
            "correctAnswers": ["'object'"],
            "explanation": "In JavaScript, typeof null is notoriously evaluated to 'object' due to a historical bug in the language.",
            "tags": ["types", "quirks"]
        }
    ]
    
    # Check if we already seeded to avoid duplicates
    existing = db.questions.count_documents({})
    if existing > 0:
        logger.info(f"Question bank already has {existing} questions. Dropping collection and reseeding...")
        db.questions.delete_many({})
        
    result = db.questions.insert_many(questions)
    logger.info(f"Successfully seeded {len(result.inserted_ids)} questions! 🧠")

if __name__ == "__main__":
    seed_questions()
