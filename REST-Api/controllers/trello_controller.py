import requests
import logging
import settings
from database.models import Team
from database import db
from controllers.teams_controller import get_team

log = logging.getLogger(__name__)
headers = {'Authorization': f'OAuth oauth_consumer_key="{settings.TRELLO_API_KEY}", '}


def get_board(board_id, user_token, data_arrangement):
	headers['Authorization'] += f"oauth_token={user_token}"
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
	board_lists = requests.get(url, headers=headers, params=params, timeout=1).json()
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
	return requests.get(url, headers=headers).json()


def get_board_cards(headers, board_id):
	url = f"{settings.TRELLO_API_URL}/boards/{board_id}"
	params = {
		'fields': 'id',
		'cards': 'all',
		'lists': 'all',
		'card_fields': 'closed,dueComplete,idList',
		'list_fields': 'name'
	}

	board_info = requests.get(url, headers=headers, params=params)
	board_info = board_info.json()

	cards = []
	for card in board_info['cards']:
		card['list_name'] = next(filter(lambda board_list: board_list['id'] == card['idList'], board_info['lists']))[
			'name']
		cards.append(card)

	return cards


def add_board(team_id, board_short_id, user_token):
	headers['Authorization'] += f"oauth_token={user_token}"
	board_id = get_board_id(board_short_id, headers)
	team = get_team(team_id)
	team.trello_board_id = board_id
	db.session.commit()

	return team.id


def get_board_id(board_short_id, headers):
	url = f"{settings.TRELLO_API_URL}/boards/{board_short_id}"
	params = {"fields": "id"}
	try:
		return requests.get(url, params=params, timeout=1, headers=headers).json()['id']
	except Exception as e:
		log.error(e)
		return None


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

	lists_ids = requests.get(url, params=params, timeout=1, headers=headers).json()
	lists_ids = [list_obj['id'] for list_obj in lists_ids]

	return lists_ids