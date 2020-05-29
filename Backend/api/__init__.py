from flask import Flask
from flask_cors import CORS
import os
import pymongo

app = Flask(__name__)
CORS(app)

from api.routes import projects
app.register_blueprint(projects, url_prefix=os.environ['URL_PREFIX'])
