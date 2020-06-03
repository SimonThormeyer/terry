from Backend.api import db
import datetime


class Project(db.Document):
    timestamp = db.DateTimeField(default=datetime.datetime.now)
    user_ID = db.StringField(max_length=5,required=True, unique=True,primary_key = True)
    project_name = db.StringField(max_length=255,required=True)
    projectJSON = db.EmbeddedDocumentField().from_json()
    #projectJSON = db.DynamicDocument()

# db.DynamicDocument : allows unvalidated dynamic objects

# class Page(Document):
#     comments = ListField(EmbeddedDocumentField(Comment))

# comment1 = Comment(content='Good work!')
# comment2 = Comment(content='Nice article!')
# page = Page(comments=[comment1, comment2])