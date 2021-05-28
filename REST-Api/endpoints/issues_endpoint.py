from flask_restx import Resource
from flask import request
from utils.restx import api
from utils.serializers import issue_input, message, bad_request, issue_output, location
from utils.parsers import issues_filtering_args
from controllers.issues_controller import *


issues_namespace = api.namespace('issues', description='Operations related to issues')


@issues_namespace.route('/')
@api.response(400, 'Bad request', bad_request)
@api.response(404, "Project id or User id don't exist", message)
class IssuesCollection(Resource):
    @api.response(201, 'Issue successfully created', location)
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