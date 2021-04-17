from database import db


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    uid = db.Column(db.String(256), nullable=False, unique=True)
    fullName = db.Column(db.String(256), nullable=False)
    avatar_url = db.Column(db.String(256))
    contact = db.Column(db.String(256))

    def __init__(self, uid, fullName, avatar_url=None, contact=None):
        self.uid = uid
        self.fullName = fullName
        self.avatar_url = avatar_url
        self.contact = contact

        def __repr_(self):
            return "User {}".format(self.id)
