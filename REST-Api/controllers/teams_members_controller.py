from database import db
from database.models import TeamMember


def add_team_members(input_data):
    ids = []
    for team_member in input_data['team_members']:
        new_team_member = TeamMember(team_member)
        db.session.add(new_team_member)
        db.session.commit()
        ids.append(new_team_member.id)

    return ids


def get_team_members(team_id):
    return TeamMember.query.filter(TeamMember.team_id == team_id).all()


def get_team_member(team_member_id):
    return TeamMember.query.filter(TeamMember.id == team_member_id).one()
