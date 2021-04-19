from database import db
from database.models import User

def create_user(uid, data):
    name = data.get('fullName')
    profile = User(uid, name)
    db.session.add(profile)
    db.session.commit()
    return profile.id


def get_other_user(user_id):
    user = User.query.filter(User.id == user_id).one()
    return user


def get_self(uid):
    user = User.query.filter(User.uid == uid).one()
    return user
