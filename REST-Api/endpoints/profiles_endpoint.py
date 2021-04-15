import logging
from flask_restx import Resource
from flask import request
from utils.restx import api, log
from utils.serializers import profile_input
from controllers.profiles_controller import create_profile
from flask import after_this_request


profiles_namespace = api.namespace('profiles', description='Operations related to profiles')


@profiles_namespace.route('/')
class ProfilesCollection(Resource):

    @api.response(201, 'Profile successfully created')
    @api.expect(profile_input)
    def post(self):
        # Created new profile
        print(request.cookies['is_bar'])

        @after_this_request
        def set_is_bar_cookie(response):
            response.set_cookie('is_bar', 'no', max_age=64800, httponly=True)
            return response

        data = request.json
        profile_id = create_profile(data)
        return {"location": f"{api.base_url}{profiles_namespace.path[1:]}/{profile_id}"}, 201
