import math
from datetime import datetime, timedelta
from bson.objectid import ObjectId
from utils.db import db
from loguru import logger

class GamificationService:
    
    XP_REWARDS = {
        "lesson_completed": 10,
        "quiz_completed": 20,
        "module_completed": 50,
        "challenge_completed": 100,
        "project_completed": 150
    }

    @staticmethod
    def calculate_level(xp):
        """
        Calculate level based on XP.
        Formula: level = floor(sqrt(xp / 100)) + 1
        L1: 0 XP
        L2: 100 XP
        L3: 400 XP
        L4: 900 XP
        """
        if xp < 0:
            xp = 0
        return math.floor(math.sqrt(xp / 100)) + 1

    @staticmethod
    def get_xp_for_next_level(level):
        """
        Calculate XP required to reach the NEXT level.
        """
        return (level ** 2) * 100

    @staticmethod
    def get_xp_for_current_level(level):
        """
        Calculate base XP for the current level.
        """
        return ((level - 1) ** 2) * 100

    @staticmethod
    def process_login(user_id):
        """
        Process user login. 
        Updates last_login and processes streak freezes if days were missed.
        Does NOT increment streak.
        """
        user = db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return

        today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
        
        # Initialize default values if missing
        updates = {}
        if "xp" not in user: updates["xp"] = 0
        if "level" not in user: updates["level"] = 1
        if "current_streak" not in user: updates["current_streak"] = 0
        if "longest_streak" not in user: updates["longest_streak"] = 0
        if "streak_freezes" not in user: updates["streak_freezes"] = 2
        
        current_streak = user.get("current_streak", 0)
        streak_freezes = user.get("streak_freezes", 2)
        last_activity = user.get("last_activity_date")

        # Process Streak Freezes
        if last_activity and current_streak > 0:
            last_activity_day = last_activity.replace(hour=0, minute=0, second=0, microsecond=0)
            days_missed = (today - last_activity_day).days - 1
            
            if days_missed > 0:
                # User missed at least one day
                if days_missed <= streak_freezes:
                    # Has enough freezes to cover the missed days
                    streak_freezes -= days_missed
                    updates["streak_freezes"] = streak_freezes
                    logger.info(f"User {user_id} used {days_missed} streak freeze(s). Remaining: {streak_freezes}")
                else:
                    # Streak broken
                    updates["current_streak"] = 0
                    logger.info(f"User {user_id} broke their streak.")

        updates["last_login"] = datetime.utcnow()
        if len(updates) > 0:
            db.users.update_one({"_id": ObjectId(user_id)}, {"$set": updates})

    @staticmethod
    def log_activity(user_id, action_type, metadata=None):
        """
        Log a meaningful activity, award XP, and increment streak.
        """
        if metadata is None:
            metadata = {}

        now = datetime.utcnow()
        today = now.replace(hour=0, minute=0, second=0, microsecond=0)

        # 1. Store the activity history
        activity = {
            "user_id": ObjectId(user_id),
            "action_type": action_type,
            "date": now,
            "metadata": metadata
        }
        
        # Add XP if applicable
        xp_earned = GamificationService.XP_REWARDS.get(action_type, 0)
        if "custom_xp" in metadata:
            xp_earned = metadata["custom_xp"]
            
        activity["xp_earned"] = xp_earned
        db.activity_history.insert_one(activity)

        # 2. Update User stats
        user = db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return None

        current_xp = user.get("xp", 0) + xp_earned
        new_level = GamificationService.calculate_level(current_xp)
        
        updates = {
            "xp": current_xp,
            "level": new_level,
            "last_activity_date": now
        }

        # Check if we should increment the streak
        last_activity = user.get("last_activity_date")
        current_streak = user.get("current_streak", 0)
        longest_streak = user.get("longest_streak", 0)
        
        should_increment_streak = False

        if not last_activity:
            should_increment_streak = True
        else:
            last_activity_day = last_activity.replace(hour=0, minute=0, second=0, microsecond=0)
            if last_activity_day < today:
                should_increment_streak = True

        if should_increment_streak:
            current_streak += 1
            updates["current_streak"] = current_streak
            if current_streak > longest_streak:
                updates["longest_streak"] = current_streak

        db.users.update_one({"_id": ObjectId(user_id)}, {"$set": updates})

        return {
            "xp_earned": xp_earned,
            "total_xp": current_xp,
            "level": new_level,
            "leveled_up": new_level > user.get("level", 1),
            "streak_incremented": should_increment_streak,
            "current_streak": current_streak
        }
