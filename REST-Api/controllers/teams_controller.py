from database import db
from database.models import Team, User, TeamMember
from controllers.teams_members_controller import add_team_members


def add_team(input_data):
    new_team = Team(input_data)
    db.session.add(new_team)
    db.session.commit()
    add_team_members(
        {'team_members': [{
            'user_id': input_data['scrum_master_id'],
            'team_id': new_team.id,
            'user_type': 'scrumMaster',
            'created_at': input_data['created_at']
        }]})

    return new_team.id


def get_team(team_id):
    return Team.query.filter(Team.id == team_id).one()


def get_teams(project_id):
    return Team.query.filter(Team.project_id == project_id).all()
