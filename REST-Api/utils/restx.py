import logging
import traceback

from flask_restx import Api
from werkzeug.exceptions import MethodNotAllowed
from utils.custom_exceptions import AuthorizationFailed
import settings
from sqlalchemy.orm.exc import NoResultFound

log = logging.getLogger(__name__)

api = Api(version='1.0', title="Projects management API",
          description="A REST api which serves as backend for the client side")


@api.errorhandler(NoResultFound)
def database_not_found_error_handler(e):
    log.warning(e)
    return {'message': "A database result was required but none was found"}, 404


@api.errorhandler(MethodNotAllowed)
def method_not_allowed(e):
    log.error(e)
    return {'message': 'Method not allowed'}, 405

@api.errorhandler(AuthorizationFailed)
def authorization_failed(e):
    log.warning(e)
    return {'message': f"{e}"}, 401

@api.errorhandler
def default_error_handler(e):
    message = "An unhandled exception occurred"
    log.error(e)
    return {'message': message}, 500
