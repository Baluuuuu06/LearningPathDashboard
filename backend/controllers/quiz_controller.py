from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from utils.db import db

def get_quiz(skill_name):
    quiz = db.quizzes.find_one({"skill": skill_name}, {"_id": 0})
    if not quiz:
        return jsonify({"message": "Quiz not found"}), 404
    return jsonify(quiz), 200

@jwt_required()
def submit_quiz():
    user_id = get_jwt_identity()
    data = request.get_json()
    score = data.get('score', 0)
    skill = data.get('skill', '')
    
    db.progress.insert_one({
        "user_id": ObjectId(user_id),
        "skill": skill,
        "score": score,
        "type": "quiz"
    })
    
    badge_earned = 1 if score >= 80 else 0
    
    db.users.update_one(
        {"_id": ObjectId(user_id)},
        {
            "$inc": {"badges_earned": badge_earned},
            "$addToSet": {"skills": skill}
        }
    )
    
    from services.gamification_service import GamificationService
    base_xp = GamificationService.XP_REWARDS.get("quiz_completed", 20)
    scaled_xp = int((score / 100) * base_xp)
    
    result = GamificationService.log_activity(
        user_id=user_id,
        action_type="quiz_completed",
        metadata={"skill": skill, "score": score, "custom_xp": scaled_xp}
    )
    
    xp_earned = result["xp_earned"] if result else scaled_xp
    
    return jsonify({"message": "Quiz submitted successfully", "score": score, "xp_earned": xp_earned, "gamification": result}), 200
