from database import db
from database.models import Issue
from sqlalchemy import desc
from utils.custom_exceptions import TrelloResourceUnavailable


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
    return Issue.query.filter(Issue.sprint_id == sprint_id, Issue.trello_card_due_is_completed == True).count()


def get_nr_of_finished_issues_for_project(project_id):
    return Issue.query.filter(Issue.project_id == project_id, Issue.trello_card_due_is_completed == True).count()


def get_issue(issue_id):
    issue = Issue.query.filter(Issue.id == issue_id).one()
    return issue


def update_issue(issue_id, input_obj=None, trello_token=None, clear_trello_data=False):
    from controllers.trello_controller import delete_webhook_of_model, delete_trello_card
    issue = get_issue(issue_id)

    def clean_issue_trello_data():
        setattr(issue, 'trello_webhook_id', None)
        setattr(issue, 'trello_card_id', None)
        setattr(issue, 'trello_card_is_closed', None)
        setattr(issue, 'trello_card_due_is_completed', None),
        setattr(issue, 'trello_card_list_name', None)

    if input_obj is not None:
        if 'sprint_id' in input_obj and input_obj.get('sprint_id') == 0:
            setattr(issue, 'sprint_id', None)
            del input_obj['sprint_id']
            if trello_token is not None:
                try:
                    if issue.trello_card_id is not None and issue.trello_webhook_id is not None:
                        delete_webhook_of_model(
                            issue.trello_webhook_id, trello_token)
                        delete_trello_card(issue.trello_card_id, trello_token)
                except TrelloResourceUnavailable as e:
                    # If resource doesn't exist then continue with clearing Trello info
                    pass
                except Exception as e:
                    raise e
            clean_issue_trello_data()

        # Update other fields
        for field, value in input_obj.items():
            setattr(issue, field, value)

    # delete only trello info (for example when card is deleted from Trello)
    if clear_trello_data is True:
        clean_issue_trello_data()

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


def get_issue_by_trello_card_id(trello_card_id):
    return Issue.query.filter(Issue.trello_card_id == trello_card_id).one()
