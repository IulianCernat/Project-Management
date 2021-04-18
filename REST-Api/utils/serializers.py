from flask_restx.fields import Integer, String, Wildcard
from utils.restx import api

user_input = api.model('User input', {
    'fullName': String(required=True, description="User's full name name"),

})

user_output = api.model('User output', {
    'id': Integer(required=True, description="User's database id"),
    'fullName': String(required=True, description="User's full name name"),
    'avatar_url': String(required=True, description="User's avatar url"),
    'contact': String(required=True, description="User's contact information(email)")
})

message = api.model('Message', {
    'message': String(required=True)
})

bad_request = api.inherit('Bad request', message, {

    'erorrs': Wildcard(String)
})
