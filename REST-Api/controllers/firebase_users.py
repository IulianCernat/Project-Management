from utils.firebase_auth import auth, firebase_exceptions, firebase_app
from database import db
from database.models import User
from utils.firebase_auth import check_if_user_is_admin, create_custom_claim_for_user
from utils.custom_exceptions import AuthorizationFailed, FirebaseException
from utils.usefull_functions import generate_random_string, send_firebase_reset_password_link
import random


def create_user(creator_admin_user, user_to_be_created_input_obj, claims_dict_for_created_user):
    try:
        if not check_if_user_is_admin(creator_admin_user):
            raise AuthorizationFailed("User cannot be created because creator user is not an admin")

        user_to_be_created_input_obj['password'] = generate_random_string(
            random.randint(20, 50))
        created_user = auth.create_user(email=user_to_be_created_input_obj['email'],
                                        password=user_to_be_created_input_obj['password'])

        user_to_be_created_input_obj['contact'] = user_to_be_created_input_obj['email']
        del user_to_be_created_input_obj['email'],
        del user_to_be_created_input_obj['password']

        create_custom_claim_for_user(
            creator_admin_user, created_user, claims_dict_for_created_user)
        new_user_profile = User(created_user.uid, user_to_be_created_input_obj)
        db.session.add(new_user_profile)
        db.session.commit()

        send_firebase_reset_password_link(created_user.email)
        return new_user_profile
    except firebase_exceptions.FirebaseError as e:
        raise FirebaseException(e)
    except Exception as e:
        raise e


def delete_firebase_user(admin_user, user_uid):
    try:
        if not check_if_user_is_admin(admin_user):
            raise AuthorizationFailed("User is not an admin")
        auth.delete_users(user_uid, app=firebase_app)
    except firebase_exceptions.FirebaseError as e:
        raise FirebaseException(e)
    except Exception as e:
        raise e
