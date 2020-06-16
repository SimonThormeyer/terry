from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
from flask_marshmallow import Marshmallow
import os

app = Flask(__name__)
CORS(app)


#mongo_host = os.environ['MONGO_HOST']
mongo = PyMongo(app, uri='mongodb://mongo:27017/Projects')
db = mongo.db
proj_col = db['Projects']
ma = Marshmallow(app)


from api.routes import projects
app.register_blueprint(projects, url_prefix=os.environ['URL_PREFIX'])
