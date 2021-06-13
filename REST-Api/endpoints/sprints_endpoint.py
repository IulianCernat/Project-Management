from flask_restx import Resource
from flask import request
from utils.restx import api
from utils.serializers import sprint_input, message, bad_request, sprint_output, sprint_update_input, location
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
        minimal_info = args.get('minimal_info', False)
        if minimal_info:
            return get_sprints_with_minimal_info(project_id), 200

        return get_sprints(project_id), 200


@api.response(404, 'Sprint not found', message)
@sprints_namespace.route('/<id>')
class SprintItem(Resource):
    @api.response(200, 'Sprints successfully queried', sprint_output)
    @api.marshal_with(sprint_output)
    def get(self, id):
        return get_sprint(id), 200

    @api.response(200, 'Sprint successfully queried', [sprint_output])
    @api.response(404, 'Sprint was not found', message)
    def delete(self, id):
        delete_sprint(id)
        return {"message": "Sprint successfully deleted"}, 200

    @api.response(200, 'Sprint successfully updated', message)
    @api.response(400, 'Bad request', bad_request)
    @api.response(404, 'Sprint was not found')
    @api.expect(sprint_update_input)
    def patch(self, id):
        input_data = request.json
        update_sprint(id, input_data)
        return {'message': f"Sprint with id {id} successfully updated"}, 200