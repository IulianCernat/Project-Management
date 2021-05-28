from flask_restx import Resource
from flask import request
from utils.restx import api
from utils.serializers import sprint_input, message, bad_request, sprint_output, location
from utils.parsers import sprints_filtering_args
from controllers.sprints_controller import *


sprints_namespace = api.namespace('sprints', description='Operations related to sprints')


@sprints_namespace.route('/')
@api.response(400, 'Bad request', bad_request)
@api.response(404, "Project id or User id don't exist", message)
class SprintsCollection(Resource):
    @api.response(201, 'Sprint successfully created', location)
    @api.expect(sprint_input)
    def post(self):
        input_data = request.json
        sprint_id = add_sprint(input_data)
        return {"location": f"{api.base_url}{sprints_namespace.path[1:]}/{sprint_id}"}, 201

    @api.response(200, 'Sprints successfully queried', [sprint_output])
    @api.marshal_list_with(sprint_output)
    @api.expect(sprints_filtering_args)
    def get(self):
        args = sprints_filtering_args.parse_args(request)
        project_id = args.get('project_id', None)
        return get_sprints(project_id), 200