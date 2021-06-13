from flask_restx.fields import Integer, String, Wildcard, DateTime, List, Nested, Boolean
from utils.restx import api

location = api.model('Resource location', {
    'location': String(required=True, description="Resource location after creation")
})
message = api.model('Message', {
    'message': String(required=True, description="Generic message returned for operations that don't return content")
})

bad_request = api.inherit('Bad request', message, {
    'errors': Wildcard(String)
})

user_input = api.model('User input', {
    'fullName': String(required=True, description="User's full name name"),
    'contact': String(required=False, description="User's contact info (email)")
})

user_output = api.model('User output', {
    'id': Integer(required=True, description="User's database id"),
    'fullName': String(required=True, description="User's full name"),
    'avatar_url': String(required=True, description="User's avatar url"),
    'contact': String(required=True, description="User's contact information (email)"),
    'is_part_of_project': Boolean(required=False, description="Whether user is part of specified project id")
})

user_update = api.model('User update', {
    'contact': String(description="The new contact email address"),
    'avatar_url': String(description="The new avatar url")
})

project_input = api.model('Project input', {
    'name': String(required=True, description="Project name"),
    'description': String(required=True, description="Project description"),
    'created_at': DateTime(required=True, description="Date and time when the product owner submitted the project"),
    'product_owner_id': Integer(required=True, description="The id of the user that is the owner")
})

project_output = api.inherit('Project output', project_input, {
    'id': Integer(required=True, description="Project's database id"),
    'total_nr_of_issues': Integer(required=True, description="The total number of issues created for this project"),
    'nr_of_finished_issues': Integer(required=True,
                                     description="Number of total issues with status 'done' for this project"),
    'product_owner_profile': Nested(user_output, required=True,
                                    description="The profile of user that created this project"),
    'number_of_members': Integer(required=True,
                                 description="The total number of members that work on this project, excluding the product owner")
})

team_member_input = api.model('Team member input', {
    'user_id': Integer(required=True, description="The id of user which needs to be added to team"),
    'team_id': Integer(required=True, description="The id of the team on which a new team member is added"),
    'user_type': String(required=True, enum=['developer', 'scrumMaster']),
    'created_at': DateTime(required=True, description="Date and time when the new team member is added")
})

team_member_update_input = api.model('Team member input for update operation', {
    'team_id': Integer(required=False, description="The id of the team for transferring user"),
    'user_type': String(required=False, enum=['developer', 'scrumMaster'], description="To change the role"),
    'created_at': DateTime(required=True, description="Date and time when the update was performed")
})

multiple_team_members_input = api.model('Array of team members', {
    'team_members': List(Nested(team_member_input), description="List of team members")
})

team_member_output = api.inherit('Team member output', team_member_input, {
    'id': Integer(required=True, description="Team member's database id"),
    'user_profile': Nested(user_output, description="The profile for every team member")
})

team_input = api.model('Team input', {
    'name': String(required=True, description="Team's name"),
    'description': String(required=True, description="Team's role in project"),
    'created_at': DateTime(required=True,
                           description="Date and time when the product owner submitted the team creation form"),
    'project_id': Integer(required=True, description="The id of the project which will have this team"),
    'scrum_master_id': Integer(required=True,
                               description="The id of the user who will be the scrum master of this team"),
    'trello_board_id': String(required=False, description="The public trello board id")
})

team_output = api.inherit('Team output', team_input, {
    'team_members': List(Nested(team_member_output),
                         description="All the profile of the people that are part of the team"),
    'id': Integer(required=True, description="Team's database id"),
    "version_control_link": String(required=True, description="The public version control website link")

})

team_update_input = api.model('Team input for update', {
    'version_control_link': String(description="The public url that implements the version control system"),
    'trello_board_id': String(required=False, description="The public trello board id")
})

issue_input = api.model('Issue input', {
    'title': String(required=True, description="A short description of the issue"),
    'description': String(description="More details about this issue"),
    'type': String(required=True, enum=['story', 'bug', 'task'], description="What kind of issue it is"),
    'priority': String(required=True, enum=['1', '2', '3', '4', '5'],
                       description="Number after which the issue will be chosen for future sprints"),
    'created_at': DateTime(required=True, description="When was the issue created"),
    'project_id': Integer(required=True, description="The database id of the project on which the issue is added"),
    'creator_user_id': Integer(required=True, description="The id of the user who created this issue"),

})
issue_update_input = api.model('Issue input for updating', {
    'status': String(enum=['pending', 'inProgress', 'done'], description="The current situation of issue"),
    'sprint_id': Integer(description="The id of new sprint, 0 if you want issues to go back to backlog")
})

multiple_issues_update_input = api.model('List of issues', {
    'issues': List(
        Nested(api.model('Inline Model', {
            'id': Integer(required=True),
            'updates': Nested(issue_update_input, required=True)
        })))
})

issue_output = api.inherit('Issue output', issue_input, {
    'id': Integer(required=True, description="The issue database id"),
    'status': String(required=True, enum=['pending', 'inProgress', 'done'],
                     description="The current situation of issue"),
    'sprint_id': Integer(required=True, description="The sprint id when this issue is added to a sprint"),
    'creator_user_profile': Nested(user_output, required=True,
                                   description="The profile of the user that created this issue")
})

sprint_input = api.model('Sprint input', {
    'name': String(required=True, description="Name to identify the sprint"),
    'start_date': DateTime(required=True, description="Planned date to start this sprint"),
    'duration': String(required=True, enum=['1', '2', '3', '4'], description="The duration of sprint in weeks"),
    'end_date': DateTime(required=True, description="The deadline date"),
    'goal': String(required=True, description="What this sprint accomplishes after it's done"),
    'created_at': DateTime(required=True, description="The date when this sprint was created"),
    'issues_ids': List(Integer, required=True, description="A list with the ids of issues to be added to this sprint"),
    'user_creator_id': Integer(required=True, description="The id of the user that creates this sprint"),
    'project_id': Integer(required=True, description="The id of the project that will contain this sprint")
})

sprint_output = api.inherit('Sprint output', sprint_input, {
    'id': Integer(required=True, description="The id of sprint"),
    'start': Boolean(required=True, description="If the sprint is started or not"),
    'completed': Boolean(required=True, description="If the sprint is completed or not"),
    'issues': List(Nested(issue_output), required=True, description="A list of issue objects")
})

sprint_update_input = api.model('Sprint fields to be updated', {
    'start': Boolean(description="Whether sprint should start or not"),
    'completed': Boolean(description="Whether sprint should be marked as completed or not")
})

ids_list_input = api.model("General ids list", {
    'ids': List(Integer, required=True, description="A general ids list that will be will have operations done on")
})

user_role_output = api.model("Project user role", {
    "user_role": String(required=True, enum=["developer", "scrumMaster", "productOwner"],
                        description="What role does a user had inside a project")
})