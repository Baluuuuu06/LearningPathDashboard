from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from utils.db import db
from datetime import datetime, timedelta

@jwt_required()
def get_dashboard_stats():
    user_id = get_jwt_identity()
    user = db.users.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        return jsonify({"message": "User not found"}), 404
        
    skills_started = len(user.get('skills', []))
    from services.gamification_service import GamificationService
    
    xp = user.get('xp', 0)
    level = user.get('level', 1)
    
    # Calculate XP Progress for the UI progress bar
    base_xp = GamificationService.get_xp_for_current_level(level)
    next_xp = GamificationService.get_xp_for_next_level(level)
    xp_progress = {
        "current": xp - base_xp,
        "required": next_xp - base_xp,
        "total_xp": xp,
        "next_level_total": next_xp
    }
    
    badges = user.get('badges_earned', 0)
    
    all_progress = list(db.progress.find({"user_id": ObjectId(user_id), "type": "roadmap"}))
    skills_completed = 0
    learning_hours = 0
    
    skill_labels = []
    skill_data = []
    
    for prog in all_progress:
        skill_name = prog.get("skill")
        completed_indices = prog.get("completed_modules", [])
        
        if len(completed_indices) > 0:
            skill_labels.append(skill_name)
            skill_data.append(len(completed_indices))
            
        roadmap = db.roadmaps.find_one({"skill": skill_name})
        if roadmap:
            total_modules = len(roadmap.get("modules", []))
            if len(completed_indices) >= total_modules and total_modules > 0:
                skills_completed += 1
    
    # Calculate learning hours from activity_history
    all_activities = list(db.activity_history.find({"user_id": ObjectId(user_id)}).sort("date", -1))
    for act in all_activities:
        meta = act.get("metadata", {})
        learning_hours += meta.get("hours", 0)
        
    # Fallback to quiz estimates if no hours explicitly logged yet
    quizzes_taken = db.progress.count_documents({"user_id": ObjectId(user_id), "type": "quiz"})
    if learning_hours == 0 and quizzes_taken > 0:
        learning_hours = quizzes_taken * 2
    
    if not skill_labels:
        skill_labels = ["Get Started!"]
        skill_data = [100]
    
    stats = {
        "skills_started": skills_started,
        "skills_completed": skills_completed,
        "current_streak": user.get('current_streak', 0),
        "longest_streak": user.get('longest_streak', 0),
        "streak_freezes": user.get('streak_freezes', 2),
        "learning_hours": learning_hours,
        "xp_points": xp,
        "level": level,
        "xp_progress": xp_progress,
        "badges_earned": badges,
        "quizzes_taken": quizzes_taken
    }
    
    # Calculate Weekly Progress from activity_history
    today = datetime.utcnow()
    weekly_labels = []
    weekly_data = []
    
    for i in range(6, -1, -1):
        day = today - timedelta(days=i)
        weekly_labels.append(day.strftime("%a"))
        
        start_of_day = day.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = start_of_day + timedelta(days=1)
        
        day_activities = [a for a in all_activities if start_of_day <= a["date"] < end_of_day]
        # Summarize actions or XP per day (let's use actions count or xp earned)
        xp_today = sum(a.get("xp_earned", 0) for a in day_activities)
        weekly_data.append(xp_today)
        
    charts = {
        "weekly_progress": {
            "labels": weekly_labels,
            "data": weekly_data
        },
        "skill_completion": {
            "labels": skill_labels,
            "data": skill_data
        }
    }
    
    recent_activity = [
        {
            "action": a.get("action_type"),
            "xp": a.get("xp_earned", 0),
            "date": a.get("date").isoformat(),
            "metadata": a.get("metadata", {})
        }
        for a in all_activities[:5]
    ]
    
    return jsonify({"stats": stats, "charts": charts, "recent_activity": recent_activity}), 200
