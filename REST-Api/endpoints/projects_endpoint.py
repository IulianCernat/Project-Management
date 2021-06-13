from flask_restx import Resource
from flask import request
from utils.restx import api
from utils.serializers import project_input, message, bad_request, project_output, location, user_role_output
from controllers.projects_controller import *
from controllers.users_controller import get_user_id
from utils.firebase_auth import verify_id_token
from utils.parsers import authorization_header, projects_sorting_arguments
from utils.custom_exceptions import AuthorizationFailed

projects_namespace = api.namespace('projects', description='Operations related to projects')


@projects_namespace.route('/')
@api.response(400, 'Bad request', bad_request)
class ProjectsCollection(Resource):
    @api.response(201, 'Project successfully created', location)
    @api.response(404, "Foreign key check failure (product_owner_id doesn't exist)")
    @api.expect(project_input)
    def post(self):
        input_data = request.json
        project_id = add_project(input_data)
        return {"location": f"{api.base_url}{projects_namespace.path[1:]}/{project_id}"}, 201

    @api.response(200, 'Projects successfully queried', [project_output])
    @api.marshal_list_with(project_output)
    @api.expect(projects_sorting_arguments)
    def get(self):
        args = projects_sorting_arguments.parse_args(request)
        user_id = args.get('user_id', None)
        user_type = args.get('user_type', None)
        return get_projects(user_id, user_type)


@api.response(404, 'Project not found', message)
@projects_namespace.route('/<id>')
class ProjectItem(Resource):
    @api.response(200, 'Projects successfully queried', project_output)
    @api.marshal_with(project_output)
    def get(self, id):
        return get_project(id)

    @api.response(200, 'Projects successfully queried', message)
    def delete(self, id):
        delete_project(id)
        return {"message": "Project successfully deleted"}, 200


@api.response(404, 'Project not found', message)
@projects_namespace.route('/<id>/role')
class ProjectItemRole(Resource):
    @api.response(200, 'Projects successfully queried', user_role_output)
    @api.response(401, 'Authorization failed', message)
    @api.marshal_with(user_role_output)
    @api.expect(authorization_header)
    def get(self, id):
        try:
            token_id = request.headers.get('Authorization')
            decoded_token = verify_id_token(token_id)
        except AuthorizationFailed as e:
            raise e
        user_id = get_user_id(decoded_token['uid'])
        return get_project_role(user_id, id)