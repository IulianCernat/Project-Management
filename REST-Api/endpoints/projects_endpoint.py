from flask_restx import Resource
from flask import request
from utils.restx import api
from utils.serializers import project_input, message, bad_request, project_output, location, user_role_output
from controllers.projects_controller import *
from controllers.users_controller import get_user_id
from utils.firebase_auth import verify_id_token
from utils.parsers import authorization_header, projects_sorting_arguments
from utils.custom_exceptions import AuthorizationFailed
from utils.authorization import process_firebase_authorization_field, process_trello_authorization_field
projects_namespace = api.namespace('projects', description='Operations related to projects')


@projects_namespace.route('/')
@api.response(400, 'Bad request', bad_request)
class ProjectsCollection(Resource):
    @api.response(201, 'Project successfully created', project_output)
    @api.response(404, "Foreign key check failure (product_owner_id doesn't exist)")
    @api.marshal_with(project_output)
    @api.expect(project_input, authorization_header)
    def post(self):
        process_firebase_authorization_field(request)
        input_data = request.json
        new_project = add_project(input_data)
        return new_project, 201

    @api.response(200, 'Projects successfully queried', [project_output])
    @api.marshal_list_with(project_output)
    @api.expect(projects_sorting_arguments, authorization_header)
    def get(self):

        process_firebase_authorization_field(request)
        args = projects_sorting_arguments.parse_args(request)
        user_id = args.get('user_id', None)
        user_type = args.get('user_type', None)
        return get_projects(user_id, user_type)


@api.response(404, 'Project not found', message)
@projects_namespace.route('/<id>')
class ProjectItem(Resource):
    @api.response(200, 'Projects successfully queried', project_output)
    @api.marshal_with(project_output)
    @api.expect(authorization_header)
    def get(self, id):
        process_firebase_authorization_field(request)
        return get_project(id)

    @api.response(200, 'Projects successfully queried', message)
    @api.expect(authorization_header)
    def delete(self, id):
        process_firebase_authorization_field(request)
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
        process_firebase_authorization_field(request)
        decoded_token = process_firebase_authorization_field(request)
        user_id = get_user_id(decoded_token['uid'])
        return get_project_role(user_id, id)
