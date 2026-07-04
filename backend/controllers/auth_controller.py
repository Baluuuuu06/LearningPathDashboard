from flask import request, jsonify
from services.auth_service import AuthService
from flask_jwt_extended import jwt_required, get_jwt_identity

def register():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password') or not data.get('name'):
        return jsonify({"message": "Missing required fields"}), 400

    success, msg, result = AuthService.register_user(
        data.get('name'), 
        data.get('email'), 
        data.get('password'), 
        data.get('role', 'student')
    )
    
    if success:
        return jsonify({"message": msg, **result}), 201
    return jsonify({"message": msg}), 400

def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Missing email or password"}), 400

    success, msg, result = AuthService.login_user(data.get('email'), data.get('password'))
    if success:
        return jsonify({"message": msg, **result}), 200
    return jsonify({"message": msg}), 401

def google_login():
    data = request.get_json()
    token = data.get('token')
    
    if not token:
        return jsonify({"message": "Google token is required"}), 400
        
    success, msg, result = AuthService.google_login(token)
    if success:
        return jsonify({"message": msg, **result}), 200
    return jsonify({"message": msg}), 401

@jwt_required(refresh=True)
def refresh_token():
    identity = get_jwt_identity()
    success, msg, result = AuthService.refresh_token(identity)
    if success:
        return jsonify({"message": msg, **result}), 200
    return jsonify({"message": msg}), 401

@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    success, msg = AuthService.update_profile(user_id, data)
    if success:
        return jsonify({"message": msg}), 200
    return jsonify({"message": msg}), 400
