from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId
from datetime import datetime, timedelta
from utils.db import db
from collections import Counter

@jwt_required()
def get_user_analytics():
    user_id = get_jwt_identity()
    oid = ObjectId(user_id)
    
    # 1. Fetch recent activity history (last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    activities = list(db.activity_history.find({
        "user_id": oid,
        "date": {"$gte": thirty_days_ago}
    }).sort("date", -1))
    
    # Process activities to count per day
    activity_by_day = {}
    for act in activities:
        day_str = act["date"].strftime("%Y-%m-%d")
        activity_by_day[day_str] = activity_by_day.get(day_str, 0) + 1
        
    # 2. Fetch quiz attempts for weak/strong topics
    quiz_attempts = list(db.quiz_attempts.find({
        "user_id": oid
    }).sort("date", -1).limit(20)) # Look at last 20 attempts
    
    weak_counter = Counter()
    strong_counter = Counter()
    
    for attempt in quiz_attempts:
        for t in attempt.get("weak_topics", []):
            weak_counter[t] += 1
        for t in attempt.get("strong_topics", []):
            strong_counter[t] += 1
            
    # Resolve overlaps (if a topic is in both, net them out or just return raw)
    top_weak = [topic for topic, _ in weak_counter.most_common(5)]
    top_strong = [topic for topic, _ in strong_counter.most_common(5)]
    
    # Filter out weak topics that are also in strong if strong count is much higher
    filtered_weak = [t for t in top_weak if weak_counter[t] > strong_counter[t]]
    if not filtered_weak:
        filtered_weak = top_weak # Fallback
        
    # 3. Generate Recommendations
    recommendations = []
    if filtered_weak:
        for topic in filtered_weak[:2]:
            recommendations.append({
                "type": "quiz",
                "title": f"Review {topic}",
                "description": f"You struggled with {topic} recently. Take a practice quiz to reinforce your knowledge.",
                "action_url": f"/quiz/{topic}",
                "tag": topic
            })
    else:
        # Default recommendations if no weak topics
        recommendations.append({
            "type": "roadmap",
            "title": "Start a new skill",
            "description": "You're doing great! Why not explore a new roadmap?",
            "action_url": "/roadmaps",
            "tag": "Explore"
        })
        
    return jsonify({
        "activity_by_day": activity_by_day,
        "weak_topics": filtered_weak[:5],
        "strong_topics": top_strong[:5],
        "recommendations": recommendations
    }), 200
