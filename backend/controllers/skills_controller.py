from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from utils.db import db

def get_skills():
    # Fetch all skills from the database
    skills = list(db.skills.find({}, {"_id": 0}))
    return jsonify(skills), 200

def get_roadmap(skill_name):
    # Fetch the roadmap for a specific skill
    roadmap = db.roadmaps.find_one({"skill": skill_name}, {"_id": 0})
    if not roadmap:
        return jsonify({"message": "Roadmap not found"}), 404
    return jsonify(roadmap), 200

@jwt_required()
def get_roadmap_progress(skill_name):
    user_id = get_jwt_identity()
    progress = db.progress.find_one({
        "user_id": ObjectId(user_id),
        "skill": skill_name,
        "type": "roadmap"
    })
    
    completed = progress.get('completed_modules', []) if progress else []
    return jsonify({"completed_modules": completed}), 200

@jwt_required()
def mark_module_completed():
    user_id = get_jwt_identity()
    data = request.get_json()
    skill_name = data.get('skill')
    module_index = data.get('module_index')
    
    db.progress.update_one(
        {"user_id": ObjectId(user_id), "skill": skill_name, "type": "roadmap"},
        {"$addToSet": {"completed_modules": module_index}},
        upsert=True
    )
    
    # Also mark the skill as started for the user
    db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$addToSet": {"skills": skill_name}}
    )
    
    # Calculate hours to log
    hours_to_log = 10 # Default
    roadmap = db.roadmaps.find_one({"skill": skill_name})
    if roadmap and "modules" in roadmap and module_index < len(roadmap["modules"]):
        time_str = roadmap["modules"][module_index].get("estimated_time", "1 Week")
        try:
            weeks = int(time_str.split()[0])
            hours_to_log = weeks * 10
        except:
            pass
            
    # Log activity for weekly progress and gamification
    from services.gamification_service import GamificationService
    
    result = GamificationService.log_activity(
        user_id=user_id,
        action_type="module_completed",
        metadata={
            "skill": skill_name,
            "module_index": module_index,
            "hours": hours_to_log
        }
    )
    
    return jsonify({"message": "Module marked as completed", "gamification": result}), 200
