from flask import Flask
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
application = Flask(__name__)
limiter = Limiter(get_remote_address, app=application, default_limits=["200 per day", "50 per hour"])

@application.route("/")
def default():
    return "default limit!"
@application.route("/five")
@limiter.limit("5 per minute")
def five():
    return "5 per minute!"

@application.route("/exempt")
@limiter.exempt
def exempt():
    return "No limits!"


if __name__ == "__main__":
    application.run(port=5000, debug=True)