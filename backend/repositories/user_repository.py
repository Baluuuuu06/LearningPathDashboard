from utils.db import db
from bson.objectid import ObjectId

class UserRepository:
    @staticmethod
    def find_by_email(email):
        return db.users.find_one({"email": email})

    @staticmethod
    def find_by_id(user_id):
        return db.users.find_one({"_id": ObjectId(user_id)})

    @staticmethod
    def create_user(user_data):
        return db.users.insert_one(user_data)

    @staticmethod
    def update_user(user_id, update_data):
        return db.users.update_one({"_id": ObjectId(user_id)}, {"$set": update_data})
