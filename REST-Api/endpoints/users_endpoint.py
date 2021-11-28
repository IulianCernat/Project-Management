from flask_restx import Resource
from flask import request
from utils.restx import api
from utils.serializers import user_input, message, bad_request, user_output, user_update
from controllers.users_controller import *
from utils.parsers import authorization_header, user_filtering_args
from utils.authorization import process_firebase_authorization_field

users_namespace = api.namespace(
	'user_profiles', description='Operations related to user profiles')


# TODO: Automate authorization checking

@users_namespace.route('/')
@api.response(400, 'Bad request', bad_request)
class ProfilesCollection(Resource):

	@api.response(201, 'Profile successfully created', message)
	@api.response(401, 'Authorization failed', message)
	@api.expect(user_input, authorization_header)
	def post(self):
		decoded_token = process_firebase_authorization_field(request)
		user_profile = request.json

		# for when populating database with script
		# decoded_token = {
		#     'uid': f"{user_profile['contact']}{user_profile['fullName']}"}

		profile_id = create_user(decoded_token['uid'], user_profile)

		return {"location": f"{api.base_url}{users_namespace.path[1:]}/{profile_id}"}, 201

	@api.response(200, 'Users successfully queried')
	@api.marshal_list_with(user_output)
	@api.expect(user_filtering_args)
	def get(self):
		args = user_filtering_args.parse_args(request)
		search_keyword = args.get('search', None)
		part_of_project_id = args.get('part_of_project_id', None)
		return get_users_by_filters(search_keyword, part_of_project_id), 200


@api.response(404, 'User not found', message)
@users_namespace.route('/<id>')
class ProfileItem(Resource):

	@api.response(200, 'Users successfully queried', user_output)
	@api.response(400, 'Bad request', bad_request)
	@api.marshal_with(user_output)
	def get(self, id):
		user_profile = get_other_user(id)
		return user_profile


@users_namespace.route('/loggedUser')
@api.response(404, 'User not found', message)
@api.response(400, 'Bad request', bad_request)
class LoggedUser(Resource):

	@api.response(200, 'Users successfully queried', user_output)
	@api.response(401, 'Authorization failed', message)
	@api.expect(authorization_header)
	@api.marshal_with(user_output)
	def get(self):
		decoded_token = process_firebase_authorization_field(request)

		return get_self(decoded_token['uid']), 200

	@api.response(200, 'User profile successfully updated', message)
	@api.response(401, 'Authorization failed', message)
	@api.expect(user_update, authorization_header)
	def patch(self):
		input_data = request.json
		decoded_token = process_firebase_authorization_field(request)

		return update_user(decoded_token['uid'], input_data), 200