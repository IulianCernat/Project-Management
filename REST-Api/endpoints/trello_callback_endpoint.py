from flask_restx import Resource
from flask import request
from utils.restx import api
from controllers.trello_controller import process_callback_data
import json

trello_callback_namespace = api.namespace(
    'trello_callback', description='Endpoint called by trello webhooks')


@trello_callback_namespace.route('/')
@api.response(400, 'Bad request')
class TrelloCallback(Resource):

    @api.response(200, 'Successfully called endpoint')
    def post(self):

        trello_received_data = request.json
        # with open("callbackInfo", "w") as file_desc:
        #     json.dump(trello_received_data, file_desc)

        process_callback_data(trello_received_data)
        return "success", 200

    @api.response(200, 'Successfully called endpoint')
    def head(self):
        return "success", 200
