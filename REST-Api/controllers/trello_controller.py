import requests
import logging
import settings
from database.models import Team, Issue
from database import db
from controllers.teams_controller import get_team
from controllers.issues_controller import get_issue_by_trello_card_id, update_issue
from utils.custom_exceptions import TrelloRequestFailure, TrelloResourceUnavailable
import settings
import time
log = logging.getLogger(__name__)


def create_headers(user_token):
    return {'Authorization': f'OAuth oauth_consumer_key="{settings.TRELLO_API_KEY}", oauth_token="{user_token}"'}


def get_board(board_id, data_arrangement):
    returned_obj = {}

    for element in data_arrangement:
        if element == 'board_lists':
            returned_obj['trello_board_lists'] = get_board_lists(
                board_id)
            continue

        if element == 'board_cards':
            returned_obj['trello_board_cards'] = get_board_cards(
                board_id)
            continue

        if element == 'board_lists_ids_and_names':
            returned_obj['trello_board_lists_ids_and_names'] = get_board_lists_ids_and_names(
                board_id)
            continue

        if element == 'board_labels':
            returned_obj['trello_board_labels'] = get_board_labels(board_id)
            continue

    return returned_obj


def get_board_lists(board_id):
    url = f"{settings.TRELLO_API_URL}/boards/{board_id}/lists"
    params = {
        'fields': 'name,labels',
        'cards': 'open',
        'card_fields': 'name,closed,due,dueComplete,idMembers,labels'
    }
    board_lists_request_obj = requests.get(
        url, params=params, timeout=1)
    if board_lists_request_obj.status_code == 404:
        raise TrelloResourceUnavailable(board_lists_request_obj.text)
    if board_lists_request_obj.status_code != 200:
        raise TrelloRequestFailure(board_lists_request_obj.text)
    board_lists = board_lists_request_obj.json()

    board_members = get_board_members(board_id)

    for board_list in board_lists:
        for card in board_list['cards']:
            card['members_info'] = []
            for card_member_id in card['idMembers']:
                member_info = next(
                    filter(lambda member_item: member_item['id'] == card_member_id, board_members))
                card['members_info'] = member_info

    return board_lists


def get_board_members(board_id):
    url = f"{settings.TRELLO_API_URL}/boards/{board_id}/members"

    board_members_request_obj = requests.get(url)
    if board_members_request_obj.status_code != 200:
        raise TrelloRequestFailure(board_members_request_obj.text)
    board_members = board_members_request_obj.json()

    return board_members


def get_board_cards(board_id):
    url = f"{settings.TRELLO_API_URL}/boards/{board_id}"
    params = {
        'fields': 'id',
        'cards': 'all',
        'lists': 'all',
        'card_fields': 'closed,dueComplete,idList',
        'list_fields': 'name'
    }

    board_info_request_obj = requests.get(url, params=params)
    if board_info_request_obj.status_code != 200:
        raise TrelloRequestFailure(board_info_request_obj.text)

    board_info = board_info_request_obj.json()

    cards = []
    for card in board_info['cards']:
        card['list_name'] = next(filter(lambda board_list: board_list['id']
                                 == card['idList'], board_info['lists']))['name']
        cards.append(card)

    return cards


def get_board_id(board_short_id):
    url = f"{settings.TRELLO_API_URL}/boards/{board_short_id}"
    params = {"fields": "id"}

    board_id_request_obj = requests.get(
        url, params=params, timeout=1)
    if board_id_request_obj.status_code != 200:
        raise TrelloRequestFailure(board_id_request_obj.text)

    return board_id_request_obj.json()['id']


def get_board_labels(board_id):
    url = f"{settings.TRELLO_API_URL}/boards/{board_id}/labels"
    params = {"fields": "id,name"}

    labels = requests.get(url, params=params, timeout=1, ).json()
    labels_obj = {}
    for label in labels:
        if label['name'] != "":
            labels_obj[label['name']] = label['id']

    return labels_obj


def get_board_lists_ids_and_names(board_id):
    url = f"{settings.TRELLO_API_URL}/boards/{board_id}/lists"
    params = {"fields": "id,name"}

    lists_ids_request_obj = requests.get(
        url, params=params, timeout=1)
    if lists_ids_request_obj.status_code != 200:
        raise TrelloRequestFailure(lists_ids_request_obj.text)

    board_lists = lists_ids_request_obj.json()

    return board_lists


def copy_issue_to_trello_board_list(payload, user_token):
    url = f"{settings.TRELLO_API_URL}/cards"
    headers = create_headers(user_token)
    issue_id = payload['issue_id']
    board_list_name = payload['board_list_name']
    del payload['issue_id']
    del payload['board_list_name']
    try:
        trello_api_request_obj = requests.post(
            url, data=payload, timeout=5, headers=headers)
        if trello_api_request_obj.status_code != 200:
            raise TrelloRequestFailure(trello_api_request_obj.text)

        created_card = trello_api_request_obj.json()
        issue_to_be_updated = Issue.query.filter(Issue.id == issue_id).one()
        issue_to_be_updated.trello_card_id = created_card['id']
        issue_to_be_updated.trello_card_list_name = board_list_name
        issue_to_be_updated.trello_card_due_is_completed = False
        issue_to_be_updated.trello_card_is_closed = False

        create_trello_webhook(
            created_card['id'], user_token, issue_to_be_updated)
        db.session.commit()
        return created_card
    except Exception as e:
        raise e


