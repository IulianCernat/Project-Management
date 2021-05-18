from flask_restx import Resource, cors
from flask import request
from utils.restx import api
from utils.serializers import team_member_input, message, bad_request, team_member_output, location, developers_input
from controllers.teams_members_controller import *
from utils.parsers import teams_members_filtering_args

teams_members_namespace = api.namespace('teams_members', description='Operations related to managing teams_members')


@teams_members_namespace.route('/')
class TeamsMembersCollection(Resource):
    @api.response(201, 'Team successfully created', location)
    @api.response(400, 'Bad request', bad_request)
    @api.response(404, "Foreign key check failure", message)
    @api.expect(team_member_input)
    def post(self):
        input_data = request.json
        team_member_id = add_team_member(input_data)
        return {"location": f"{api.base_url}{teams_members_namespace.path[1:]}/{team_member_id}"}, 201

    @api.response(200, 'teams_members successfully queried', [team_member_output])
    @api.response(400, 'Bad request', bad_request)
    @api.marshal_list_with(team_member_output)
    @api.expect(teams_members_filtering_args)
    def get(self):
        args = teams_members_filtering_args.parse_args(request)
        team_id = args.get('team_id', None)

        return get_team_members(team_id)


@teams_members_namespace.route('/developers')
class DevelopersCollection(Resource):
    @api.response(201, 'Developers successfully added to team', [location])
    @api.response(400, 'Bad request', bad_request)
    @api.response(404, "Foreign key check failure", message)
    @api.expect(developers_input)
    def post(self):
        input_data = request.json
        developers_ids = add_developers(input_data)
        locations = [{"location": f"{api.base_url}{teams_members_namespace.path[1:]}/{developer_id}"} for developer_id
                     in developers_ids]
        return locations, 201


@api.response(404, 'team not found', message)
@teams_members_namespace.route('/<id>')
class TeamItem(Resource):
    @api.response(200, 'teams_members successfully queried', team_member_output)
    @api.marshal_with(team_member_output)
    def get(self, id):
        return get_team_member(id)
