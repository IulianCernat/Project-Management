from database import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.String(256), nullable=False, unique=True)
    fullName = db.Column(db.String(256), nullable=False)
    avatar_url = db.Column(db.String(256))
    contact = db.Column(db.String(256))

    created_projects = db.relationship('Project', backref='users', lazy=True)

    def __init__(self, uid, fullName, avatar_url=None, contact=None):
        self.uid = uid
        self.fullName = fullName
        self.avatar_url = avatar_url
        self.contact = contact

    def __repr_(self):
        return "User {}".format(self.id)


class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256), nullable=False)
    description = db.Column(db.String(500), nullable=False)
    progress = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, nullable=False)

    product_owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def __init__(self, input_obj):
        self.name = input_obj['name']
        self.description = input_obj['description']
        self.progress = input_obj.setdefault('progress', None)
        self.created_at = datetime.fromisoformat(input_obj['created_at'])
        # TODO: fix datetime with utc
        self.product_owner_id = input_obj['product_owner_id']
