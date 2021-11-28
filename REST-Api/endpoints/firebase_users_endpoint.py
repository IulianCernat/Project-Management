from utils.restx import api
from flask import request
from flask_restx import Resource
from controllers.firebase_users import *
from utils.parsers import authorization_header
from utils.serializers import user_input_created_by_admin, user_output, bad_request
from utils.authorization import process_firebase_authorization_field

firebase_users_namespace = api.endpoint('firebase_users', description="Operations related to users, made by admin")


@firebase_users_namespace.route('/')
class FirebaseUsersCollection(Resource):

	@api.response(201, "Firebase user and profile successfully created", user_output)
	@api.response(400, 'Bad request', bad_request)
	@api.expect(user_input_created_by_admin, authorization_header)
	@api.marshal_with(user_output)
	def post(self):
		input_data = request.json
		firebase_admin_user = process_firebase_authorization_field(request)
		firebase_claims_for_user = input_data['firebase_claims']
		del input_data['firebase_claims']
		created_user_profile = create_user(firebase_admin_user, input_data, firebase_claims_for_user)
		return created_user_profile, 201