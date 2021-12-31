from flask_restx import Resource, cors

from flask import request
from utils.restx import api
from utils.serializers import message, bad_request, team_member_output, multiple_team_members_input, \
    team_member_update_input
from controllers.teams_members_controller import *
from utils.parsers import teams_members_filtering_args
from utils.parsers import authorization_header
from utils.authorization import process_firebase_authorization_field


teams_members_namespace = api.namespace(
    'teams_members', description='Operations related to managing team members')


@teams_members_namespace.route('/')
@api.response(400, 'Bad request', bad_request)
class TeamsMembersCollection(Resource):

    @api.response(201, 'Team successfully created', [team_member_output])
    @api.response(404, "Foreign key check failure (team_id or user_id doesn't exist)", message)
    @api.expect(multiple_team_members_input, authorization_header)
    @api.marshal_list_with(team_member_output)
    def post(self):
        process_firebase_authorization_field(request)
        input_data = request.json
        team_members = add_team_members(input_data)

        return team_members, 201

    @api.response(200, 'Team members successfully queried', [team_member_output])
    @api.marshal_list_with(team_member_output)
    @api.expect(teams_members_filtering_args, authorization_header)
    def get(self):
        process_firebase_authorization_field(request)
        args = teams_members_filtering_args.parse_args(request)
        team_id = args.get('team_id', None)

        return get_team_members(team_id), 200


@api.response(404, 'Team member was not found')
@teams_members_namespace.route('/<id>')
class TeamMemberItem(Resource):
    @api.response(200, 'Teams members successfully queried', team_member_output)
    @api.marshal_with(team_member_output)
    @api.expect(authorization_header)
    def get(self, id):
        process_firebase_authorization_field(request)
        return get_team_member(id), 200

    @api.response(200, 'Team member successfully deleted', message)
    @api.expect(authorization_header)
    def delete(self, id):
        delete_team_member(id)
        return {'message': f'Team member with id {id} successfully deleted '}, 200

    @api.response(200, 'Teams member successfully updated', message)
    @api.expect(team_member_update_input, authorization_header)
    def patch(self, id):
        process_firebase_authorization_field(request)
        input_data = request.json
        update_team_member_info(id, input_data)
        return {'message': f"Team member with id {id} successfully updated"}, 200
