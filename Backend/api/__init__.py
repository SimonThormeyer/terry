from flask import Flask
from flask_pymongo import PyMongo
import pymongo
from flask_cors import CORS
from flask_marshmallow import Marshmallow
import os

app = Flask(__name__)
log = app.logger
CORS(app)
log = app.logger


mongo = PyMongo(app, uri='mongodb://mongo:27017/Projects')
db = mongo.db
ma = Marshmallow(app)


from api.routes import projects
app.register_blueprint(projects, url_prefix=os.environ['URL_PREFIX'])
