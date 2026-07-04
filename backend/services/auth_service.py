import datetime
from loguru import logger
from repositories.user_repository import UserRepository
from utils.extensions import bcrypt
from flask_jwt_extended import create_access_token, create_refresh_token
from google.oauth2 import id_token
from google.auth.transport import requests
import os

GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", "")

class AuthService:
    @staticmethod
    def register_user(name, email, password, role="student"):
        logger.info(f"Attempting to register user: {email}")
        
        if UserRepository.find_by_email(email):
            logger.warning(f"Registration blocked for {email}: User already exists")
            return False, "User already exists", None
            
        hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8') if password else ""
        new_user = {
            "name": name,
            "email": email,
            "password": hashed_pw,
            "role": role,
            "skills": [],
            "completed_modules": [],
            "xp": 0,
            "level": 1,
            "current_streak": 0,
            "longest_streak": 0,
            "streak_freezes": 2,
            "last_activity_date": None,
            "last_login": None,
            "bio": "",
            "location": "",
            "occupation": "",
            "github": "",
            "portfolio": "",
            "created_at": datetime.datetime.utcnow(),
            "auth_provider": "local"
        }
        
        result = UserRepository.create_user(new_user)
        logger.info(f"User {email} registered successfully with ID {result.inserted_id}")
        
        # Auto login after registration
        user = UserRepository.find_by_email(email)
        return AuthService._generate_auth_tokens(user)

    @staticmethod
    def login_user(email, password):
        logger.info(f"Password login attempt for {email}")
        user = UserRepository.find_by_email(email)
        if not user or not user.get('password') or not bcrypt.check_password_hash(user['password'], password):
            logger.warning(f"Password login failed for {email}: Invalid credentials")
            return False, "Invalid credentials", None
            
        logger.info(f"Password login successful for {email}")
        return AuthService._generate_auth_tokens(user)

    @staticmethod
    def google_login(token):
        logger.info("Google login attempt started")
        try:
            import requests as req
            # Check if it's an id_token or access_token
            if len(token.split('.')) == 3:
                idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
                email = idinfo.get('email')
                name = idinfo.get('name', '')
                picture = idinfo.get('picture', '')
            else:
                response = req.get('https://www.googleapis.com/oauth2/v3/userinfo', headers={'Authorization': f'Bearer {token}'})
                if not response.ok:
                    logger.warning("Google login failed: Invalid access token")
                    return False, "Invalid Google access token", None
                idinfo = response.json()
                email = idinfo.get('email')
                name = idinfo.get('name', '')
                picture = idinfo.get('picture', '')

            if not email:
                logger.warning("Google login failed: No email provided by Google")
                return False, "Google account does not have an email attached.", None
            
            user = UserRepository.find_by_email(email)
            if not user:
                logger.info(f"Creating new user from Google Login for {email}")
                new_user = {
                    "name": name,
                    "email": email,
                    "password": "",
                    "role": "student",
                    "skills": [],
                    "completed_modules": [],
                    "xp": 0,
                    "level": 1,
                    "current_streak": 0,
                    "longest_streak": 0,
                    "streak_freezes": 2,
                    "last_activity_date": None,
                    "last_login": None,
                    "bio": "",
                    "location": "",
                    "occupation": "",
                    "github": "",
                    "portfolio": "",
                    "profile_picture": picture,
                    "created_at": datetime.datetime.utcnow(),
                    "auth_provider": "google"
                }
                UserRepository.create_user(new_user)
                user = UserRepository.find_by_email(email)
                
            logger.info(f"Google login successful for {email}")
            return AuthService._generate_auth_tokens(user)
        except Exception as e:
            logger.error(f"Google login exception: {str(e)}")
            return False, f"Google login failed: {str(e)}", None

    @staticmethod
    def refresh_token(identity):
        logger.info(f"Refresh token requested for user ID {identity}")
        user = UserRepository.find_by_id(identity)
        if not user:
            logger.warning(f"Refresh token failed: User ID {identity} not found")
            return False, "User not found", None
            
        access_token = create_access_token(identity=identity, additional_claims={"role": user.get('role', 'student')})
        logger.info(f"Token refreshed successfully for user ID {identity}")
        return True, "Token refreshed", {"access_token": access_token}

    @staticmethod
    def update_profile(user_id, data):
        update_fields = {}
        for field in ['name', 'email', 'profile_picture', 'bio', 'location', 'occupation', 'github', 'portfolio']:
            if field in data:
                update_fields[field] = data[field]
                
        if data.get('newPassword'):
            if not data.get('currentPassword'):
                return False, "Current password is required to set a new password."
            user = UserRepository.find_by_id(user_id)
            if not user.get('password') or not bcrypt.check_password_hash(user['password'], data.get('currentPassword')):
                return False, "Incorrect current password."
                
            update_fields['password'] = bcrypt.generate_password_hash(data.get('newPassword')).decode('utf-8')
            
        if update_fields:
            UserRepository.update_user(user_id, update_fields)
        return True, "Profile updated successfully."

    @staticmethod
    def _generate_auth_tokens(user):
        user_id = str(user['_id'])
        
        # Process login for Gamification (Streak freezes, last_login)
        from services.gamification_service import GamificationService
        GamificationService.process_login(user_id)
        
        role = user.get('role', 'student')
        
        access_token = create_access_token(identity=user_id, additional_claims={"role": role})
        refresh_token = create_refresh_token(identity=user_id)
        
        logger.debug(f"Generated JWT tokens for {user.get('email')}")
        
        return True, "Login successful", {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {
                "id": user_id,
                "name": user.get('name', ''),
                "email": user.get('email', ''),
                "role": role,
                "profile_picture": user.get('profile_picture', '')
            }
        }
