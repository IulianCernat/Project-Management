from utils.parsers import authorization_header
from utils.firebase_auth import verify_id_token
from utils.custom_exceptions import AuthorizationFailed

def process_firebase_authorization_field(request):
	try:
		authorization_string = authorization_header.parse_args(request)
		authorization_components = authorization_string.get('Authorization')
		authorization_components = authorization_components.split(",")
		token_id = next(filter(lambda item: "firebase_id_token" in item, authorization_components))
		token_id = token_id.split("=")[1]
		decoded_token = verify_id_token(token_id)
		return decoded_token
	except Exception as e:
		raise AuthorizationFailed(e)

def process_trello_authorization_field(request):
	try:
		authorization_components = request.headers.get('Authorization').split(",")
		user_token = next(filter(lambda item: "trello_token" in item, authorization_components))
		user_token = user_token.split('=')[1]
		return user_token
	except Exception as e:
		raise e