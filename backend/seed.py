from utils.db import db

def seed_data():
    db.skills.delete_many({})
    db.roadmaps.delete_many({})
    
    skills = [
        {
            "name": "Frontend Development",
            "description": "Learn HTML, CSS, JavaScript, and React to build amazing user interfaces.",
            "difficulty": "Beginner",
            "duration": "3 Months",
            "image": "https://cdn-icons-png.flaticon.com/512/1005/1005141.png"
        },
        {
            "name": "Python",
            "description": "Master Python programming for web, data science, and AI.",
            "difficulty": "Beginner",
            "duration": "2 Months",
            "image": "https://cdn-icons-png.flaticon.com/512/5968/5968350.png"
        },
        {
            "name": "Java",
            "description": "Learn Object-Oriented Programming and build robust enterprise apps.",
            "difficulty": "Intermediate",
            "duration": "4 Months",
            "image": "https://cdn-icons-png.flaticon.com/512/226/226777.png"
        },
        {
            "name": "Data Science",
            "description": "Analyze data, build models, and extract insights using modern tools.",
            "difficulty": "Advanced",
            "duration": "6 Months",
            "image": "https://cdn-icons-png.flaticon.com/512/1925/1925100.png"
        },
        {
            "name": "Cyber Security",
            "description": "Protect systems and networks from digital attacks and vulnerabilities.",
            "difficulty": "Advanced",
            "duration": "5 Months",
            "image": "https://cdn-icons-png.flaticon.com/512/2716/2716612.png"
        },
        {
            "name": "UI/UX Design",
            "description": "Learn design principles, wireframing, and create beautiful user experiences.",
            "difficulty": "Beginner",
            "duration": "2 Months",
            "image": "https://cdn-icons-png.flaticon.com/512/1975/1975666.png"
        },
        {
            "name": "Backend Development",
            "description": "Build scalable APIs and server-side logic using Node.js and Express.",
            "difficulty": "Intermediate",
            "duration": "3 Months",
            "image": "https://cdn-icons-png.flaticon.com/512/2163/2163155.png"
        },
        {
            "name": "DevOps",
            "description": "Learn CI/CD, Docker, Kubernetes, and cloud deployment pipelines.",
            "difficulty": "Advanced",
            "duration": "4 Months",
            "image": "https://cdn-icons-png.flaticon.com/512/2115/2115935.png"
        }
    ]
    
    db.skills.insert_many(skills)
    
    roadmaps = [
        {
            "skill": "Frontend Development",
            "modules": [
                {
                    "title": "HTML & CSS",
                    "description": "Learn the basics of web structure and styling.",
                    "estimated_time": "2 Weeks",
                    "resources": ["https://developer.mozilla.org/en-US/docs/Web/HTML"],
                    "project": "Personal Portfolio Website"
                },
                {
                    "title": "JavaScript Basics",
                    "description": "Learn variables, loops, functions, and DOM manipulation.",
                    "estimated_time": "3 Weeks",
                    "resources": ["https://javascript.info/"],
                    "project": "Weather App"
                },
                {
                    "title": "React.js",
                    "description": "Learn component-based UI development.",
                    "estimated_time": "4 Weeks",
                    "resources": ["https://react.dev/"],
                    "project": "E-Commerce App"
                }
            ]
        },
        {
            "skill": "Python",
            "modules": [
                {
                    "title": "Python Basics",
                    "description": "Variables, loops, functions, and data structures.",
                    "estimated_time": "2 Weeks",
                    "resources": ["https://docs.python.org/3/tutorial/"],
                    "project": "CLI Calculator"
                },
                {
                    "title": "Object Oriented Python",
                    "description": "Classes, inheritance, and polymorphism.",
                    "estimated_time": "2 Weeks",
                    "resources": ["https://realpython.com/python3-object-oriented-programming/"],
                    "project": "Library Management System"
                },
                {
                    "title": "Web Scraping & APIs",
                    "description": "Learn requests and BeautifulSoup.",
                    "estimated_time": "3 Weeks",
                    "resources": ["https://realpython.com/beautiful-soup-web-scraper-python/"],
                    "project": "Automated Web Scraper"
                }
            ]
        },
        {
            "skill": "Java",
            "modules": [
                {
                    "title": "Java Fundamentals",
                    "description": "Syntax, data types, and control flow.",
                    "estimated_time": "2 Weeks",
                    "resources": ["https://docs.oracle.com/javase/tutorial/"],
                    "project": "Console Banking App"
                },
                {
                    "title": "Advanced OOP",
                    "description": "Interfaces, Abstract classes, and Packages.",
                    "estimated_time": "3 Weeks",
                    "resources": ["https://www.geeksforgeeks.org/object-oriented-programming-oops-concept-in-java/"],
                    "project": "Employee Management System"
                }
            ]
        },
        {
            "skill": "Data Science",
            "modules": [
                {
                    "title": "Data Manipulation",
                    "description": "Learn Numpy and Pandas for data handling.",
                    "estimated_time": "3 Weeks",
                    "resources": ["https://pandas.pydata.org/docs/"],
                    "project": "Data Cleaning Pipeline"
                },
                {
                    "title": "Machine Learning Basics",
                    "description": "Scikit-Learn, regression, and classification.",
                    "estimated_time": "4 Weeks",
                    "resources": ["https://scikit-learn.org/stable/"],
                    "project": "House Price Prediction Model"
                }
            ]
        },
        {
            "skill": "Cyber Security",
            "modules": [
                {
                    "title": "Networking Fundamentals",
                    "description": "OSI model, TCP/IP, and basic protocols.",
                    "estimated_time": "2 Weeks",
                    "resources": ["https://www.cisco.com/c/en/us/solutions/enterprise-networks/index.html"],
                    "project": "Network Packet Analyzer"
                },
                {
                    "title": "Ethical Hacking",
                    "description": "Vulnerability assessment and penetration testing.",
                    "estimated_time": "4 Weeks",
                    "resources": ["https://www.hackerone.com/"],
                    "project": "Web App Vulnerability Scanner"
                }
            ]
        },
        {
            "skill": "UI/UX Design",
            "modules": [
                {
                    "title": "Design Principles",
                    "description": "Color theory, typography, and spacing.",
                    "estimated_time": "2 Weeks",
                    "resources": ["https://lawsofux.com/"],
                    "project": "Brand Style Guide"
                },
                {
                    "title": "Figma Prototyping",
                    "description": "Learn components, auto-layout, and interactive prototypes.",
                    "estimated_time": "3 Weeks",
                    "resources": ["https://www.figma.com/resources/learn-design/"],
                    "project": "Mobile App Prototype"
                }
            ]
        },
        {
            "skill": "Backend Development",
            "modules": [
                {
                    "title": "Node.js Basics",
                    "description": "Event loop, file system, and native modules.",
                    "estimated_time": "2 Weeks",
                    "resources": ["https://nodejs.org/en/docs/"],
                    "project": "CLI File Manager"
                },
                {
                    "title": "Express & REST APIs",
                    "description": "Routing, middleware, and API design.",
                    "estimated_time": "3 Weeks",
                    "resources": ["https://expressjs.com/"],
                    "project": "Task API Server"
                },
                {
                    "title": "Database Integration",
                    "description": "Connecting to MongoDB using Mongoose.",
                    "estimated_time": "2 Weeks",
                    "resources": ["https://mongoosejs.com/"],
                    "project": "Full-stack Blog Engine"
                }
            ]
        },
        {
            "skill": "DevOps",
            "modules": [
                {
                    "title": "Linux & Git",
                    "description": "Command line proficiency and version control.",
                    "estimated_time": "2 Weeks",
                    "resources": ["https://git-scm.com/doc"],
                    "project": "Automated Backup Script"
                },
                {
                    "title": "Containerization",
                    "description": "Docker images, containers, and Docker Compose.",
                    "estimated_time": "3 Weeks",
                    "resources": ["https://docs.docker.com/"],
                    "project": "Dockerized Web App"
                }
            ]
        }
    ]
    
    db.roadmaps.insert_many(roadmaps)
    
    db.projects.delete_many({})
    db.quizzes.delete_many({})
    
    projects = [
        {
            "skill": "Frontend Development",
            "title": "Personal Portfolio Website",
            "description": "Build a responsive portfolio using HTML, CSS, and JS to showcase your skills.",
            "difficulty": "Beginner",
            "technologies": ["HTML", "CSS", "JavaScript"],
            "github_reference": "https://github.com/example/portfolio"
        },
        {
            "skill": "Frontend Development",
            "title": "Real-time Weather Dashboard",
            "description": "Create a weather app that fetches live data from a public API, with dark mode and dynamic icons.",
            "difficulty": "Intermediate",
            "technologies": ["React", "Tailwind CSS", "Axios"],
            "github_reference": "https://github.com/example/weather-app"
        },
        {
            "skill": "Frontend Development",
            "title": "E-Commerce Storefront",
            "description": "Build a fully functional e-commerce frontend with a shopping cart, product filtering, and payment integration mockup.",
            "difficulty": "Advanced",
            "technologies": ["React", "Redux", "Stripe"],
            "github_reference": "https://github.com/example/ecommerce"
        },
        {
            "skill": "Python",
            "title": "Automated Web Scraper",
            "description": "Develop a script to extract data from e-commerce sites and save it to a CSV format.",
            "difficulty": "Intermediate",
            "technologies": ["Python", "BeautifulSoup", "Pandas"],
            "github_reference": "https://github.com/example/scraper"
        },
        {
            "skill": "Data Science",
            "title": "House Price Prediction Model",
            "description": "Train a machine learning model to predict house prices using historical data.",
            "difficulty": "Intermediate",
            "technologies": ["Python", "Scikit-Learn", "Jupyter"],
            "github_reference": "https://github.com/example/house-prices"
        },
        {
            "skill": "Backend Development",
            "title": "Task Manager API",
            "description": "Build a complete REST API with JWT authentication and MongoDB storage.",
            "difficulty": "Intermediate",
            "technologies": ["Node.js", "Express", "MongoDB", "JWT"],
            "github_reference": "https://github.com/example/task-api"
        }
    ]
    db.projects.insert_many(projects)
    
    quizzes = [
        {
            "skill": "Frontend Development",
            "questions": [
                {
                    "questionText": "What does HTML stand for?",
                    "options": ["Hyper Text Markup Language", "High Text Markup Language", "Hyper Tabular Markup Language", "None of these"],
                    "correctAnswer": 0,
                    "explanation": "HTML stands for Hyper Text Markup Language."
                },
                {
                    "questionText": "Which property is used to change the background color in CSS?",
                    "options": ["color", "bgcolor", "background-color", "background"],
                    "correctAnswer": 2,
                    "explanation": "background-color sets the background color of an element."
                }
            ]
        },
        {
            "skill": "Python",
            "questions": [
                {
                    "questionText": "How do you create a list in Python?",
                    "options": ["[]", "{}", "()", "//"],
                    "correctAnswer": 0,
                    "explanation": "Lists are created using square brackets []."
                },
                {
                    "questionText": "What keyword is used to define a function in Python?",
                    "options": ["func", "def", "function", "lambda"],
                    "correctAnswer": 1,
                    "explanation": "The 'def' keyword is used to define functions."
                }
            ]
        },
        {
            "skill": "Java",
            "questions": [
                {
                    "questionText": "Which concept allows a class to inherit properties from another class?",
                    "options": ["Polymorphism", "Encapsulation", "Inheritance", "Abstraction"],
                    "correctAnswer": 2,
                    "explanation": "Inheritance is the mechanism in Java by which one class is allowed to inherit the features of another class."
                }
            ]
        },
        {
            "skill": "Data Science",
            "questions": [
                {
                    "questionText": "Which Python library is best for Data Manipulation?",
                    "options": ["Flask", "Django", "Pandas", "Pygame"],
                    "correctAnswer": 2,
                    "explanation": "Pandas is the premier library for data manipulation and analysis in Python."
                }
            ]
        },
        {
            "skill": "Cyber Security",
            "questions": [
                {
                    "questionText": "What does SQL Injection primarily target?",
                    "options": ["Operating System", "Network Switch", "Database", "Browser Cache"],
                    "correctAnswer": 2,
                    "explanation": "SQL Injection targets the database tier of an application."
                }
            ]
        },
        {
            "skill": "UI/UX Design",
            "questions": [
                {
                    "questionText": "What does UX stand for?",
                    "options": ["User Extension", "User Experience", "User Execution", "Unique X"],
                    "correctAnswer": 1,
                    "explanation": "UX stands for User Experience."
                }
            ]
        },
        {
            "skill": "Backend Development",
            "questions": [
                {
                    "questionText": "What does REST stand for?",
                    "options": ["Representational State Transfer", "Responsive State Transfer", "Real State Transfer", "Routing Error System Test"],
                    "correctAnswer": 0,
                    "explanation": "REST stands for Representational State Transfer."
                }
            ]
        },
        {
            "skill": "DevOps",
            "questions": [
                {
                    "questionText": "Which of these is a containerization tool?",
                    "options": ["Jenkins", "Docker", "Git", "Ansible"],
                    "correctAnswer": 1,
                    "explanation": "Docker is the industry standard for creating and managing containers."
                }
            ]
        }
    ]
    db.quizzes.insert_many(quizzes)

    print("Database seeded successfully with all roadmaps and quizzes!")

if __name__ == "__main__":
    seed_data()