def create_trello_webhook(trello_model_id, user_token, issue_obj):
    url = f"{settings.TRELLO_API_URL}/webhooks"
    headers = create_headers(user_token)
    payload = {
        'idModel': trello_model_id,
        'callbackURL': f"{settings.TUNNELED_API_ADDRESS}/api/trello_callback/"
    }

    try:
        trello_request_obj = requests.post(url, data=payload, headers=headers)
        if trello_request_obj.status_code != 200:
            raise TrelloRequestFailure(trello_request_obj.text)
        created_webhook = trello_request_obj.json()
        issue_obj.trello_webhook_id = created_webhook['id']
    except Exception as e:
        raise e


def send_trello_data_to_realtime_service(trello_data):
    startBenchmarckClock = time.perf_counter()
    service_url = settings.REALTIME_UPDATES_SERVICE_URL
    try:
        requests.post(service_url, json=trello_data, headers={
                      "Content-Type": "application/json"}, timeout=0.003)

    except Exception as e:
        pass
    print(time.perf_counter() - startBenchmarckClock)


def process_callback_data(callback_data):

    issue_update_for_client = dict()

    def process_event():
        issue_with_card_id = get_issue_by_trello_card_id(
            card_data.get('card')['id'])

        issue_update_for_client['issue_id'] = issue_with_card_id.id
        issue_update_for_client['board_id'] = card_data['board']['id']

        if action_type == 'updateCard':
            if card_data.get("listAfter") and card_data.get("listAfter")['name']:
                issue_update_payload = {
                    'trello_card_list_name': card_data.get("listAfter")['name']
                }
                issue_update_for_client.update(issue_update_payload)
                update_issue(issue_with_card_id.id, issue_update_payload)
                return

            if 'dueComplete' in card_data['old']:
                issue_update_payload = {
                    'trello_card_due_is_completed': card_data.get('card')['dueComplete']
                }
                issue_update_for_client.update(issue_update_payload)
                update_issue(issue_with_card_id.id, issue_update_payload)
                return

            if 'closed' in card_data['old']:
                issue_update_payload = {
                    'trello_card_is_closed': card_data.get('card')['closed']
                }
                issue_update_for_client.update(issue_update_payload)
                update_issue(issue_with_card_id.id, issue_update_payload)
                return

        if action_type == 'deleteCard':
            issue_update_for_client['trello_card_id'] = None
            issue_update_for_client['trello_card_is_closed'] = None
            issue_update_for_client['trello_card_due_is_completed'] = None
            issue_update_for_client['trello_card_list_name'] = None
            update_issue(issue_with_card_id.id, clear_trello_data=True)
            return

    action = callback_data.get('action')
    if action is None:
        return

    action_type = action.get('type')
    if action_type is None:
        return

    card_data = action.get('data')

    if card_data is None:
        return

    process_event()
    send_trello_data_to_realtime_service(issue_update_for_client)


def delete_webhook_of_model(webhook_id, user_token):
    url = f"{settings.TRELLO_API_URL}/webhooks/{webhook_id}"
    headers = create_headers(user_token)
    try:
        trello_request_obj = requests.delete(url, headers=headers)

        if trello_request_obj.status_code == 404:
            raise TrelloResourceUnavailable(trello_request_obj.text)
        if trello_request_obj.status_code != 200:
            raise TrelloRequestFailure(trello_request_obj.text)

    except Exception as e:
        raise e


def delete_trello_card(trello_card_id, user_token):
    url = f"{settings.TRELLO_API_URL}/cards/{trello_card_id}"
    headers = create_headers(user_token)
    try:
        trello_request_obj = requests.delete(url, headers=headers)
        if trello_request_obj.status_code == 404:
            raise TrelloResourceUnavailable(trello_request_obj.text)
        if trello_request_obj.status_code != 200:
            raise TrelloRequestFailure(trello_request_obj.text)
    except Exception as e:
        raise e


def create_trello_board(input_board_obj, user_token):
    url = f"{settings.TRELLO_API_URL}/boards"
    headers = create_headers(user_token)
    for_team = Team.query.filter(Team.id == input_board_obj["team_id"]).one()

    payload = {
        "name": input_board_obj["name"],
        "prefs_permissionLevel": "public",
    }

    try:
        trello_request_obj = requests.post(url, data=payload, headers=headers)
        if trello_request_obj.status_code != 200:
            raise TrelloRequestFailure(trello_request_obj.text)
        created_board = trello_request_obj.json()
        for_team.trello_board_id = created_board['id']
        db.session.commit()

        create_board_labels(created_board['id'], user_token)
        return created_board
    except Exception as e:
        raise e


def delete_trello_board(board_id, user_token):
    url = f"{settings.TRELLO_API_URL}/boards/{board_id}"
    headers = create_headers(user_token)

    try:
        trello_request_obj = requests.delete(url, headers=headers)
        if trello_request_obj.status_code == 404:
            raise TrelloResourceUnavailable(trello_request_obj.text)
        if trello_request_obj.status_code != 200:
            raise TrelloRequestFailure(trello_request_obj.text)
    except Exception as e:
        raise e


def create_board_labels(board_id, user_token):
    url = f"{settings.TRELLO_API_URL}/boards/{board_id}/labels"
    headers = create_headers(user_token)

    custom_labels = [
        {
            "name": "bug",
            "color": "red"
        },
        {
            "name": "task",
            "color": "blue"
        },
        {
            "name": "story",
            "color": "green"
        }
    ]

    for label in custom_labels:
        try:
            trello_request_obj = requests.post(
                url, data=label, headers=headers)
            if trello_request_obj.status_code == 404:
                raise TrelloResourceUnavailable(trello_request_obj.text)
            if trello_request_obj.status_code != 200:
                raise TrelloRequestFailure(trello_request_obj.text)
        except Exception as e:
            raise e
