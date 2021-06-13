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


def get_nr_of_issues_for_project(project_id):
    return Issue.query.filter(Issue.project_id == project_id).count()


def get_nr_of_finished_issues_for_sprint(sprint_id):
    return Issue.query.filter(Issue.sprint_id == sprint_id, Issue.status == 'done').count()


def get_nr_of_finished_issues_for_project(project_id):
    return Issue.query.filter(Issue.project_id == project_id, Issue.status == "done").count()


def get_issue(issue_id):
    issue = Issue.query.filter(Issue.id == issue_id).one()
    return issue


def update_issue(issue_id, input_obj):
    issue = get_issue(issue_id)

    if 'sprint_id' in input_obj and input_obj['sprint_id'] == 0:
        setattr(issue, 'sprint_id', None)
        del input_obj['sprint_id']

    for field, value in input_obj.items():
        setattr(issue, field, value)

    db.session.commit()


def update_issues(input_obj):
    found_issues = []
    for issue in input_obj['issues']:
        found_issues.append(get_issue(issue['id']))

    for issue_list_index, found_issue in enumerate(found_issues):
        for field, value in input_obj['issues'][issue_list_index]['updates'].items():
            setattr(found_issue, field, value)

    db.session.commit()


def delete_issue(issue_id):
    issue = get_issue(issue_id)
    db.session.delete(issue)
    db.session.commit()