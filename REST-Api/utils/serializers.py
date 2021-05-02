from flask_restx.fields import Integer, String, Wildcard, DateTime, List, Nested
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
    'contact': String(required=True, description="User's contact information(email)")
})

project_input = api.model('Project input', {
    'name': String(required=True, description="Project name"),
    'description': String(required=True, description="Project description"),
    'created_at': DateTime(required=True, description="Date and time when the product owner submitted the project"),
    'product_owner_id': Integer(required=True, description="The id of owner user")
})

project_output = api.inherit('Project_output', project_input, {
    'id': Integer(required=True, description="Project id"),
    'progress': String(required=True, description="The percentage of project tasks that are done")
})

page_of_projects = api.model('Page of projects', {
    'projects': List(Nested(project_output))
})
