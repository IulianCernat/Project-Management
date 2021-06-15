# Flask settings
# FLASK_SERVER_NAME = 'localhost:3000'
FLASK_DEBUG = False# Do not use debug mode in production

# Flask-Restplus settings
RESTX_SWAGGER_UI_DOC_EXPANSION = 'list'
RESTX_VALIDATE = True
RESTX_MASK_SWAGGER = False
RESTX_ERROR_404_HELP = False

# SQLAlchemy settings
# For development
SQLALCHEMY_DATABASE_URI = 'mariadb+pymysql://root:root@localhost:3306/projectsmanager'

SQLALCHEMY_TRACK_MODIFICATIONS = True