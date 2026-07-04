from flask import jsonify
from utils.db import db
from bson.objectid import ObjectId
from flask_jwt_extended import jwt_required, get_jwt_identity

@jwt_required()
def get_leaderboard():
    # Fetch top 50 users by XP
    users = list(db.users.find(
        {"xp": {"$gt": 0}},
        {"name": 1, "xp": 1, "level": 1, "current_streak": 1, "role": 1}
    ).sort("xp", -1).limit(50))
    
    leaderboard = []
    for idx, u in enumerate(users):
        leaderboard.append({
            "rank": idx + 1,
            "id": str(u["_id"]),
            "name": u.get("name", "Unknown Learner"),
            "xp": u.get("xp", 0),
            "level": u.get("level", 1),
            "streak": u.get("current_streak", 0),
            "role": u.get("role", "student")
        })
        
    return jsonify({"leaderboard": leaderboard}), 200

@jwt_required()
def get_achievements():
    user_id = get_jwt_identity()
    user = db.users.find_one({"_id": ObjectId(user_id)})
    
    if not user:
        return jsonify({"message": "User not found"}), 404
        
    # Standard achievements checking based on current user stats
    achievements = []
    
    # 1. Streaks
    streak = user.get("longest_streak", 0)
    achievements.append({
        "id": "streak_3",
        "title": "3-Day Streak",
        "description": "Maintain a learning streak for 3 days.",
        "icon": "🔥",
        "unlocked": streak >= 3
    })
    achievements.append({
        "id": "streak_7",
        "title": "7-Day Streak",
        "description": "Maintain a learning streak for a full week.",
        "icon": "🔥",
        "unlocked": streak >= 7
    })
    achievements.append({
        "id": "streak_30",
        "title": "Monthly Dedication",
        "description": "Maintain a learning streak for 30 days.",
        "icon": "🏆",
        "unlocked": streak >= 30
    })
    
    # 2. Leveling
    level = user.get("level", 1)
    achievements.append({
        "id": "level_5",
        "title": "Rising Star",
        "description": "Reach Level 5.",
        "icon": "⭐",
        "unlocked": level >= 5
    })
    achievements.append({
        "id": "level_10",
        "title": "Dedicated Scholar",
        "description": "Reach Level 10.",
        "icon": "🎓",
        "unlocked": level >= 10
    })
    
    # 3. Quizzes
    quiz_count = db.quiz_attempts.count_documents({"user_id": ObjectId(user_id)})
    achievements.append({
        "id": "quiz_1",
        "title": "First Step",
        "description": "Complete your first quiz.",
        "icon": "📝",
        "unlocked": quiz_count >= 1
    })
    achievements.append({
        "id": "quiz_10",
        "title": "Quiz Master",
        "description": "Complete 10 quizzes.",
        "icon": "🧠",
        "unlocked": quiz_count >= 10
    })
    
    # Sort achievements: unlocked first
    achievements.sort(key=lambda x: not x["unlocked"])
    
    return jsonify({"achievements": achievements}), 200
