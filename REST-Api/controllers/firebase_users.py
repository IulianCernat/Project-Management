from utils.firebase_auth import auth, firebase_exceptions
from database import db
from database.models import User


def create_user(user_input_obj):
	try:
		created_user = auth.create_user(email=user_input_obj['email'], password=user_input_obj['password'])
		del user_input_obj['email'],
		del user_input_obj['password']
		new_user = User(created_user.uid, user_input_obj)
		db.session.add(new_user)
		db.session.commit()
	except firebase_exceptions.FirebaseError as e:
		raise e