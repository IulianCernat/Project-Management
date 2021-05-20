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
