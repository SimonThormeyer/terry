from api import db
import datetime

class Project_doc(db.DynamicDocument):
    someVar = 1


class Project(db.Document):
    timestamp = db.DateTimeField(default=datetime.datetime.now)
    user_ID = db.StringField(max_length=5,required=True, unique=True,primary_key = True)
    project_name = db.StringField(max_length=255,required=True)
    projectJSON = db.EmbeddedDocumentField(Project_doc)
