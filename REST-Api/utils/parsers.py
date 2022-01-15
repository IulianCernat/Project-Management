from utils.restx import api
from flask_restx import inputs

authorization_header = api.parser()
authorization_header_help = r"""
The Authorization field is a string containing comma separated keys with values.
This string has the following regex form: ^(firebase_id_token=\w+)?,?(trello_token=\w+)?,?$
"""
authorization_header.add_argument(
    'Authorization', location='headers', type=inputs.regex(
        r'^(firebase_id_token=.+?)?,?(trello_token=.+?)?,?$'),
    required=True, help=authorization_header_help)

projects_sorting_arguments = api.parser()
projects_sorting_arguments.add_argument('user_id', type=int, location='args', required=True)
projects_sorting_arguments.add_argument(
    'user_type', type=str, choices=['productOwner', 'scrumMaster', 'developer'],
    location='args', required=True)

team_filtering_args = api.parser()
team_filtering_args.add_argument(
    'project_id', type=int, location='args', required=True)

teams_members_filtering_args = api.parser()
teams_members_filtering_args.add_argument(
    'team_id', type=int, location='args', required=True)

user_filtering_args = api.parser()
user_filtering_args.add_argument(
    'search', type=str, location='args', required=False)
user_filtering_args.add_argument(
    'part_of_project_id', type=int, location='args', required=False)

issues_filtering_args = api.parser()
issues_filtering_args.add_argument(
    'project_id', type=int, location='args', required=True)

sprints_filtering_args = api.parser()
sprints_filtering_args.add_argument(
    'project_id', type=int, location="args", required=True)
sprints_filtering_args.add_argument(
    'minimal_info', type=bool, location="args", required=False)

trello_board_args = api.parser()
trello_board_args.add_argument('data_arrangement', type=inputs.regex(
    r'(board_cards)?,?(board_lists)?,?(board_lists_ids_and_names)?,?(board_labels)?,?'),
    location="args", required=True)

team_messages_filtering_args = api.parser()
team_messages_filtering_args.add_argument('team_id', type=int, location="args", required=True)
