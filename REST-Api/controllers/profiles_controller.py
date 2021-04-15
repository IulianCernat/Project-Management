from database import db
from database.models import Profile
import string
import random


def create_profile(data):
    name = data.get('name')
    letters = string.ascii_letters
    profile = Profile(''.join(random.choice(letters) for i in range(7)), name)
    db.session.add(profile)
    db.session.commit()
    return profile.id
