from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.quiz_service import QuizService

def get_quiz(skill_name):
    # Generates a quiz dynamically pulling 5 random questions for the skill/topic
    quiz_data = QuizService.generate_quiz(skill_name, count=5)
    if not quiz_data or len(quiz_data["questions"]) == 0:
        return jsonify({"message": "No questions available for this topic"}), 404
    return jsonify(quiz_data), 200

@jwt_required()
def submit_quiz():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    skill = data.get('skill', '')
    submitted_answers = data.get('answers', [])
    
    if not skill or not submitted_answers:
        return jsonify({"message": "Skill and answers are required"}), 400
        
    result = QuizService.grade_quiz(user_id, skill, submitted_answers)
    
    return jsonify({
        "message": "Quiz submitted successfully",
        "result": result
    }), 200
