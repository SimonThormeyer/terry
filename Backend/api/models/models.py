import uuid
from datetime import datetime, timezone

from flask_marshmallow.fields import Hyperlinks, URLFor
from marshmallow import post_load, pre_dump, Schema, fields, pre_load, ValidationError
import pytz
import json

from api.service import mongoService as Service
from api.routes.responses import Standard400ErrorResponse
from api import ma, log
from bson.json_util import dumps,loads


# define the Output format

class UserSchema(Schema):
    # this class validates the incoming json and creates hyperlinks to connected routes and states
    user_ID = fields.Str()
    amount_of_projects = fields.Integer()
    items = fields.Raw()

    _links = Hyperlinks({
        'self': URLFor('projects.getUser', user_ID='<user_ID>'),
        'projects': URLFor('projects.get_withUser', user_ID='<user_ID>')
    })
    @pre_dump
    def init_params(self, data,**kwargs):
        # get the projects from the user
        # wrap them with hyperlinks
        # sort the by timestamp
        # count the amount
        userstr = data.get("user_ID")
        projects = []
        temp = Service.query_ProjectsFromUser(userstr)
        log.info('this is the tempdata from userschema')
        log.info(temp)
        newdata = {}
        for project in temp:
            try:
                projects.append(generateProjectLinks(project))
            except ValidationError as e:
                log.info('validator.errors')
                log.info('this data is correct')
                log.info(e.valid_data)
                log.info('this data is not correct')
                log.info(validateProject(project))
                return Standard400ErrorResponse('Oooops, This Request is not valid', validateProject(project))
        newdata['items'] = sorted(projects, key=lambda timestamp: timestamp['timestamp'])
        newdata['amount_of_projects'] = len(newdata['items'])
        newdata['user_ID'] = userstr
        log.info('newdata predump')
        log.info(newdata)
        data = newdata

        return data


class ProjectSchema(Schema):
    _id = fields.Str()
    timestamp = fields.Str()
    user_ID = fields.Str(required=True)
    project_name = fields.Str(required=True)
    project_data = fields.Raw()

    _links = Hyperlinks({
        'self': URLFor("projects.get_withUserAndProject", user_ID='<user_ID>', project_name='<project_name>'),
        'owner': URLFor("projects.getUser", user_ID='<user_ID>')
    })


def generateUserlinks(data):
    log.info('data before Userschema dump')
    log.info(data)
    res = UserSchema().dumps(data)
    log.info('data after Userschema dump')
    log.info(res)
    return loads(res)


def generateProjectLinks(data):
    ProjectSchema().load(data)
    res = ProjectSchema(exclude=['_id']).dumps(data)
    return loads(res)


def validateProject(data):
    # validate the schema for storage
    return ProjectSchema().validate(data)

def validateUser(data):
    # validate the schema for storage
    return UserSchema().validate(data)


class ProjectModel():

    def __init__(self, user_ID, project_name, project_data, _id: str = None):
        local_tz = pytz.timezone('Europe/Berlin')
        self._id = datetime.now(local_tz).isoformat(timespec='microseconds')
        self.timestamp: str = datetime.now(local_tz).strftime("%d.%m.%Y, %H:%M:%S")
        self.user_ID: str = user_ID
        self.project_name: str = project_name
        self.project_data = project_data
        self._id = _id or uuid.uuid4().hex

    def to_json(self):
        if not Service.check_ProjectName(self.user_ID, self.project_name):
            return Standard400ErrorResponse('Oooops, project_name already in use')
        elif len(self.user_ID) > 15 or len(self.project_name) > 255:
            return Standard400ErrorResponse('Oooops, user_ID (5) or project_name (255) too long')
        try:
            json_object = json.dumps(self.project_data)
        except ValueError as e:
            return Standard400ErrorResponse('Oooops, Body is not a valid JSON')

        content = {
            '_id': self._id,
            'timestamp': self.timestamp,
            'user_ID': self.user_ID,
            'project_name': self.project_name,
            'project_data': self.project_data
        }
        return content