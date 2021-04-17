from database import db
from database.models import User


def create_profile(uid, data):
    name = data.get('fullName')
    profile = User(uid, name)
    db.session.add(profile)
    db.session.commit()
    return profile.id
