from flask_restx import Resource, cors

from flask import request
from utils.restx import api
from utils.serializers import message, bad_request, team_member_output, location, multiple_team_members_input, \
    team_member_update_input
from controllers.teams_members_controller import *
from utils.parsers import teams_members_filtering_args

teams_members_namespace = api.namespace('teams_members', description='Operations related to managing teams_members')


@teams_members_namespace.route('/')
class TeamsMembersCollection(Resource):

    @api.response(201, 'Team successfully created', [location])
    @api.response(400, 'Bad request', bad_request)
    @api.response(404, "Foreign key check failure", message)
    @api.expect(multiple_team_members_input)
    def post(self):
        input_data = request.json
        team_members_ids = add_team_members(input_data)
        locations = []
        for team_member_id in team_members_ids:
            locations.append({"location": f"{api.base_url}{teams_members_namespace.path[1:]}/{team_member_id}"})
        return locations, 201

    @api.response(200, 'Team members successfully queried', [team_member_output])
    @api.response(400, 'Bad request', bad_request)
    @api.marshal_list_with(team_member_output)
    @api.expect(teams_members_filtering_args)
    def get(self):
        args = teams_members_filtering_args.parse_args(request)
        team_id = args.get('team_id', None)

        return get_team_members(team_id), 200


@api.response(404, 'Team not found', message)
@teams_members_namespace.route('/<id>')
class TeamMemberItem(Resource):
    @api.response(200, 'Teams_members successfully queried', team_member_output)
    @api.response(404, 'Team member was not found')
    @api.marshal_with(team_member_output)
    def get(self, id):
        return get_team_member(id), 200

    @api.response(200, 'Teams_members successfully deleted', message)
    @api.response(404, 'Team member was not found', message)
    def delete(self, id):
        delete_team_member(id)
        return {'message': f'Team member with id {id} successfully deleted '}, 200

    @api.response(200, 'Teams member successfully updated', message)
    @api.response(400, 'Bad request', bad_request)
    @api.response(404, 'Team member was not found')
    @api.expect(team_member_update_input)
    def patch(self, id):
        input_data = request.json
        update_team_member_info(id, input_data)
        return {'message': f"Team member with id {id} successfully updated"}, 200
