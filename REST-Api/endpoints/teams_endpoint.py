from flask_restx import Resource
from flask import request
from utils.restx import api
from utils.serializers import team_input, message, bad_request, team_output, location
from controllers.teams_controller import *
from utils.parsers import team_filtering_args
from flask_cors import cross_origin

teams_namespace = api.namespace('teams', description='Operations related to managing teams',
                                decorators=[cross_origin()])


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

    @api.response(200,
                  'Teams successfully queried, the team_members field '
                  'contains first the scrum master then the developers',
                  [team_output])
    @api.response(400, 'Bad request', bad_request)
    @api.marshal_list_with(team_output)
    @api.expect(team_filtering_args)
    def get(self):
        args = team_filtering_args.parse_args(request)
        project_id = args.get('project_id', None)
        return get_teams(project_id)


@api.response(404, 'team not found', message)
@teams_namespace.route('/<id>')
class TeamItem(Resource):
    @api.response(200, 'teams successfully queried', team_output)
    @api.marshal_with(team_output)
    def get(self, id):
        return get_team(id)
