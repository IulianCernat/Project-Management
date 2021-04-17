import logging
from flask_restx import Resource
from flask import request
from utils.restx import api, log
from utils.serializers import profile_input, bad_request
from controllers.users_controller import create_profile
from utils.firebase_auth import verify_id_token
from utils.parsers import authorization_header


users_namespace = api.namespace('users', description='Operations related to user profiles')


@users_namespace.route('/')
class ProfilesCollection(Resource):

    @api.response(201, 'Profile successfully created')
    @api.response(400, 'Bad request', bad_request)
    @api.expect(profile_input, authorization_header)
    def post(self):
        try:
            token_id = request.headers.get('Authorization')
            decoded_token = verify_id_token(token_id)
        except Exception as e:
            return {'message': f"Failed to authorize:{e}"}, 401

        user_profile = request.json
        print(user_profile)
        profile_id = create_profile(decoded_token['uid'], user_profile)
        return {"location": f"{api.base_url}{users_namespace.path[1:]}/{profile_id}"}, 201
