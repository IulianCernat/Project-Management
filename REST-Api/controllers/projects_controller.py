from database import db
from database.models import Project, Team, TeamMember
from controllers.issues_controller import get_nr_of_finished_issues_for_project, get_nr_of_issues_for_project
from controllers.teams_controller import get_nr_of_members_for_project


def check_project_existance(project_id):
    return Project.query.filter(Project.id == project_id).scalar()


def add_project(input_data):
    new_project = Project(input_data)
    db.session.add(new_project)
    db.session.commit()
    return new_project


def get_additional_project_info(project_id):
    return {'total_nr_of_issues': get_nr_of_issues_for_project(project_id),
            'nr_of_finished_issues': get_nr_of_finished_issues_for_project(project_id),
            'number_of_members': get_nr_of_members_for_project(project_id)}


def get_project(project_id):
    project = Project.query.filter(Project.id == project_id).one()
    for key, value in get_additional_project_info(project_id).items():
        setattr(project, key, value)
    return project


def get_projects(user_id, user_type):
    projects = None
    if user_type == 'productOwner':
        projects = Project.query.filter(
            Project.product_owner_id == user_id).all()
    if user_type in ['scrumMaster', 'developer']:
        projects = Project.query.join(Team).join(TeamMember).filter(
            TeamMember.user_type == user_type, TeamMember.user_id == user_id).all()
    for project in projects:
        for key, value in get_additional_project_info(project.id).items():
            setattr(project, key, value)
    return projects


def get_project_role(user_id, project_id):
    product_owner_flag = Project.query.filter(Project.id == project_id,
                                              Project.product_owner_id == user_id).one_or_none()

    if product_owner_flag is None:
        team_member_role = TeamMember.query.join(Team).filter(Team.project_id == project_id,
                                                              TeamMember.user_id == user_id).one()

    def get_user_trello_board_ids():
        teams_and_members = Team.query.join(TeamMember).filter(
            Team.project_id == project_id, Team.trello_board_id != None).all()
        return [
            {
                'trello_board_id': team.trello_board_id,
                'is_added_by_user': next(
                    filter(lambda item: item.user_id == user_id, team.team_members)).user_type == 'scrumMaster'
            }
            for team in teams_and_members
        ]

    trello_boards = get_user_trello_board_ids()
    project_role = {}
    if product_owner_flag:
        project_role["user_role"] = "productOwner"
    else:
        project_role["user_role"] = team_member_role.user_type

    project_role['trello_boards'] = trello_boards
    return project_role


def update_project(project_id, input_obj):
    project = get_project(project_id)
    for field, value in input_obj.items():
        setattr(project, field, value)

    db.session.commit()
    return project


def delete_project(project_id):
    project = get_project(project_id)
    db.session.delete(project)
    db.session.commit()
