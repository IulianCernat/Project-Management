from utils.firebase_auth import auth, firebase_exceptions
from database import db
from database.models import User
from utils.firebase_auth import check_if_user_is_admin, create_custom_claim_for_user, generate_password_reset_link
from utils.custom_exceptions import AuthorizationFailed
from utils.usefull_functions import generate_random_string, send_email
import random


def create_user(creator_admin_user, user_to_be_created_input_obj, claims_dict_for_created_user):
	try:
		if not check_if_user_is_admin(creator_admin_user):
			raise AuthorizationFailed("User cannot be created because creator user is not an admin")

		user_to_be_created_input_obj['password'] = generate_random_string(random.randint(20, 50))
		created_user = auth.create_user(email=user_to_be_created_input_obj['email'],
		                                password=user_to_be_created_input_obj['password'])

		del user_to_be_created_input_obj['email'],
		del user_to_be_created_input_obj['password']

		create_custom_claim_for_user(creator_admin_user, created_user, claims_dict_for_created_user)
		new_user_profile = User(created_user.uid, user_to_be_created_input_obj)
		db.session.add(new_user_profile)
		db.session.commit()

		# Send reset password to created user
		password_reset_link = generate_password_reset_link(created_user.email)
		email_contents = ["Your account has been created for projectsmanager app",
		                  "Please reset your password in order to login",
		                  f"<a href={password_reset_link}>Reset password</a>"]
		email_subject = "Password reset for projectsmanager app"
		send_email(created_user.email, email_subject, email_contents)
		return new_user_profile
	except firebase_exceptions.FirebaseError as e:
		raise e
	except Exception as e:
		raise e