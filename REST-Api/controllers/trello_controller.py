import requests
import logging
import settings
from database.models import Team
from database import db
from controllers.teams_controller import get_team

log = logging.getLogger(__name__)
headers = {'Authorization': f'OAuth oauth_consumer_key="{settings.TRELLO_API_KEY}", '}


def get_board(board_id, params, user_token):
	headers['Authorization'] += f"oauth_token={user_token}"

	url = f"{settings.TRELLO_API_URL}/boards/{board_id}/lists"
	try:
		return requests.get(url, headers=headers, params=params, timeout=1)
	except Exception as e:
		log.error(e)
		return None


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