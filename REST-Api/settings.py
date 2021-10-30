import os
import logging

log = logging.getLogger(__name__)

# Flask settings
# FLASK_SERVER_NAME = 'localhost:3000'
FLASK_DEBUG = True  # Do not use debug mode in production

# Flask-Restx settings
RESTX_SWAGGER_UI_DOC_EXPANSION = 'list'
RESTX_VALIDATE = True
RESTX_MASK_SWAGGER = False
RESTX_ERROR_404_HELP = False

# SQLAlchemy settings
# For development
try:
    SQLALCHEMY_DATABASE_URI = os.environ['projectsManagerDevDbURI']
except KeyError:
    try:
        SQLALCHEMY_DATABASE_URI = f"mariadb+pymysql://{os.environ['DB_USER']}:" \
                                  f"{os.environ['DB_PASS']}@" \
                                  f"{os.environ['DB_HOST']}:" \
                                  f"{os.environ['DB_PORT']}/" \
                                  f"{os.environ['DB_NAME']}"
    except KeyError:
        log.error("Couldn't find any environment\
                variables for connecting to a database")

# For production
# SQLALCHEMY_DATABASE_URI = os.environ.get('projectsManagerProductionDbUri')

SQLALCHEMY_TRACK_MODIFICATIONS = True

# Firebase
try:
    firebase_google_credentials = os.environ.get(
        'GOOGLE_APPLICATION_CREDENTIALS')
except KeyError:
    log.error("Missing GOOGLE_APPLICATION_CREDENTIALS environment variable")

# Trello
try:
    TRELLO_API_KEY = os.environ.get('TRELLO_API_KEY')
except KeyError:
    log.error("Missing TRELLO_API_KEY environment variable")

TRELLO_API_URL = "https://api.trello.com/1"