import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/lpd_db")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "fallback_secret_key")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    PORT = int(os.getenv("PORT", 5000))

