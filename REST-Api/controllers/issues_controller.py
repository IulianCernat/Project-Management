from database import db
from database.models import Issue
from sqlalchemy import desc


def add_issue(input_obj):
    new_issue = Issue(input_obj)
    db.session.add(new_issue)
    db.session.commit()
    return new_issue.id


def get_issues(project_id):
    return Issue.query.filter(Issue.project_id == project_id, Issue.sprint_id == None).order_by(
        desc(Issue.created_at)).all()


def get_issue(issue_id):
    issue = Issue.query.filter(Issue.id == issue_id).one()
    return issue


def update_issue(issue_id, input_obj):
    issue = get_issue(issue_id)
    if input_obj['sprint_id'] == 0:
        setattr(issue, 'sprint_id', None)
        del input_obj['sprint_id']
    for field, value in input_obj.items():
        setattr(issue, field, value)

    db.session.commit()


def delete_issue(issue_id):
    issue = get_issue(issue_id)
    db.session.delete(issue)
    db.session.commit()