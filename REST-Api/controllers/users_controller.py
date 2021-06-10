from database import db
from database.models import User, TeamMember, Team, Project
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
        is_team_member = TeamMember.query.join(Team).filter(Team.project_id == part_of_project_id,
                                                            TeamMember.user_id == user.id)
        is_team_member = bool(db.session.query(literal(True)).filter(is_team_member.exists()).scalar())

        if is_team_member:
            setattr(user, 'is_part_of_project', is_team_member)
            break

        is_product_owner = Project.query.filter(Project.id == part_of_project_id, Project.product_owner_id == user.id)
        is_product_owner = bool(db.session.query(literal(True)).filter(is_product_owner.exists()).scalar())

        setattr(user, 'is_part_of_project', is_product_owner)

    return keyword_filtered_users


def get_self(uid):
    user = User.query.filter(User.uid == uid).one()

    return user


def get_user_id(uid):
    user = User.query.filter(User.uid == uid).one()
    return user.id


def update_user(uid, input_obj):
    user = User.query.filter(User.uid == uid).one()
    for field, value in input_obj.items():
        setattr(user, field, value)

    db.session.commit()