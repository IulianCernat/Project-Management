from firebase_admin import auth, credentials, exceptions as firebase_exceptions
import firebase_admin
import json
from utils.custom_exceptions import AuthorizationFailed
from settings import firebase_google_credentials, firebase_claims_values, FIREBASE_APP_ADMIN_EMAIL, log

# credentials are stored in an environment variable called GOOGLE_APPLICATION_CREDENTIALS
# if the variable is not json, the it's loaded as a file

try:
	cert = credentials.Certificate(json.loads(firebase_google_credentials, strict=False))
	firebase_app = firebase_admin.initialize_app(cert)
except ValueError:
	firebase_app = firebase_admin.initialize_app()

# give admin to rights to a user having the email
# configured in an environment variable
user_to_be_promoted = None
try:

	user_to_be_promoted = auth.get_user_by_email(FIREBASE_APP_ADMIN_EMAIL, firebase_app)

except ValueError as e:
	log.error("Admin email is invalid")
except auth.UserNotFoundError:
	log.error("Admin account doesn't exist")
except firebase_exceptions.FirebaseError:
	log.error("Could not fetch admin account")

if user_to_be_promoted:
	try:
		user_custom_claims = {}

		if user_to_be_promoted.custom_claims is not None:
			user_custom_claims = user_to_be_promoted.custom_claims
		if firebase_claims_values['admin'] not in user_custom_claims:
			auth.set_custom_user_claims(user_to_be_promoted.uid, {
				firebase_claims_values['admin']: True
			}, firebase_app)
	except Exception as e:
		log.error(f"Error when creating/checking admin account: {e}")


def check_if_user_is_admin(firebase_user):
	user_firebase_custom_claims = firebase_user.custom_claims
	if user_firebase_custom_claims is None:
		return False
	if user_firebase_custom_claims.get('admin'):
		return True

	return False

def create_custom_claim_for_user(firebase_admin_user, firebase_user_to_receive_claims, claims_dict):
	if not check_if_user_is_admin(firebase_admin_user):
		raise AuthorizationFailed("Creator user doesn't have admin rights")
	try:
		auth.set_custom_user_claims(firebase_user_to_receive_claims.uid, claims_dict)
	except firebase_exceptions.FirebaseError as e:
		raise e
	except Exception as e:
		return e


def verify_id_token(user_token):
	return auth.verify_id_token(user_token, firebase_app)