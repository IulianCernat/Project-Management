from flask_restx import Resource
from flask import request
from utils.restx import api
from controllers.trello_controller import *
from utils.serializers import trello_board_input, trello_board_output
from utils.parsers import trello_board_args

trello_namespace = api.namespace('trello', description="Operations related trello")
import json


@trello_namespace.route('/boards/<id>')
class TrelloBoard(Resource):
	@api.header("Authorization", description="Must contain trello_token")
	@api.response(200, "Trello board successfully fetched. 'cards' or/and 'lists' can be absent",
				  trello_board_output)
	@api.marshal_with(trello_board_output, skip_none=True)
	@api.expect(trello_board_args)
	def get(self, id):
		args = trello_board_args.parse_args(request)
		data_arrangement = args.get('data_arrangement', None)
		if data_arrangement is not None:
			data_arrangement = data_arrangement.split(',')
		try:
			authorization_components = request.headers.get('Authorization').split(",")
			user_token = filter(lambda item: "trello_token" in item, authorization_components)

		except Exception as e:
			raise e

		board_response = get_board(id, user_token, data_arrangement)
		if board_response is None:
			return "Internal Server error", 500

		return board_response, 200


@trello_namespace.route('/boards/')
class TrelloBoards(Resource):
	@api.response(200, "Trello board was successfully linked to team")
	@api.header("Authorization", description="Must contain trello_token")
	@api.expect(trello_board_input)
	def post(self):
		try:
			authorization_components = request.headers.get('Authorization').split(",")
			user_token = filter(lambda item: "trello_token" in item, authorization_components)

		except Exception as e:
			raise e

		input_data = request.json
		updated_team_id = add_board(input_data['team_id'], input_data['trello_board_short_id'], user_token)
		return {'message': f"Team with id {updated_team_id} successfully updated"}, 200