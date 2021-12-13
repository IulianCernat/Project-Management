from flask_restx import Resource
from flask import request
from utils.restx import api
from utils.serializers import team_message_input, team_message_output, bad_request, message
from utils.parsers import team_messages_filtering_args
from controllers.team_messages_controller import *

team_messages_namespace = api.namespace(
    'team_messages', description='Operations related to team messages')


@team_messages_namespace.route('/')
@api.response(400, 'Bad request', bad_request)
class TeamMessagesCollection(Resource):
    @api.response(201, 'team_message successfully created', team_message_output)
    @api.response(404, "Foreign key check failure (team_id doesn't exist)")
    @api.expect(team_message_input)
    @api.marshal_with(team_message_output, code=201)
    def post(self):
        input_data = request.json
        new_team_message = create_team_message(input_data)
        return new_team_message, 201

    @api.response(200, 'team_messages successfully queried', [team_message_output])
    @api.marshal_list_with(team_message_output)
    @api.expect(team_messages_filtering_args)
    def get(self):
        args = team_messages_filtering_args.parse_args(request)
        team_id = args.get('team_id', None)
        return get_all_team_messages(team_id), 200


@api.response(404, 'team_message not found', message)
@team_messages_namespace.route('/<id>')
class TeamMessageItem(Resource):
    @api.response(200, 'team_messages successfully queried', team_message_output)
    @api.marshal_with(team_message_output)
    def get(self, id):
        return get_team_message(id), 200

    @api.response(200, 'team_messages successfully queried', message)
    def delete(self, id):
        delete_team_message(id)
        return {"message": "team_message successfully deleted"}, 200
