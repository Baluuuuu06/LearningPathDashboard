import traceback
from flask import jsonify
from loguru import logger
from werkzeug.exceptions import HTTPException

def init_error_handlers(app):
    @app.errorhandler(Exception)
    def handle_exception(e):
        # Pass through HTTP errors
        if isinstance(e, HTTPException):
            logger.warning(f"HTTP Exception: {e.code} - {e.description}")
            return jsonify({
                "error": True,
                "message": e.description,
                "code": e.code
            }), e.code

        # Log unexpected errors with traceback
        logger.error(f"Unhandled Exception: {str(e)}\n{traceback.format_exc()}")
        
        return jsonify({
            "error": True,
            "message": "An internal server error occurred.",
            "code": 500
        }), 500
