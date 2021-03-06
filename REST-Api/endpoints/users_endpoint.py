from flask_restx import Resource
from flask import request
from utils.restx import api
from utils.serializers import user_input, message, bad_request, user_output, user_update
from controllers.users_controller import *
from utils.parsers import authorization_header, user_filtering_args
from utils.authorization import process_firebase_authorization_field
from utils.firebase_auth import get_firebase_user_by_uid, create_custom_claim_for_user

users_namespace = api.namespace(
    'user_profiles', description='Operations related to user profiles')


@users_namespace.route('/')
@api.response(400, 'Bad request', bad_request)
class ProfilesCollection(Resource):

    @api.response(201, 'Profile successfully created', user_output)
    @api.response(401, 'Authorization failed', message)
    @api.expect(user_input, authorization_header)
    @api.marshal_with(user_output)
    def post(self):
        decoded_token = process_firebase_authorization_field(request)
        user_profile = request.json
        profile = create_user(decoded_token['uid'], user_profile)
        return profile, 201

    @api.response(200, 'Users successfully queried')
    @api.marshal_list_with(user_output)
    @api.expect(user_filtering_args, authorization_header)
    def get(self):
        process_firebase_authorization_field(request)
        args = user_filtering_args.parse_args(request)
        search_keyword = args.get('search', None)

        if search_keyword is None:
            return get_all_users(), 200
        return get_users_by_filters(search_keyword,), 200


@api.response(404, 'User not found', message)
@users_namespace.route('/<id>')
class ProfileItem(Resource):

    @api.response(200, 'Users successfully queried', user_output)
    @api.response(400, 'Bad request', bad_request)
    @api.marshal_with(user_output, authorization_header)
    def get(self, id):
        process_firebase_authorization_field(request)
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
