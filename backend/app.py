from flask import Flask
from flask_cors import CORS
from config import Config
from utils.extensions import bcrypt, jwt
from utils.db import db
from middleware.error_handler import init_error_handlers
from middleware.security import init_security
from loguru import logger
import sys

# Configure Loguru Audit Logging
logger.remove()
logger.add(sys.stdout, format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>")
logger.add("logs/app.log", rotation="10 MB", retention="10 days", level="INFO")

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions & middleware
CORS(app, resources={r"/api/*": {"origins": "*"}})
bcrypt.init_app(app)
jwt.init_app(app)
init_security(app)
init_error_handlers(app)

# Register Blueprints
from routes.auth_routes import auth_bp
from routes.api_routes import api_bp
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(api_bp, url_prefix='/api')

@app.route('/')
def home():
    return {"message": "Learning Path Dashboard API is running."}

if __name__ == '__main__':
    app.run(debug=True, port=app.config.get('PORT', 5000))

