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

#mongo_host = os.environ['MONGO_HOST']
mongo = PyMongo(app, uri='mongodb://mongo:27017/Projects')
db = mongo.db



log.info('list collections')
for x in db.list_collection_names():
  log.info(len(x))
  log.info(str(x))
log.info(str(db.list_collection_names()))

# client = MongoClient()
# db2 = client.projects
#
# log.info(client.list_databases())
# log.info(db2.list_collection_names())
#db2.drop_collection('Projects')
#proj_col = db['Projects']

# client = pymongo.MongoClient("localhost:27017")
# log.info('Client '+ str(client))
# db = client["projects"]
# log.info('DB '+str(db))
# mycol = db["project"]
# log.info("List of collections \n--------------------------")
# for x in db.list_collection_names():
#   log.info(len(x))
#   log.info(x)


ma = Marshmallow(app)


from api.routes import projects
app.register_blueprint(projects, url_prefix=os.environ['URL_PREFIX'])
