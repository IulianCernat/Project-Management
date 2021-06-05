from flask_restx import Resource
from flask import request, session
from utils.restx import api
from utils.serializers import user_input, message, bad_request, user_output
from controllers.users_controller import *
from utils.firebase_auth import verify_id_token
from utils.parsers import authorization_header, user_filtering_args
from utils.custom_exceptions import AuthorizationFailed

users_namespace = api.namespace('users', description='Operations related to user profiles')


@users_namespace.route('/')
class ProfilesCollection(Resource):

    @api.response(201, 'Profile successfully created', message)
    @api.response(400, 'Bad request', bad_request)
    @api.response(401, 'Authorization failed', message)
    @api.expect(user_input, authorization_header)
    def post(self):
        try:
            token_id = request.headers.get('Authorization')
            decoded_token = verify_id_token(token_id)
        except AuthorizationFailed as e:
            raise e

        user_profile = request.json
        profile_id = create_user(decoded_token['uid'], user_profile)

        return {"location": f"{api.base_url}{users_namespace.path[1:]}/{profile_id}"}, 201

    @api.response(200, 'teams_members successfully queried')
    @api.response(400, 'Bad request', bad_request)
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


@api.response(404, 'User not found', message)
@users_namespace.route('/loggedUser')
class LoggedUser(Resource):

    @api.response(200, 'Users successfully queried', user_output)
    @api.response(400, 'Bad request', bad_request)
    @api.response(401, 'Authorization failed', message)
    @api.expect(authorization_header)
    @api.marshal_with(user_output)
    def get(self):
        try:
            token_id = request.headers.get('Authorization')
            decoded_token = verify_id_token(token_id)
        except AuthorizationFailed as e:
            raise e

        return get_self(decoded_token['uid'])