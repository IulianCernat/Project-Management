from flask_restx import Resource
from flask import request
from utils.restx import api
from utils.serializers import issue_input, message, bad_request, issue_output, issue_update_input, location, \
    multiple_issues_update_input
from utils.parsers import issues_filtering_args
from controllers.issues_controller import *

issues_namespace = api.namespace('issues', description='Operations related to issues')


@issues_namespace.route('/')
@api.response(400, 'Bad request', bad_request)
class IssuesCollection(Resource):
    @api.response(201, 'Issue successfully created', location)
    @api.response(404, "Foreign key check failure (project_id or creator_user_id doesn't exist)")
    @api.expect(issue_input)
    def post(self):
        input_data = request.json
        issue_id = add_issue(input_data)
        return {"location": f"{api.base_url}{issues_namespace.path[1:]}/{issue_id}"}, 201

    @api.response(200, 'Issues successfully queried', [issue_output])
    @api.marshal_list_with(issue_output)
    @api.expect(issues_filtering_args)
    def get(self):
        args = issues_filtering_args.parse_args(request)
        project_id = args.get('project_id', None)
        return get_issues(project_id), 200

    @api.response(200, 'Issues successfully updated', message)
    @api.response(404, 'Issue was not found')
    @api.expect(multiple_issues_update_input)
    def patch(self):
        input_data = request.json

        update_issues(input_data)
        return {'message': f"Issues successfully updated"}, 200


@api.response(404, 'Issue not found', message)
@issues_namespace.route('/<id>')
class IssueItem(Resource):
    @api.response(200, 'Issues successfully queried', issue_output)
    @api.marshal_with(issue_output)
    def get(self, id):
        return get_issue(id), 200

    @api.response(200, 'Issues successfully queried')
    def delete(self, id):
        delete_issue(id)
        return {"message": "Issue successfully deleted"}, 200

    @api.response(200, 'Issue successfully updated', message)
    @api.response(400, 'Bad request', bad_request)
    @api.expect(issue_update_input)
    def patch(self, id):
        input_data = request.json
        update_issue(id, input_data)
        return {'message': f"Issue with id {id} successfully updated"}, 200