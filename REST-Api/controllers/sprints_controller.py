from database import db
from database.models import Sprint
from controllers.issues_controller import update_issue
from sqlalchemy import select, asc, desc
import zulu


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

    return new_sprint


def get_sprint(sprint_id):
    sprint = Sprint.query.filter(Sprint.id == sprint_id).one()
    is_sprint_completed(sprint)

    return sprint


def get_sprints(project_id):
    sprints = Sprint.query.filter(Sprint.project_id == project_id).order_by(
        desc(Sprint.created_at)).all()
    for sprint in sprints:
        is_sprint_completed(sprint)
    return sprints


def get_sprints_with_minimal_info(project_id):
    stmt = select(Sprint.id, Sprint.name).where(
        Sprint.project_id == project_id)
    return list(db.session.execute(stmt))


def update_sprint(sprint_id, input_obj):

    if 'start_date' in input_obj:
        input_obj['start_date'] = zulu.parse(input_obj['start_date']).datetime
    if 'end_date' in input_obj:
        input_obj['end_date'] = zulu.parse(input_obj['end_date']).datetime

    sprint = get_sprint(sprint_id)
    for field, value in input_obj.items():
        setattr(sprint, field, value)
    is_sprint_completed(sprint)

    db.session.commit()
    return sprint


def delete_sprint(sprint_id):
    sprint = get_sprint(sprint_id)
    for sprint_issue in sprint.issues:
        update_issue(sprint_issue.id, {'sprint_id': 0})
    db.session.delete(sprint)
    db.session.commit()


def is_sprint_completed(sprint):
    if zulu.parse(sprint.end_date).datetime <= zulu.now().datetime:
        setattr(sprint, 'completed', True)
