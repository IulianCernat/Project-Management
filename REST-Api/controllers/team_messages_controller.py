from database.models import TeamMessage
from database import db
from flask_sqlalchemy import sqlalchemy


def create_team_message(team_message_input):
    new_team_message = TeamMessage(team_message_input)
    db.session.add(new_team_message)
    db.session.commit()
    return new_team_message


def get_team_message(team_message_id):
    return TeamMessage.query.filter(TeamMessage.id == team_message_id).one()


def delete_team_message(team_message_id):
    team_message = get_team_message(team_message_id)
    db.session.delete(team_message)
    db.session.commit()


def get_all_team_messages(team_id):
    return TeamMessage.query.filter(TeamMessage.team_id == team_id).order_by(
        sqlalchemy.desc(TeamMessage.created_at)).all()
