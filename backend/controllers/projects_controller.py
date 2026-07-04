from flask import jsonify
from utils.db import db

def get_projects(skill_name=None):
    query = {}
    if skill_name:
        query['skill'] = skill_name
    projects = list(db.projects.find(query, {"_id": 0}))
    return jsonify(projects), 200
