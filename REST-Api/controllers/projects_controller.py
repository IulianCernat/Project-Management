from database import db
from database.models import Project


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
