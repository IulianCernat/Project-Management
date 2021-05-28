import logging.config

import os
from flask import Flask, Blueprint, make_response
import settings
from utils.restx import api
from database import db
from endpoints.users_endpoint import users_namespace
from endpoints.projects_endpoint import projects_namespace
from endpoints.teams_endpoint import teams_namespace
from endpoints.teams_members_endpoint import teams_members_namespace
from endpoints.issues_endpoint import issues_namespace
from endpoints.sprints_endpoint import sprints_namespace
from utils.cors import *
from flask_cors import CORS

app = Flask(__name__)
# logging_conf_path = os.path.normpath(os.path.join(os.path.dirname(__file__), 'logging.conf'))
# logging.config.fileConfig(logging_conf_path)
log = logging.getLogger(__name__)


def configure_app(flask_app):
    # flask_app.config['SERVER_NAME'] = settings.FLASK_SERVER_NAME
    flask_app.config['SQLALCHEMY_DATABASE_URI'] = settings.SQLALCHEMY_DATABASE_URI
    flask_app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = settings.SQLALCHEMY_TRACK_MODIFICATIONS
    flask_app.config['SWAGGER_UI_DOC_EXPANSION'] = settings.RESTX_SWAGGER_UI_DOC_EXPANSION
    flask_app.config['RESTX_VALIDATE'] = settings.RESTX_VALIDATE
    flask_app.config['RESTX_MASK_SWAGGER'] = settings.RESTX_MASK_SWAGGER
    flask_app.config['ERROR_404_HELP'] = settings.RESTX_ERROR_404_HELP

    # flask_app.config['PROPAGATE_EXCEPTIONS'] = True
    # CORS(app, resources={r'/*': {'origins': '*'}})


def initialize_app(flask_app):
    flask_app.secret_key = settings.FLASK_SECRET
    configure_app(flask_app)

    blueprint = Blueprint('api', __name__, url_prefix='/api')
    api.init_app(blueprint)
    api.add_namespace(users_namespace)
    api.add_namespace(projects_namespace)
    api.add_namespace(teams_namespace)
    api.add_namespace(teams_members_namespace)
    api.add_namespace(issues_namespace)
    api.add_namespace(sprints_namespace)
    flask_app.register_blueprint(blueprint)

    db.init_app(flask_app)
    flask_app.app_context().push()

    with flask_app.app_context():
        db.create_all()  # Create database tables for our data models

    CORS(flask_app)


def main():
    initialize_app(app)
    log.info('>>>>> Starting development server at http://{}/api/ <<<<<'.format(app.config['SERVER_NAME']))
    app.run(host='0.0.0.0', debug=settings.FLASK_DEBUG)


if __name__ == "__main__":
    main()