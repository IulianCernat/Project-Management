from database import db
from database.models import Sprint
from controllers.issues_controller import update_issue

def add_sprint(input_obj):
    issues_ids = input_obj['issues_ids']
    del input_obj['issues_ids']

    new_sprint = Sprint(input_obj)
    db.session.add(new_sprint)
    db.session.commit()

    for issue_id in issues_ids:
        update_issue(issue_id, {
            'sprint_id': new_sprint.id
        })

    return new_sprint.id

def get_sprint(sprint_id):
    return Sprint.query.filter(Sprint.id == sprint_id).one()

def get_sprints(project_id):
    return Sprint.query.filter(Sprint.project_id == project_id).all()

def update_sprint(sprint_id, input_obj):
    sprint = get_sprint(sprint_id)


    for field, value in input_obj.items():
        setattr(sprint, field, value)
    db.session.commit()

def delete_sprint(sprint_id):
    sprint = get_sprint(sprint_id)
    for sprint_issue in sprint.issues:
        sprint_issue.status = "pending"
        sprint_issue.sprint_id = None
    db.session.delete(sprint)
    db.session.commit()