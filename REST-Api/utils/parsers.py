from utils.restx import api

authorization_header = api.parser()
authorization_header.add_argument('Authorization', location='headers')
