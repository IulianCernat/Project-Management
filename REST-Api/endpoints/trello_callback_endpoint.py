from flask_restx import Resource
from flask import request
from utils.restx import api

trello_callback_namespace = api.namespace('trello_callback', description='Endpoint called by trello webhooks')


@trello_callback_namespace.route('/')
@api.response(400, 'Bad request')
class TrelloCallback(Resource):

	@api.response(200, 'Successfully called endpoint')
	def post(self):
		input_data = request.json
		print(input_data)

	@api.response(200, 'Successfully called endpoint')
	def head(self):
		return "success", 200