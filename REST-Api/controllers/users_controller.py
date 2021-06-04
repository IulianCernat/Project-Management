from database import db
from database.models import User, TeamMember, Team
from sqlalchemy import literal


def create_user(uid, data):
    name = data.get('fullName')
    profile = User(uid, name)
    db.session.add(profile)
    db.session.commit()

    return profile.id


def get_other_user(user_id):
    user = User.query.filter(User.id == user_id).one()

    return user


def get_users_by_filters(keyword, part_of_project_id=None):
    keyword_filtered_users = User.query.filter(User.fullName.contains(keyword)).all()

    if part_of_project_id is None:
        return keyword_filtered_users

    for user in keyword_filtered_users:
        q = TeamMember.query.join(Team).filter(Team.project_id == part_of_project_id, TeamMember.user_id == user.id)
        setattr(user, 'is_part_of_project', bool(db.session.query(literal(True)).filter(q.exists()).scalar()))

    return keyword_filtered_users


def get_self(uid):
    user = User.query.filter(User.uid == uid).one()

    return user


def get_user_id(uid):
    user = User.query.filter(User.uid == uid).one()
    return user.id