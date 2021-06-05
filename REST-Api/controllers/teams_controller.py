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

def get_nr_of_members_for_project(project_id):
    members_number = 0
    teams = Team.query.filter(Team.project_id == project_id).all()
    for team in teams:
        members_number += len(team.team_members)
    return members_number

def get_teams(project_id):
    return Team.query.filter(Team.project_id == project_id).all()

def update_team(team_id, input_obj):
    issue = get_team(team_id)
    for field, value in input_obj.items():
        setattr(issue, field, value)

    db.session.commit()