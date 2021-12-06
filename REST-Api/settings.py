import os
import logging
from dotenv import load_dotenv
import sys

# Load environment variables from .env file
# without overwriting existing ones
load_dotenv()

log = logging.getLogger(__name__)

RUN_FLASK_IN_PRODUCTION = os.environ.get('IS_FLASK_IN_PRODUCTION')

firebase_claims_values = {
    "admin": "admin",
    "teacher": "teacher",
    "student": "student"
}
# Flask settings
# FLASK_SERVER_NAME = 'localhost:3000'
if RUN_FLASK_IN_PRODUCTION is None:
    FLASK_DEBUG = True  # Do not use debug mode in production
else:
    FLASK_DEBUG = False

# Flask-Restx settings
RESTX_SWAGGER_UI_DOC_EXPANSION = 'list'
RESTX_VALIDATE = True
RESTX_MASK_SWAGGER = False
RESTX_ERROR_404_HELP = False

# SQLAlchemy settings
# For development
try:
    SQLALCHEMY_DATABASE_URI = "mariadb+pymysql://"\
        f"{os.environ['DB_USER']}:" \
        f"{os.environ['DB_PASS']}@" \
        f"{os.environ['DB_HOST']}:" \
        f"{os.environ['DB_PORT']}/" \
        f"{os.environ['DB_NAME']}"
except KeyError:
    try:
        SQLALCHEMY_DATABASE_URI = os.environ['PROJECTS_MANAGER_DEV_DB_URI']
    except KeyError:
        log.error("Couldn't find any environment variables for connecting to a database")
        sys.exit(1)

# For production
# SQLALCHEMY_DATABASE_URI = os.environ.get('projectsManagerProductionDbUri')

SQLALCHEMY_TRACK_MODIFICATIONS = True

# Firebase
try:
    firebase_google_credentials = os.environ['GOOGLE_APPLICATION_CREDENTIALS']
except KeyError:
    log.error("Missing GOOGLE_APPLICATION_CREDENTIALS environment variable")
    sys.exit(1)

# Trello
try:
    TRELLO_API_KEY = os.environ['TRELLO_API_KEY']
except KeyError:
    log.error("Missing TRELLO_API_KEY environment variable")
    sys.exit(1)

try:
    TRELLO_API_URL = os.environ["TRELLO_API_URL"]
except KeyError:
    log.error("Missing TRELLO_API_URL environment variable")
    sys.exit(1)

# Share localhost api over network for testing purposes
# Subdomain name resides in tunneling/runJprq.py file
try:
    TUNNELED_API_ADDRESS = os.environ['TUNNELED_API_ADDRESS']
except KeyError:
    log.error("Missing TUNNELED_API_ADDRESS environment variable")
    sys.exit(1)

# Real time updates delivering service
try:
    REALTIME_UPDATES_SERVICE_URL = os.environ['REALTIME_UPDATES_SERVICE_URL']

except KeyError:
    log.error("Missing REALTIME_UPDATES_SERVICE_URL environment variable ")
    sys.exit(1)

try:
    FIREBASE_APP_ADMIN_EMAIL = os.environ['FIREBASE_APP_ADMIN_EMAIL']
except KeyError:
    log.error("Missing FIREBASE_APP_ADMIN_EMAIL environment variable")
    sys.exit(1)

try:
    FIREBASE_WEB_API_KEY = os.environ['FIREBASE_WEB_API_KEY']
except KeyError:
    log.error("Missing FIREBSAE_WEB_API_KEY environment variable")
    sys.exit(1)
