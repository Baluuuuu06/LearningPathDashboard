import os
import sys
from pymongo import ASCENDING, DESCENDING, IndexModel
from loguru import logger

# Add parent directory to path to import config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from utils.db import client

db = client['lpd_db']

def init_db():
    logger.info("Initializing database optimizations...")

    # 1. User Collection Schema Validation & Indexes
    user_schema = {
        "$jsonSchema": {
            "bsonType": "object",
            "required": ["email", "created_at"],
            "properties": {
                "name": {"bsonType": "string", "description": "must be a string"},
                "email": {
                    "bsonType": "string",
                    "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
                    "description": "must be a valid email address and is required"
                },
                "password": {"bsonType": "string", "description": "must be a string (hashed)"},
                "role": {"enum": ["student", "admin", "recruiter"], "description": "can only be one of the enum values"},
                "created_at": {"bsonType": "date", "description": "must be a date and is required"},
                "updated_at": {"bsonType": "date", "description": "must be a date"},
                "deleted_at": {"bsonType": ["date", "null"], "description": "must be a date or null for soft delete"},
                "xp": {"bsonType": "int", "description": "must be an integer"},
                "level": {"bsonType": "int", "description": "must be an integer"},
                "current_streak": {"bsonType": "int", "description": "must be an integer"},
                "longest_streak": {"bsonType": "int", "description": "must be an integer"},
                "streak_freezes": {"bsonType": "int", "description": "must be an integer"},
                "last_activity_date": {"bsonType": ["date", "null"], "description": "must be a date or null"},
                "last_login": {"bsonType": ["date", "null"], "description": "must be a date or null"}
            }
        }
    }

    try:
        # Create users collection with validation if it doesn't exist
        db.create_collection("users", validator=user_schema)
        logger.info("Created 'users' collection with schema validation.")
    except Exception as e:
        # Update existing collection validation
        if "already exists" in str(e):
            try:
                db.command("collMod", "users", validator=user_schema)
                logger.info("Updated 'users' collection schema validation.")
            except Exception as inner_e:
                logger.warning(f"Skipping schema validation update (insufficient Atlas permissions): {inner_e}")
        else:
            logger.error(f"Error creating/updating users collection: {e}")

    # Create Indexes for Users
    user_indexes = [
        IndexModel([("email", ASCENDING)], unique=True, name="email_unique_idx"),
        IndexModel([("deleted_at", ASCENDING)], name="soft_delete_idx")
    ]
    db.users.create_indexes(user_indexes)
    logger.info("Created indexes for 'users'.")

    # 2. Roadmaps Collection Indexes
    roadmap_indexes = [
        IndexModel([("user_id", ASCENDING), ("created_at", DESCENDING)], name="user_roadmaps_idx"),
        IndexModel([("skill", ASCENDING)], name="skill_lookup_idx")
    ]
    # Ensure collection exists before indexing
    if "roadmaps" not in db.list_collection_names():
        db.create_collection("roadmaps")
    db.roadmaps.create_indexes(roadmap_indexes)
    logger.info("Created indexes for 'roadmaps'.")

    # 3. OTP & Tokens Collection (TTL Indexes)
    if "tokens" not in db.list_collection_names():
        db.create_collection("tokens")
    token_indexes = [
        IndexModel([("token", ASCENDING)], unique=True, name="token_unique_idx"),
        IndexModel([("user_id", ASCENDING)], name="user_tokens_idx"),
        IndexModel([("expires_at", ASCENDING)], expireAfterSeconds=0, name="token_ttl_idx")
    ]
    db.tokens.create_indexes(token_indexes)
    logger.info("Created TTL indexes for 'tokens'.")
    
    # 4. Remove OTPs Collection (Cleanup)
    if "otps" in db.list_collection_names():
        db.drop_collection("otps")
        logger.info("Dropped legacy 'otps' collection.")

    # 5. Activity History Collection Indexes
    if "activity_history" not in db.list_collection_names():
        db.create_collection("activity_history")
    activity_indexes = [
        IndexModel([("user_id", ASCENDING), ("date", DESCENDING)], name="user_activity_idx")
    ]
    db.activity_history.create_indexes(activity_indexes)
    logger.info("Created indexes for 'activity_history'.")

    logger.info("Database optimization complete! 🎉")

if __name__ == "__main__":
    init_db()
