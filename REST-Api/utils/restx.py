import logging

from flask_restx import Api
from sqlalchemy.exc import IntegrityError
from werkzeug.exceptions import MethodNotAllowed, BadRequest
from utils.custom_exceptions import AuthorizationFailed
from sqlalchemy.orm.exc import NoResultFound
from flask_cors import cross_origin

log = logging.getLogger(__name__)

# For development cors is set to * for every route
api = Api(version='1.0', title="Projects management API",
          description="A REST api which serves as backend for the client side", decorators=[cross_origin()])


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


@api.errorhandler(IntegrityError)
def integrity_error(e):
    log.error(e)
    return {'message': "Foreign key check failure"}, 404


@api.errorhandler(BadRequest)
def bad_request_error(e):
    log.error(e)
    return {'message': "Bad request"}, 400


@api.errorhandler(Exception)
def default_error_handler(e):
    message = "An unhandled exception occurred"
    log.error(e)
    return {'message': message}, 500