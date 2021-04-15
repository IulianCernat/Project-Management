from flask_restx import fields
from utils.restx import api

profile_input = api.model('Profile', {
    'name': fields.String(required=True, description="User's name"),

})


