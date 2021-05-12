from utils.restx import api

authorization_header = api.parser()
authorization_header.add_argument('Authorization', location='headers', required=False)

projects_sorting_arguments = api.parser()
projects_sorting_arguments.add_argument('user_id', type=int, location='args', required=True)
projects_sorting_arguments.add_argument('user_type', type=str, choices=['productOwner', 'scrumMaster', 'developer'],
                                        location='args', required=True)

teams_members_filtering_args = api.parser()
teams_members_filtering_args.add_argument('team_id', type=int, location='args', required=True)

user_filtering_args = api.parser()
user_filtering_args.add_argument('search', type=str, location='args', required=True)