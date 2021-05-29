from flask_restx.fields import Integer, String, Wildcard, DateTime, List, Nested, Boolean
from utils.restx import api

location = api.model('Resource location', {
    'location': String(required=True, description="Resource location after creation")
})
message = api.model('Message', {
    'message': String(required=True)
})

bad_request = api.inherit('Bad request', message, {
    'errors': Wildcard(String)
})

user_input = api.model('User input', {
    'fullName': String(required=True, description="User's full name name"),

})

user_output = api.model('User output', {
    'id': Integer(required=True, description="User's database id"),
    'fullName': String(required=True, description="User's full name"),
    'avatar_url': String(required=True, description="User's avatar url"),
    'contact': String(required=True, description="User's contact information(email)"),
    'is_part_of_project': Boolean(required=False, description="Whether user is part of specified query project")
})

project_input = api.model('Project input', {
    'name': String(required=True, description="Project name"),
    'description': String(required=True, description="Project description"),
    'created_at': DateTime(required=True, description="Date and time when the product owner submitted the project"),
    'product_owner_id': Integer(required=True, description="The id of owner user")
})

project_output = api.inherit('Project output', project_input, {
    'id': Integer(required=True, description="Project id"),
    'progress': String(required=True, description="The percentage of project tasks that are done")
})

page_of_projects = api.model('Page of projects', {
    'projects': List(Nested(project_output))
})

team_member_input = api.model('Team member input', {
    'user_id': Integer(required=True, description="The id of user which need to be added to team"),
    'team_id': Integer(required=True, description="The id of the team on which a new team member is added"),
    'user_type': String(required=True, enum=['developer', 'scrumMaster']),
    'created_at': DateTime(required=True, description="Date and time when the product owner adds the team members")
})

team_member_update_input = api.model('Team member input', {
    'team_id': Integer(required=False, description="The id of the team for transferring user"),
    'user_type': String(required=False, enum=['developer', 'scrumMaster'], description="To change the role"),
    'created_at': DateTime(required=True, description="Date and time when the update was performed")
})

multiple_team_members_input = api.model('Array of team members', {
    'team_members': List(Nested(team_member_input))
})

team_member_output = api.inherit('Team member output', team_member_input, {
    'id': Integer(required=True, description="Team member's database id"),
    'user_profile': Nested(user_output, description="The profile for every teammate")
})

team_input = api.model('Team input', {
    'name': String(required=True, description="Team name"),
    'description': String(required=True, description="Team's role in project"),
    'avatar_url': String(required=False, description="Avatar image url"),
    'created_at': DateTime(required=True,
                           description="Date and time when the product owner submitted the team creation form",
                           ),
    'project_id': Integer(required=True, description="The id of the project which will have this team"),
    'scrum_master_id': Integer(required=True, description="The id of the user who will be the scrum master of the team")

})

team_output = api.inherit('Team output', team_input, {
    'team_members': List(Nested(team_member_output), description="All the people that are part of the team"),
    'id': Integer(required=True, description="Team's database id"),

})

issue_input = api.model('Issue input', {
    'title': String(required=True, description="A short description of the issue"),
    'description': String(description="More details about this issue"),
    'type': String(required=True, enum=['story', 'bug', 'task'], description="What kind of issue it is"),
    'priority': String(required=True, enum=['1', '2', '3', '4', '5'],
                       description="Number after which the issue will be chosen for sprints"),
    'created_at': DateTime(required=True, description="When was the issue created"),
    'project_id': Integer(required=True, description="The database id of the project on which the issue is added"),
    'creator_user_id': Integer(required=True, description="The id of the user who created this issue"),

})

issue_output = api.inherit('Issue output', issue_input, {
    'id': Integer(required=True, description="The issue database id"),
    'sprint_id': Integer(required=True, description="The sprint id when this issue is added to a sprint"),
    'creator_user_profile': Nested(user_output, required=True, description="The profile of the user that created this issue")
})

sprint_input = api.model('Sprint input', {
    'name': String(required=True, description="Name to idetify the sprint"),
    'start_date': DateTime(required=True, description="Planned date to start this sprint"),
    'duration': String(required=True, enum=['1', '2', '3', '4'], description="The duration of sprint in weeks"),
    'end_date': DateTime(required=True, description="The deadline date"),
    'goal': String(required=True, description="The accomplishment of this sprint"),
    'created_at': DateTime(required=True, description="The date when this sprint was created"),
    'issues_ids': List(Integer, required=True, description="A list with the ids of issues to be added to this sprint"),
    'user_creator_id': Integer(required=True, description="The id of the user that creates this sprint"),
    'project_id': Integer(required=True, description="The id of the project that will contain this sprint")
})

sprint_output = api.inherit('Sprint output', sprint_input, {
    'id': Integer(required=True, description="The id of sprint"),
    'issues': List(Nested(issue_output), required=True, description="A list of issue objects")
})