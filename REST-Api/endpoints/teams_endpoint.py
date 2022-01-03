from flask_restx import Resource
from flask import request
from utils.restx import api
from utils.serializers import team_input, message, bad_request, team_output, team_update_input
from controllers.teams_controller import *
from utils.parsers import team_filtering_args, authorization_header
from utils.authorization import process_firebase_authorization_field

teams_namespace = api.namespace('teams', description='Operations related to managing teams')


@api.response(400, 'Bad request', bad_request)
@teams_namespace.route('/')
class TeamsCollection(Resource):

    @api.response(201, 'Team successfully created', team_output)
    @api.response(404, "Foreign key check failure (project_id or scrum_master_id doesn't exist)", message)
    @api.expect(team_input, authorization_header)
    @api.marshal_with(team_output)
    def post(self):
        process_firebase_authorization_field(request)
        input_data = request.json
        new_team = add_team(input_data)
        return new_team, 201

    @api.response(200,
                  'Teams successfully queried, the team_members field,'
                  'contains first the scrum master then the developers',
                  [team_output])
    @api.marshal_list_with(team_output)
    @api.expect(team_filtering_args, authorization_header)
    def get(self):
        process_firebase_authorization_field(request)
        args = team_filtering_args.parse_args(request)
        project_id = args.get('project_id', None)
        return get_teams(project_id), 200


@api.response(404, 'team not found', message)
@api.response(400, 'Bad request', bad_request)
@teams_namespace.route('/<id>')
class TeamItem(Resource):
    @api.response(200, 'teams successfully queried', team_output)
    @api.marshal_with(team_output)
    @api.expect(authorization_header)
    def get(self, id):
        process_firebase_authorization_field(request)
        return get_team(id), 200

    @api.response(200, 'Team successfully updated', message)
    @api.response(404, 'Team was not found')
    @api.expect(team_update_input, authorization_header)
    def patch(self, id):
        process_firebase_authorization_field(request)
        input_data = request.json
        update_team(id, input_data)
        return {'message': f"Team with id {id} successfully updated"}, 200

    @api.response(200, 'Teams successfully queried', message)
    @api.response(404, 'Team was not found', message)
    @api.expect(authorization_header)
    def delete(self, id):
        process_firebase_authorization_field(request)
        delete_team(id)
        return {"message": "Team was successfully deleted"}, 200
