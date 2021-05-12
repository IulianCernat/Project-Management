from flask_restx import Resource
from flask import request
from utils.restx import api
from utils.serializers import team_input, message, bad_request, team_output, location
from controllers.teams_controller import *

teams_namespace = api.namespace('teams', description='Operations related to managing teams')


@teams_namespace.route('/')
class TeamsCollection(Resource):

    @api.response(201, 'Team successfully created', location)
    @api.response(400, 'Bad request', bad_request)
    @api.response(404, "Project doesn't exists", message)
    @api.expect(team_input)
    def post(self):
        input_data = request.json
        team_id = add_team(input_data)
        return {"location": f"{api.base_url}{teams_namespace.path[1:]}/{team_id}"}, 201

    # @api.response(200, 'teams successfully queried')
    # @api.response(400, 'Bad request', bad_request)
    # @api.marshal_list_with(team_output)
    # def get(self):
    #     user_id = args.get('user_id', None)
    #     user_type = args.get('user_type', None)
    #     return get_teams(user_id, user_type)


@api.response(404, 'team not found', message)
@teams_namespace.route('/<id>')
class TeamItem(Resource):
    @api.response(200, 'teams successfully queried', team_output)
    @api.marshal_with(team_output)
    def get(self, id):
        return get_team(id)
