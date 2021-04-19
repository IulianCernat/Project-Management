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
