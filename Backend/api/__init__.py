from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)


mongo_host = os.environ['MONGO_HOST']
mongo = PyMongo(app, uri='mongodb://mongo:27017/Projects')
db = mongo.db
proj_col = db['Projects']


from api.routes import projects
app.register_blueprint(projects, url_prefix=os.environ['URL_PREFIX'])
