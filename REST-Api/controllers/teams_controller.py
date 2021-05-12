from database import db
from database.models import Team


def add_team(input_data):
    new_team = Team(input_data)
    db.session.add(new_team)
    db.session.commit()
    return new_team.id


def get_team(team_id):
    return Team.query.filter(Team.id == team_id).one()
