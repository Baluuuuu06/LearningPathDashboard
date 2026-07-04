from flask_talisman import Talisman
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="memory://"
)

def init_security(app):
    # Initialize Talisman (Helmet equivalent)
    # Allow local development over HTTP for now but enforce HTTPS in production later
    # Note: Using content_security_policy=None here strictly so that frontend can hit APIs without strict CSP blocking it in dev
    Talisman(app, content_security_policy=None, force_https=False)
    
    # Initialize Limiter
    limiter.init_app(app)
