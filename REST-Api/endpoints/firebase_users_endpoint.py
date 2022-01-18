from utils.restx import api
from flask import request
from flask_restx import Resource
from controllers.firebase_users import *
from controllers.users_controller import delete_user
from utils.parsers import authorization_header
from utils.serializers import user_input_created_by_admin, user_output, bad_request, message
from utils.authorization import process_firebase_authorization_field

firebase_users_namespace = api.namespace(
    'firebase_users', description="Operations related to users, made by admin")


@firebase_users_namespace.route('/')
class FirebaseUsersCollection(Resource):

    @api.response(201, "Firebase user and profile successfully created", user_output)
    @api.response(400, 'Bad request', bad_request)
    @api.expect(user_input_created_by_admin, authorization_header)
    @api.marshal_with(user_output)
    def post(self):
        input_data = request.json
        decoded_admin_token = process_firebase_authorization_field(request)
        firebase_claims_for_user = input_data['firebase_claims']
        del input_data['firebase_claims']
        created_user_profile = create_user(decoded_admin_token, input_data, firebase_claims_for_user)
        return created_user_profile, 201


@api.response(404, 'User not found', message)
@firebase_users_namespace.route('/<uid>')
class FirebaseUserItem(Resource):
    @api.response(200, 'Firebase user successfully deleted')
    @api.expect(authorization_header)
    def delete(self, uid):
        decoded_admin_token = process_firebase_authorization_field(request)
        delete_firebase_user(decoded_admin_token, uid)
        delete_user(user_uid=uid)
        return {"message": "Firebase user and profile successfully deleted"}, 200