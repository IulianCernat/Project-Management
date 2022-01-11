from flask_restx import Resource
from flask import request
from utils.restx import api
from utils.serializers import sprint_input, message, bad_request, sprint_output, sprint_update_input, location
from utils.parsers import sprints_filtering_args
from controllers.sprints_controller import *
from utils.parsers import authorization_header
from utils.authorization import process_firebase_authorization_field

sprints_namespace = api.namespace('sprints', description='Operations related to sprints')


@sprints_namespace.route('/')
@api.response(400, 'Bad request', bad_request)
class SprintsCollection(Resource):
    @api.response(201, 'Sprint successfully created', sprint_output)
    @api.response(404, "Foreign key check failure (one of the issue id from issues_ids"
                       "or user_creator_id or project_id doesn't exist)")
    @api.expect(sprint_input, authorization_header)
    @api.marshal_with(sprint_output)
    def post(self):
        process_firebase_authorization_field(request)
        input_data = request.json
        new_sprint = add_sprint(input_data)
        return new_sprint,  201

    @api.response(200, 'Sprints successfully queried', [sprint_output])
    @api.marshal_list_with(sprint_output)
    @api.expect(sprints_filtering_args, authorization_header)
    def get(self):
        process_firebase_authorization_field(request)
        args = sprints_filtering_args.parse_args(request)
        project_id = args.get('project_id', None)
        minimal_info = args.get('minimal_info', False)
        if minimal_info:
            return get_sprints_with_minimal_info(project_id), 200

        return get_sprints(project_id), 200


@api.response(404, 'Sprint not found', message)
@api.response(400, 'Bad request', bad_request)
@sprints_namespace.route('/<id>')
class SprintItem(Resource):
    @api.response(200, 'Sprints successfully queried', sprint_output)
    @api.marshal_with(sprint_output)
    @api.expect(authorization_header)
    def get(self, id):
        process_firebase_authorization_field(request)
        return get_sprint(id), 200

    @api.response(200, 'Sprint successfully queried', [sprint_output])
    @api.expect(authorization_header)
    def delete(self, id):
        process_firebase_authorization_field(request)
        delete_sprint(id)
        return {"message": "Sprint successfully deleted"}, 200

    @api.response(200, 'Sprint successfully updated', sprint_output)
    @api.expect(sprint_update_input, authorization_header)
    @api.marshal_with(sprint_output)
    def patch(self, id):
        process_firebase_authorization_field(request)
        input_data = request.json
        updated_sprint = update_sprint(id, input_data)
        return updated_sprint, 200
