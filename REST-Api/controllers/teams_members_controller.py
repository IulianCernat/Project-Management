from database import db
from database.models import TeamMember
import zulu
from sqlalchemy import desc


def add_team_members(input_data):
    new_team_members = []
    for team_member in input_data['team_members']:
        new_team_member = TeamMember(team_member)
        db.session.add(new_team_member)
        db.session.commit()
        new_team_members.append(new_team_member)

    return new_team_members


def get_team_members(team_id):
    return TeamMember.query.filter(
        TeamMember.team_id == team_id).order_by(
        desc(TeamMember.user_type)).all()


def get_team_member(team_member_id):
    return TeamMember.query.filter(TeamMember.id == team_member_id).one()


def delete_team_member(team_member_id):
    team_member = get_team_member(team_member_id)
    db.session.delete(team_member)
    db.session.commit()


def update_team_member_info(team_member_id, input_data):
    team_member = get_team_member(team_member_id)
    input_data['created_at'] = zulu.parse(input_data['created_at']).datetime
    for field, value in input_data.items():
        setattr(team_member, field, value)

    db.session.commit()
    return team_member
