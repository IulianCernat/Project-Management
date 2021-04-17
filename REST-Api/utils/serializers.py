from flask_restx import fields
from utils.restx import api

profile_input = api.model('Profile', {
    'fullName': fields.String(required=True, description="User's name"),

})
message = api.model('Message', {
    'message': fields.String(required=True)
})

bad_request = api.inherit('Bad request', message, {

    'erorrs': fields.Wildcard(fields.String)
})

