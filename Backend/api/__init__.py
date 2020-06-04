from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
# from pymongo import PyMongo
import os

app = Flask(__name__)
CORS(app)

# app.config['MONGO_URI'] = 'mongodb://localhost:27017/'
# app.config['Mongo_DBNAME'] = 'Projects'
# app.config['SECRET_KEY'] = 'secret_key'
mongo_host = os.environ['MONGO_HOST']
mongo = PyMongo(app, uri='mongodb://mongo:27017/Projects')
db = mongo.db
proj_col = db['Projects']
# mongo = PyMongo(app)
# db = mongo.db
# proj_col = db['Projects']



#from Backend.api.routes import projects
from api.routes import projects
app.register_blueprint(projects, url_prefix=os.environ['URL_PREFIX'])
