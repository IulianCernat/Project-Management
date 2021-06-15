import os
import json
# Flask settings
# FLASK_SERVER_NAME = 'localhost:3000'
FLASK_DEBUG = True # Do not use debug mode in production

# Flask-Restplus settings
RESTX_SWAGGER_UI_DOC_EXPANSION = 'list'
RESTX_VALIDATE = True
RESTX_MASK_SWAGGER = False
RESTX_ERROR_404_HELP = False

# SQLAlchemy settings
# For development
SQLALCHEMY_DATABASE_URI = os.environ.get('projectsManagerDevDbURI')

# For production
# SQLALCHEMY_DATABASE_URI = os.environ.get('projectsManagerProductionDbUri')

SQLALCHEMY_TRACK_MODIFICATIONS = True


# Firebase
firebase_google_credentials = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')