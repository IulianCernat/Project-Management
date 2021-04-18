from firebase_admin import auth
import firebase_admin
from utils.custom_exceptions import AuthorizationFailed
# credentials are stored in an environment variable called GOOGLE_APPLICATION_CREDENTIALS
firebase_app = firebase_admin.initialize_app()

def verify_id_token(headers):
    try:
        token_id = headers.get('Authorization')
        return auth.verify_id_token(token_id, firebase_app)
    except Exception as e:
        raise AuthorizationFailed(e)

