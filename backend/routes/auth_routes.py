from flask import Blueprint
from controllers.auth_controller import (
    register, login, update_profile, google_login, refresh_token
)

auth_bp = Blueprint('auth_bp', __name__)

auth_bp.route('/register', methods=['POST'])(register)
auth_bp.route('/login', methods=['POST'])(login)
auth_bp.route('/google-login', methods=['POST'])(google_login)
auth_bp.route('/refresh', methods=['POST'])(refresh_token)
auth_bp.route('/profile', methods=['PUT'])(update_profile)
