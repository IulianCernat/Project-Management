from database import db
from database.models import User, TeamMember, Team, Project
from sqlalchemy import literal


def create_user(uid, data):
    profile = User(uid, data)
    db.session.add(profile)
    db.session.commit()

    return profile.id


def get_other_user(user_id):
    user = User.query.filter(User.id == user_id).one()

    return user

def get_other_user_by_uid(user_uid):
    return User.query.fikter(User.uid == user_uid).one()

def get_users_by_filters(keyword, part_of_project_id=None):
    keyword_filtered_users = User.query.filter(
        User.fullName.contains(keyword)).all()

    if part_of_project_id is None:
        return keyword_filtered_users

    for user in keyword_filtered_users:
        is_team_member = TeamMember.query.join(Team).filter(TeamMember.user_id == user.id,
                                                            Team.project_id == part_of_project_id,
                                                            )
        is_team_member = bool(db.session.query(
            literal(True)).filter(is_team_member.exists()).scalar())

        if is_team_member:
            setattr(user, 'is_part_of_project', is_team_member)
            continue

        is_product_owner = Project.query.filter(
            Project.id == part_of_project_id, Project.product_owner_id == user.id)
        is_product_owner = bool(db.session.query(
            literal(True)).filter(is_product_owner.exists()).scalar())

        setattr(user, 'is_part_of_project', is_product_owner)

    return keyword_filtered_users


def get_self(uid):
    user = User.query.filter(User.uid == uid).one()
    return user


def check_if_user_exists(uid):
    return User.query.filter(User.uid == uid).scalar()


def get_user_id(uid):
    user = User.query.filter(User.uid == uid).one()
    return user.id


def update_user(uid, input_obj):
    user = User.query.filter(User.uid == uid).one()
    for field, value in input_obj.items():
        setattr(user, field, value)

    db.session.commit()


def get_all_users():
    return User.query.all()


def delete_user(user_id=None, user_uid=None):
    if user_id is None and user_uid is None:
        return
    if user_uid is not None:
        user_to_be_deleted = get_other_user_by_uid(user_uid)
    else:
        user_to_be_deleted = get_other_user(user_id)

    db.session.delete(user_to_be_deleted)
    db.session.commit()