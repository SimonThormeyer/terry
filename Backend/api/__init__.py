from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

app.config['MONGO_URI'] = 'mongodb://localhost:27017/database'
app.config['Mongo_DBNAME'] = 'Projects'
app.config['SECRET_KEY'] = 'secret_key'

mongo = PyMongo(app)
db = mongo.db
proj_col = db['Projects']



from api.routes import projects
app.register_blueprint(projects, url_prefix=os.environ['URL_PREFIX'])
