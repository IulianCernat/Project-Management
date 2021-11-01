import requests
import logging
import settings
from database.models import Team, Issue
from database import db
from controllers.teams_controller import get_team
from utils.custom_exceptions import TrelloRequestFailure

log = logging.getLogger(__name__)


def create_headers(user_token):
	return {'Authorization': f'OAuth oauth_consumer_key="{settings.TRELLO_API_KEY}", oauth_token="{user_token}"'}


def get_board(board_id, user_token, data_arrangement):
	headers = create_headers(user_token)
	returned_obj = {}
	try:
		for element in data_arrangement:
			if element == 'board_lists':
				returned_obj['trello_board_lists'] = get_board_lists(headers, board_id)
				continue

			if element == 'board_cards':
				returned_obj['trello_board_cards'] = get_board_cards(headers, board_id)
				continue

			if element == 'board_lists_ids':
				returned_obj['trello_board_lists_ids'] = get_board_lists_ids(board_id, headers)
				continue

			if element == 'board_labels':
				returned_obj['trello_board_labels'] = get_board_labels(board_id, headers)
				continue

	except Exception as e:
		log.error(e)
		return None

	return returned_obj


def get_board_lists(headers, board_id):
	url = f"{settings.TRELLO_API_URL}/boards/{board_id}/lists"
	params = {
		'fields': 'name,labels',
		'cards': 'open',
		'card_fields': 'name,closed,due,dueComplete,idMembers,labels'
	}
	board_lists_request_obj = requests.get(url, headers=headers, params=params, timeout=1)
	if board_lists_request_obj.status_code != 200:
		raise TrelloRequestFailure(board_lists_request_obj.text)
	board_lists = board_lists_request_obj.json()

	board_members = get_board_members(headers, board_id)

	for board_list in board_lists:
		for card in board_list['cards']:
			card['members_info'] = []
			for card_member_id in card['idMembers']:
				member_info = next(filter(lambda member_item: member_item['id'] == card_member_id, board_members))
				card['members_info'] = member_info

	return board_lists


def get_board_members(headers, board_id):
	url = f"{settings.TRELLO_API_URL}/boards/{board_id}/members"

	board_members_request_obj = requests.get(url, headers=headers)
	if board_members_request_obj.status_code != 200:
		raise TrelloRequestFailure(board_members_request_obj.text)
	board_members = board_members_request_obj.json()

	return board_members


def get_board_cards(headers, board_id):
	url = f"{settings.TRELLO_API_URL}/boards/{board_id}"
	params = {
		'fields': 'id',
		'cards': 'all',
		'lists': 'all',
		'card_fields': 'closed,dueComplete,idList',
		'list_fields': 'name'
	}

	board_info_request_obj = requests.get(url, headers=headers, params=params)
	if board_info_request_obj.status_code != 200:
		raise TrelloRequestFailure(board_info_request_obj.text)

	board_info = board_info_request_obj.json()

	cards = []
	for card in board_info['cards']:
		card['list_name'] = next(filter(lambda board_list: board_list['id'] == card['idList'], board_info['lists']))[
			'name']
		cards.append(card)

	return cards


def add_board(team_id, board_short_id, user_token):
	headers = create_headers(user_token)
	board_id = get_board_id(board_short_id, headers)
	team = get_team(team_id)
	team.trello_board_id = board_id
	db.session.commit()

	return team.id


def get_board_id(board_short_id, headers):
	url = f"{settings.TRELLO_API_URL}/boards/{board_short_id}"
	params = {"fields": "id"}

	board_id_request_obj = requests.get(url, params=params, timeout=1, headers=headers)
	if board_id_request_obj.status_code != 200:
		raise TrelloRequestFailure(board_id_request_obj.text)

	return board_id_request_obj.json()['id']


def get_board_labels(board_id, headers):
	url = f"{settings.TRELLO_API_URL}/boards/{board_id}/labels"
	params = {"fields": "id,name"}

	labels = requests.get(url, params=params, timeout=1, headers=headers).json()
	labels_obj = {}
	for label in labels:
		if label['name'] != "":
			labels_obj[label['name']] = label['id']

	return labels_obj


def get_board_lists_ids(board_id, headers):
	url = f"{settings.TRELLO_API_URL}/boards/{board_id}/lists"
	params = {"fields": "id"}

	lists_ids_request_obj = requests.get(url, params=params, timeout=1, headers=headers)
	if lists_ids_request_obj.status_code != 200:
		raise TrelloRequestFailure(lists_ids_request_obj.text)

	lists_ids = lists_ids_request_obj.json()
	lists_ids = [list_obj['id'] for list_obj in lists_ids]

	return lists_ids


def copy_issue_to_trello_board_list(payload, user_token):
	url = f"{settings.TRELLO_API_URL}/cards"
	headers = create_headers(user_token)
	issue_id = payload['issue_id']
	del payload['issue_id']
	try:
		trello_api_request_obj = requests.post(url, data=payload, timeout=1, headers=headers)
		if trello_api_request_obj.status_code != 200:
			raise TrelloRequestFailure(trello_api_request_obj.text)

		created_card = trello_api_request_obj.json()
		issue_to_be_updated = Issue.query.filter(Issue.id == issue_id)
		issue_to_be_updated.trello_card_id = created_card['id']
		return created_card
	except Exception as e:
		raise e