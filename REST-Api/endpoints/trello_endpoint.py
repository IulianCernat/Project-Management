from flask_restx import Resource
from flask import request
from utils.custom_exceptions import AuthorizationFailed
from utils.restx import api
from controllers.trello_controller import *
from utils.parsers import authorization_header
from utils.serializers import trello_board_input

trello_namespace = api.namespace('trello/boards', description="Operations related trello")


@trello_namespace.route('/<id>')
class TrelloBoard(Resource):

	@api.expect(authorization_header)
	@api.response(200, "Trello board successfully fetched")
	def get(self, id):
		try:
			authorization_components = request.headers.get('Authorization').split(",")
			user_token = filter(lambda item: "trello_token" in item, authorization_components)

		except AuthorizationFailed as e:
			raise e
		board_response = get_board(id, request.args, user_token)
		if board_response.status_code == 200:
			return board_response.json(), board_response.status_code

		return board_response.text, board_response.status_code


@trello_namespace.route('/')
class TrelloBoards(Resource):
	@api.response(200, "Trello board was successfully linked to team")
	@api.header("Authorization", description="Must container trello_token")
	@api.expect(trello_board_input)
	def post(self):
		try:
			authorization_components = request.headers.get('Authorization').split(",")
			user_token = filter(lambda item: "trello_token" in item, authorization_components)

		except AuthorizationFailed as e:
			raise e

		input_data = request.json
		updated_team_id = add_board(input_data['team_id'], input_data['trello_board_short_id'], user_token)
		return {'message': f"Team with id {updated_team_id} successfully updated"}, 200