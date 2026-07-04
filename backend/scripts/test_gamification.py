import os
import sys
from datetime import datetime, timedelta
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.gamification_service import GamificationService
from utils.db import db
from repositories.user_repository import UserRepository

def run_tests():
    print("Running Gamification Tests...")
    
    # 1. Create a test user
    email = "gamertest@example.com"
    existing = UserRepository.find_by_email(email)
    if existing:
        db.users.delete_one({"_id": existing["_id"]})
    
    UserRepository.create_user({
        "name": "Gamer Test",
        "email": email,
        "password": "hashed",
        "xp": 0,
        "level": 1,
        "current_streak": 0,
        "longest_streak": 0,
        "streak_freezes": 2,
        "last_activity_date": None,
        "last_login": None,
        "role": "student"
    })
    
    user = UserRepository.find_by_email(email)
    user_id = str(user["_id"])
    
    # Test 1: process_login does NOT increment streak
    GamificationService.process_login(user_id)
    user_after_login = UserRepository.find_by_id(user_id)
    assert user_after_login["current_streak"] == 0, "Login should not increment streak"
    assert user_after_login["last_login"] is not None, "Last login should be updated"
    
    # Test 2: log_activity INCREMENTS streak and adds XP
    res = GamificationService.log_activity(user_id, "lesson_completed", {})
    assert res["xp_earned"] == 10
    assert res["total_xp"] == 10
    assert res["streak_incremented"] == True
    
    user_after_activity = UserRepository.find_by_id(user_id)
    assert user_after_activity["current_streak"] == 1, "Activity should increment streak"
    
    # Test 3: Log another activity on same day does NOT increment streak again
    res2 = GamificationService.log_activity(user_id, "quiz_completed", {})
    assert res2["xp_earned"] == 20
    assert res2["total_xp"] == 30
    assert res2["streak_incremented"] == False
    
    user_after_act2 = UserRepository.find_by_id(user_id)
    assert user_after_act2["current_streak"] == 1, "Second activity on same day should not increment streak"
    
    # Test 4: Simulate missing a day and using a freeze
    # Move last_activity_date to 2 days ago
    two_days_ago = datetime.utcnow() - timedelta(days=2)
    db.users.update_one({"_id": user_after_act2["_id"]}, {"$set": {"last_activity_date": two_days_ago}})
    
    GamificationService.process_login(user_id)
    user_after_freeze = UserRepository.find_by_id(user_id)
    
    assert user_after_freeze["streak_freezes"] == 1, "Should have used 1 streak freeze"
    assert user_after_freeze["current_streak"] == 1, "Streak should be preserved"
    
    # Test 5: Level up calculation
    res3 = GamificationService.log_activity(user_id, "project_completed", {"custom_xp": 150})
    assert res3["level"] == 2, "Should level up to 2"
    assert res3["leveled_up"] == True, "Leveled up flag should be true"
    
    print("All gamification tests passed successfully! 🎉")

if __name__ == "__main__":
    run_tests()
