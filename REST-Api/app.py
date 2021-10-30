import logging.config
from flask import Flask, Blueprint
import settings
from utils.restx import api
from database import db
from endpoints.users_endpoint import users_namespace
from endpoints.projects_endpoint import projects_namespace
from endpoints.teams_endpoint import teams_namespace
from endpoints.teams_members_endpoint import teams_members_namespace
from endpoints.issues_endpoint import issues_namespace
from endpoints.sprints_endpoint import sprints_namespace
from endpoints.trello_callback_endpoint import trello_callback_namespace
from endpoints.trello_endpoint import trello_namespace
from flask_socketio import SocketIO
from flask_socketio import send, emit
from flask_cors import CORS


class FlaskApp(Flask):
    def __init__(self, import_name):
        super().__init__(import_name)
        self.config['SQLALCHEMY_DATABASE_URI'] = settings.SQLALCHEMY_DATABASE_URI
        self.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = settings.SQLALCHEMY_TRACK_MODIFICATIONS
        self.config['SWAGGER_UI_DOC_EXPANSION'] = settings.RESTX_SWAGGER_UI_DOC_EXPANSION
        self.config['RESTX_VALIDATE'] = settings.RESTX_VALIDATE
        self.config['RESTX_MASK_SWAGGER'] = settings.RESTX_MASK_SWAGGER
        self.config['ERROR_404_HELP'] = settings.RESTX_ERROR_404_HELP

        blueprint = Blueprint('api', __name__, url_prefix='/api')
        api.init_app(blueprint)

        api.add_namespace(users_namespace)
        api.add_namespace(projects_namespace)
        api.add_namespace(teams_namespace)
        api.add_namespace(teams_members_namespace)
        api.add_namespace(issues_namespace)
        api.add_namespace(sprints_namespace)
        api.add_namespace(trello_callback_namespace)
        api.add_namespace(trello_namespace)

        self.register_blueprint(blueprint)

        db.init_app(self)
        self.app_context().push()

        # with self.app_context():
        #     db.create_all()  # Create database tables for our data models

        CORS(self)



app = FlaskApp(__name__)
socketio = SocketIO(app)

@socketio.on('connect')
def handle_message(message):
    send("hello guy!")

if __name__ == "__main__":
    socketio.run(app, debug=settings.FLASK_DEBUG)