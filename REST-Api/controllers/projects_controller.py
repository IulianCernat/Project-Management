from database import db
from database.models import Project, Team, TeamMember


def check_project_existance(project_id):
    return Project.query.filter(Project.id == project_id).scalar()


def add_project(input_data):
    new_project = Project(input_data)
    db.session.add(new_project)
    db.session.commit()
    return new_project.id


def get_project(project_id):
    return Project.query.filter(Project.id == project_id).one()


def get_projects(user_id, user_type):
    if user_type == 'productOwner':
        return Project.query.filter(Project.product_owner_id == user_id).all()
    if user_type in ['scrumMaster', 'developer']:
        return Project.query.join(Team).join(TeamMember).filter(TeamMember.user_type == user_type,
                                                                TeamMember.user_id == user_id).all()


def get_project_role(user_id, project_id):
    product_owner_flag = Project.query.filter(Project.id == project_id,
                                              Project.product_owner_id == user_id).one_or_none()
    if product_owner_flag:
        return "scrumMaster"
    team_member_role = TeamMember.query.join(Team).filter(Team.project_id == project_id,
                                                          TeamMember.user_id == user_id).one()
    return {'user_role': team_member_role.user_type}