from flask_restx import Resource
from flask import request
from utils.restx import api
from utils.serializers import issue_input, message, bad_request, issue_output, issue_update_input, location, \
    multiple_issues_update_input
from utils.parsers import issues_filtering_args
from controllers.issues_controller import *
from utils.parsers import authorization_header
from utils.authorization import process_firebase_authorization_field, process_trello_authorization_field
issues_namespace = api.namespace(
    'issues', description='Operations related to issues')


@issues_namespace.route('/')
@api.response(400, 'Bad request', bad_request)
class IssuesCollection(Resource):
    @api.response(201, 'Issue successfully created', issue_output)
    @api.response(404, "Foreign key check failure (project_id or creator_user_id doesn't exist)")
    @api.expect(issue_input, authorization_header)
    @api.marshal_with(issue_output)
    def post(self):
        process_firebase_authorization_field(request)
        input_data = request.json
        new_issue = add_issue(input_data)
        return new_issue, 201

    @api.response(200, 'Issues successfully queried', [issue_output])
    @api.marshal_list_with(issue_output)
    @api.expect(issues_filtering_args, authorization_header)
    def get(self):
        process_firebase_authorization_field(request)
        args = issues_filtering_args.parse_args(request)
        project_id = args.get('project_id', None)
        return get_issues(project_id), 200

    @api.response(200, 'Issues successfully updated', message)
    @api.response(404, 'Issue was not found')
    @api.expect(multiple_issues_update_input, authorization_header)
    def patch(self):
        process_firebase_authorization_field(request)
        input_data = request.json

        update_issues(input_data)
        return {'message': f"Issues successfully updated"}, 200


@api.response(404, 'Issue not found', message)
@issues_namespace.route('/<id>')
class IssueItem(Resource):
    @api.response(200, 'Issues successfully queried', issue_output)
    @api.marshal_with(issue_output)
    @api.expect(authorization_header)
    def get(self, id):
        process_firebase_authorization_field(request)
        return get_issue(id), 200

    @api.response(200, 'Issues successfully queried')
    @api.expect(authorization_header)
    def delete(self, id):
        process_firebase_authorization_field(request)
        delete_issue(id)
        return {"message": "Issue successfully deleted"}, 200

    @api.response(200, 'Issue successfully updated', issue_output)
    @api.response(400, 'Bad request', bad_request)
    @api.expect(issue_update_input, authorization_header)
    @api.marshal_with(issue_output)
    def patch(self, id):
        process_firebase_authorization_field(request)
        input_data = request.json
        updated_issue = update_issue(id, input_data)
        return updated_issue, 200
