from firebase_admin import auth, credentials
import firebase_admin
import json
from utils.custom_exceptions import AuthorizationFailed
from settings import firebase_google_credentials

# credentials are stored in an environment variable called GOOGLE_APPLICATION_CREDENTIALS
# if the variable is not json, the it's loaded as a file

try:
    cert = credentials.Certificate(json.loads(firebase_google_credentials, strict=False))
    firebase_app = firebase_admin.initialize_app(cert)

except ValueError:
    firebase_app = firebase_admin.initialize_app()


def verify_id_token(user_token):
    try:
        return auth.verify_id_token(user_token, firebase_app)

    except Exception as e:
        raise AuthorizationFailed(e)