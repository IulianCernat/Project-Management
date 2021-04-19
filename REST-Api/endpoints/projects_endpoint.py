from flask_restx import Resource
from flask import request
from utils.restx import api
from utils.serializers import project_input, message, bad_request, project_output, location
from controllers.projects_controller import add_project, get_project
from utils.firebase_auth import verify_id_token
from utils.parsers import authorization_header
from utils.custom_exceptions import AuthorizationFailed

projects_namespace = api.namespace('projects', description='Operations related to projects')


@projects_namespace.route('/')
class ProjectsCollection(Resource):
    @api.response(201, 'Project successfully created', location)
    @api.response(400, 'Bad request', bad_request)
    @api.response(401, 'Authorization failed', message)
    @api.expect(project_input)
    def post(self):
        input_data = request.json
        project_id = add_project(input_data)
        return {"location": f"{api.base_url}{projects_namespace.path[1:]}/{project_id}"}, 201


@api.response(404, 'User not found', message)
@projects_namespace.route('/<id>')
class ProjectItem(Resource):
    @api.response(200, 'Projects successfully queried')
    @api.marshal_with(project_output)
    def get(self, id):
        return get_project(id)
