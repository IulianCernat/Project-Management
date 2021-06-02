from database import db
from datetime import datetime
import zulu


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.String(255), nullable=False, unique=True)
    fullName = db.Column(db.String(255), nullable=False)
    avatar_url = db.Column(db.String(255))
    contact = db.Column(db.String(255))

    created_projects = db.relationship('Project', backref='users', lazy=True)
    created_issues = db.relationship('Issue', lazy='select',
                                backref=db.backref('creator_user_profile', lazy='joined'))

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
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(500), nullable=False)
    progress = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, nullable=False)

    product_owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    def __init__(self, input_obj):
        self.name = input_obj['name']
        self.description = input_obj['description']
        self.progress = input_obj.setdefault('progress', None)
        self.created_at = zulu.parse(input_obj['created_at']).datetime
        self.product_owner_id = input_obj['product_owner_id']


class Team(db.Model):
    __tablename__ = 'teams'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(5000), nullable=False)
    avatar_url = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, nullable=False)
    trello_board_id = db.Column(db.String(50))
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id', ondelete='cascade'), nullable=False)
    team_members = db.relationship('TeamMember', backref="teams", order_by="desc(TeamMember.user_type)", lazy=True)

    def __init__(self, input_obj):
        self.name = input_obj['name']
        self.description = input_obj['description']
        self.avatar_url = input_obj.get('avatar_url')
        self.created_at = zulu.parse(input_obj['created_at']).datetime
        self.project_id = input_obj['project_id']


class TeamMember(db.Model):
    __tablename__ = 'team_members'
    __table_args__ = (
        db.UniqueConstraint('user_id', 'team_id'),
    )
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id', ondelete='cascade'), nullable=False)
    user_type = db.Column(db.Enum('developer', 'scrumMaster'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)

    user_profile = db.relationship('User', backref="users", lazy=True)

    def __init__(self, input_obj):
        self.user_id = input_obj['user_id']
        self.team_id = input_obj['team_id']
        self.user_type = input_obj['user_type']
        self.created_at = zulu.parse(input_obj['created_at']).datetime


class Issue(db.Model):
    __tablename__ = 'issues'
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.Enum('story', 'bug', 'task'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(500))
    priority = db.Column(db.Enum('1', '2', '3', '4', '5'), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)

    project_id = db.Column(db.Integer, db.ForeignKey('projects.id', ondelete='cascade'), nullable=False)
    creator_user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    sprint_id = db.Column(db.Integer, db.ForeignKey('sprints.id', ondelete='cascade'), nullable=True)
    status = db.Column(db.Enum("pending", "done", "inProgress"), default="pending", nullable=False)

    def __init__(self, input_obj):
        self.type = input_obj['type']
        self.title = input_obj['title']
        self.description = input_obj['description']
        self.priority = input_obj['priority']
        self.created_at = zulu.parse(input_obj['created_at']).datetime
        self.project_id = input_obj['project_id']
        self.creator_user_id = input_obj['creator_user_id']


class Sprint(db.Model):
    __tablename__ = 'sprints'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    duration = db.Column(db.Enum('1', '2', '3', '4'), nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    goal = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)
    start = db.Column(db.Boolean, default=False, nullable=False)
    completed = db.Column(db.Boolean, default=False, nullable=False)
    user_creator_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id', ondelete='cascade'), nullable=False)

    issues = db.relationship('Issue', backref='issues', lazy=True)

    def __init__(self, input_obj):
        self.name = input_obj['name']
        self.start_date = zulu.parse(input_obj['start_date']).datetime
        self.duration = input_obj['duration']
        self.end_date = zulu.parse(input_obj['end_date']).datetime
        self.goal = input_obj['goal']
        self.created_at = zulu.parse(input_obj['created_at']).datetime
        self.user_creator_id = input_obj['user_creator_id']
        self.project_id = input_obj['project_id']