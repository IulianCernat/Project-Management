from flask_restx import Resource
from flask import request
from utils.restx import api
from controllers.trello_controller import process_callback_data

trello_callback_namespace = api.namespace('trello_callback', description='Endpoint called by trello webhooks')


@trello_callback_namespace.route('/')
@api.response(400, 'Bad request')
class TrelloCallback(Resource):

	@api.response(200, 'Successfully called endpoint')
	def post(self):
		trello_received_data = request.json
		print(trello_received_data)
		process_callback_data(trello_received_data)

	@api.response(200, 'Successfully called endpoint')
	def head(self):
		return "success", 200