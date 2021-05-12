from database import db
from database.models import TeamMember

def add_team_member(input_data):
    new_team_member = TeamMember(input_data)
    db.session.add(new_team_member)
    db.session.commit()
    return new_team_member.id

def get_team_members(team_id):
    return TeamMember.query.filter(TeamMember.team_id == team_id).all()

def get_team_member(team_member_id):
    return TeamMember.query.filter(TeamMember.id == team_member_id).one()

