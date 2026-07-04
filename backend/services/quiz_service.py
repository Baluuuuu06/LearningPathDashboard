from bson.objectid import ObjectId
from datetime import datetime
from loguru import logger
import random
from utils.db import db
from services.gamification_service import GamificationService

class QuizService:
    @staticmethod
    def generate_quiz(topic, count=5):
        """
        Generate a dynamic quiz by pulling random questions for a topic.
        Does not return the correct answers to the client.
        """
        pipeline = [
            {"$match": {"topic": {"$regex": f"^{topic}$", "$options": "i"}}},
            {"$sample": {"size": count}}
        ]
        
        questions = list(db.questions.aggregate(pipeline))
        
        # Format for client (strip answers)
        client_questions = []
        for q in questions:
            client_questions.append({
                "id": str(q["_id"]),
                "format": q.get("format", "mcq"),
                "questionText": q.get("questionText", ""),
                "options": q.get("options", []),
                "codeSnippet": q.get("codeSnippet", ""),
                "tags": q.get("tags", [])
            })
            
        return {
            "topic": topic,
            "questions": client_questions
        }

    @staticmethod
    def grade_quiz(user_id, topic, submitted_answers):
        """
        Grades the quiz, calculates score, determines weak topics,
        records the attempt, and triggers gamification.
        
        submitted_answers: list of objects:
        [
            {"question_id": "...", "selected_options": ["..."]},
            ...
        ]
        """
        correct_count = 0
        total_questions = len(submitted_answers)
        
        weak_tags = {}
        strong_tags = {}
        
        detailed_results = []

        for item in submitted_answers:
            q_id = item.get("question_id")
            selected = item.get("selected_options", [])
            
            if not q_id:
                continue
                
            q = db.questions.find_one({"_id": ObjectId(q_id)})
            if not q:
                continue
                
            correct_answers = q.get("correctAnswers", [])
            
            # Check if arrays match perfectly
            is_correct = sorted(selected) == sorted(correct_answers)
            
            detailed_results.append({
                "question_id": q_id,
                "questionText": q.get("questionText"),
                "is_correct": is_correct,
                "selected": selected,
                "correct_answers": correct_answers,
                "explanation": q.get("explanation", "")
            })
            
            tags = q.get("tags", [])
            if is_correct:
                correct_count += 1
                for tag in tags:
                    strong_tags[tag] = strong_tags.get(tag, 0) + 1
            else:
                for tag in tags:
                    weak_tags[tag] = weak_tags.get(tag, 0) + 1

        score_percentage = (correct_count / total_questions) * 100 if total_questions > 0 else 0
        
        # Sort weak/strong tags by count
        weak_topics = sorted(weak_tags, key=weak_tags.get, reverse=True)[:3]
        strong_topics = sorted(strong_tags, key=strong_tags.get, reverse=True)[:3]
        
        # Save Attempt
        attempt = {
            "user_id": ObjectId(user_id),
            "topic": topic,
            "score_percentage": score_percentage,
            "correct_count": correct_count,
            "total_questions": total_questions,
            "weak_topics": weak_topics,
            "strong_topics": strong_topics,
            "date": datetime.utcnow()
        }
        db.quiz_attempts.insert_one(attempt)
        
        # Update user progress
        badge_earned = 1 if score_percentage >= 80 else 0
        db.users.update_one(
            {"_id": ObjectId(user_id)},
            {
                "$inc": {"badges_earned": badge_earned},
                "$addToSet": {"skills": topic}
            }
        )
        
        # Gamification
        base_xp = GamificationService.XP_REWARDS.get("quiz_completed", 20)
        scaled_xp = int((score_percentage / 100) * base_xp)
        
        gamification = GamificationService.log_activity(
            user_id=user_id,
            action_type="quiz_completed",
            metadata={"skill": topic, "score": score_percentage, "custom_xp": scaled_xp}
        )
        
        if gamification:
            gamification["xp_earned"] = scaled_xp
            
        return {
            "score_percentage": score_percentage,
            "correct_count": correct_count,
            "total_questions": total_questions,
            "weak_topics": weak_topics,
            "strong_topics": strong_topics,
            "detailed_results": detailed_results,
            "gamification": gamification
        }
