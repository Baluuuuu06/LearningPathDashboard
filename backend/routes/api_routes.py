from flask import Blueprint
from controllers.skills_controller import get_skills, get_roadmap, get_roadmap_progress, mark_module_completed
from controllers.projects_controller import get_projects
from controllers.quiz_controller import get_quiz, submit_quiz
from controllers.dashboard_controller import get_dashboard_stats
from controllers.analytics_controller import get_user_analytics
from controllers.leaderboard_controller import get_leaderboard, get_achievements
from controllers.chatbot_controller import ask_chatbot

api_bp = Blueprint('api_bp', __name__)

api_bp.route('/skills', methods=['GET'])(get_skills)
api_bp.route('/roadmap/<skill_name>', methods=['GET'])(get_roadmap)
api_bp.route('/progress/roadmap/<skill_name>', methods=['GET'])(get_roadmap_progress)
api_bp.route('/progress/roadmap', methods=['POST'])(mark_module_completed)
api_bp.route('/projects', methods=['GET'])(get_projects)
api_bp.route('/projects/<skill_name>', methods=['GET'])(get_projects)
api_bp.route('/quiz/<skill_name>', methods=['GET'])(get_quiz)
api_bp.route('/quiz/submit', methods=['POST'])(submit_quiz)
api_bp.route('/dashboard', methods=['GET'])(get_dashboard_stats)
api_bp.route('/analytics', methods=['GET'])(get_user_analytics)
api_bp.route('/leaderboard', methods=['GET'])(get_leaderboard)
api_bp.route('/achievements', methods=['GET'])(get_achievements)
api_bp.route('/chatbot/ask', methods=['POST'])(ask_chatbot)
