import json
from flask_restx import Resource
from flask import request
from utils.restx import api
from controllers.trello_controller import *
from utils.serializers import message, trello_board_input, trello_board_output, trello_card_input, location
from utils.parsers import trello_board_args, authorization_header

trello_namespace = api.namespace(
    'trello', description="Operations related trello")


@trello_namespace.route('/boards/<id>')
@api.expect(authorization_header)
class TrelloBoard(Resource):
    @api.response(404, "Trello board doesn't exist", message)
    @api.response(200, "Trello board successfully fetched. 'cards' or/and 'lists' can be absent",
                  trello_board_output)
    @api.marshal_with(trello_board_output, skip_none=True)
    @api.expect(trello_board_args)
    def get(self, id):
        args = trello_board_args.parse_args(request)
        data_arrangement = args.get('data_arrangement', None)
        if data_arrangement is not None:
            data_arrangement = data_arrangement.split(',')

        board_response = get_board(id, data_arrangement)

        return board_response, 200


@trello_namespace.route('/boards/')
@api.expect(authorization_header)
class TrelloBoards(Resource):
    @api.header("Authorization", description="Must contain trello_token")
    @api.response(201, "Trello board was successfully created", location)
    @api.expect(trello_board_input)
    def post(self):
        try:
            authorization_components = request.headers.get(
                'Authorization').split(",")
            user_token = next(
                filter(lambda item: "trello_token" in item, authorization_components))
            user_token = user_token.split('=')[1]
        except Exception as e:
            raise e

        input_data = request.json
        created_trello_board = create_trello_board(
            input_data, user_token)
        return {'location': f"https://https://trello.com/boards/{created_trello_board['id']}"}, 201


@trello_namespace.route('/cards/')
@api.expect(authorization_header)
class TrelloCards(Resource):
    @api.response(201, 'Trello card successfully created', location)
    @api.expect(trello_card_input)
    def post(self):
        try:
            authorization_components = request.headers.get(
                'Authorization').split(",")
            user_token = next(
                filter(lambda item: "trello_token" in item, authorization_components))
            user_token = user_token.split('=')[1]

        except Exception as e:
            raise e
        input_data = request.json
        created_card = copy_issue_to_trello_board_list(input_data, user_token)

        return {"location": f"{created_card['id']}"}, 201
