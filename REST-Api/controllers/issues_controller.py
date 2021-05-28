from database import db
from database.models import Issue


def add_issue(input_obj):
    new_issue = Issue(input_obj)
    db.session.add(new_issue)
    db.session.commit()
    return new_issue.id


def get_issues(project_id):
    return Issue.query.filter(Issue.project_id == project_id, Issue.sprint_id == None).all()


def get_issue(issue_id):
    return Issue.query.filter(Issue.id == issue_id).one()


def update_issue(issue_id, input_obj):
    issue = get_issue(issue_id)

    for field, value in input_obj.items():
        setattr(issue, field, value)

    db.session.commit()