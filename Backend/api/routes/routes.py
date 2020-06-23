import collections

from flask_marshmallow.fields import Hyperlinks, URLFor
from marshmallow import ValidationError
from flask import Response, url_for
from api.service import mongoService as Service
from . import responses
from . import projects
from flask import request
from .responses import Standard200Response, Standard400ErrorResponse
from api.models.models import ProjectModel, validateProject, generateProjectLinks, generateUserlinks, validateUser
from api import log
import json
from bson.json_util import dumps, loads


#Routes for testing
@projects.route('/test', methods=['GET'])
def test():
    res = {'Res': 'Test was successful!'}
    return Standard200Response(res)

@projects.route('/testfilldb', methods=['GET'])
def testfillDB():
    initDB()
    res = {'Res': 'DBTest was successful!'}
    return Standard200Response(res)

@projects.route('/testdb', methods=['GET'])
def testdb():
    projdata = {"loop":"first","starttime":30,"events":[ "time1", "time2", "time3" ]}

    project = ProjectModel("tuse2", "testproject2", projdata).to_json()

    try:
        res = generateProjectLinks(project)
        return Standard200Response(res)

    except ValidationError as e:
        log.info('validator.errors')
        log.info('this data is correct')
        log.info(e.valid_data)
        log.info('this data is not correct')
        log.info(validateProject(project))
        return Standard400ErrorResponse('Oooops, This Request is not valid', validateProject(project))

@projects.route('/all', methods=['GET'])
def get_allProjects():
    temp = Service.query_AllProjects()
    log.info('show all projects:')
    log.info(temp)
    projects = []
    res = {}
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
    res['items'] = projects
    res['self'] = url_for('projects.get_allProjects')
    return Standard200Response(res)

@projects.route('/user/<user_ID>', methods=['GET'])
def getUser(user_ID):
    temp = Service.query_UserWithUserName(user_ID)
    try:
        res = generateUserlinks(temp)
        return Standard200Response(res)
    except ValidationError as e:
        log.info('validator.errors')
        log.info('this data is correct')
        log.info(e.valid_data)
        log.info('this data is not correct')
        log.info(validateUser(res))
        return Standard400ErrorResponse('Oooops, This Request is not valid', validateUser(user))

@projects.route('user/<user_ID>/allprojects')
def get_withUser(user_ID):
    temp  = Service.query_ProjectsFromUser(user_ID)
    projects = []
    res = {}
    if temp.count == 0:
        return responses.Standard404ErrorResponse()
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
    res['items'] = projects
    res['self'] = url_for('projects.get_withUser', user_ID=user_ID)
    return Standard200Response(res)

@projects.route('/project/<project_name>', methods=['GET'])
def get_withProjectName(project_name):
    temp = Service.query_ProjectWithProjectName(project_name)
    log.info('route get_withProjectName')
    projects = []
    res = {}
    if temp.count == 0:
        return responses.Standard404ErrorResponse()
    for project in temp:
        try:
            log.info(project)
            projects.append(generateProjectLinks(project))
        except ValidationError as e:
            log.info('validator.errors')
            log.info('this data is correct')
            log.info(e.valid_data)
            log.info('this data is not correct')
            log.info(validateProject(project))
            return Standard400ErrorResponse('Oooops, This Request is not valid', validateProject(project))
    res['items'] = projects
    res['self'] = url_for('projects.get_withProjectName', project_name=project_name)
    return Standard200Response(res)

@projects.route('/user/<user_ID>/project/<project_name>', methods=['GET'])
def get_withUserAndProject(user_ID, project_name):
    projects = []
    res = {}
    temp = Service.query_ProjectWithProjectNameFromUser(user_ID, project_name)
    if temp == None:
        return responses.Standard404ErrorResponse()

    projects = generateProjectLinks(temp)
    res['items'] = projects
    res['self'] = url_for('projects.get_withUserAndProject',user_ID=user_ID, project_name=project_name)
    return Standard200Response(res)


@projects.route('/user/<user_ID>/project/<project_name>', methods=['POST'])
def post_withUserAndProject(user_ID, project_name):
    proj = request.get_json()
    project = ProjectModel(user_ID, project_name, proj).to_json()
    # Check if project is a HTTP 400 Status Code
    if isinstance(project, tuple):
        return project
    else:
        Service.insert_ProjectWithProjectNameFromUser(project)
        projects = []
        res = {}
        projects = generateProjectLinks(project)
        res['items'] = projects
        res['self'] = url_for('projects.get_withUserAndProject', user_ID=user_ID, project_name=project_name)
        return Standard200Response(res)




@projects.route('/user/<user_ID>/project/<project_name>', methods=['DELETE'])
def delete_withUserAndProject(user_ID, project_name):
    res = Service.delete_ProjectWithProjectNameFromUser(user_ID, project_name)
    return Standard200Response(res)

#just for testing
def initDB():
    projdata = {"loop": "first", "starttime": 30, "events": ["time1", "time2", "time3"]}
    project = ProjectModel("testuser1", "testproject1", projdata).to_json()
    Service.insert_ProjectWithProjectNameFromUser(project)
    projdata = {"loop": "first", "starttime": 30, "events": ["time1", "time2", "time3"]}
    project = ProjectModel("testuser2", "testproject1", projdata).to_json()
    Service.insert_ProjectWithProjectNameFromUser(project)
    projdata = {"loop": "first", "starttime": 30, "events": ["time1", "time2", "time3"]}
    project = ProjectModel("testuser3", "testproject1", projdata).to_json()
    Service.insert_ProjectWithProjectNameFromUser(project)
    projdata = {"loop": "first", "starttime": 30, "events": ["time1", "time2", "time3"]}
    project = ProjectModel("testuser4", "testproject1", projdata).to_json()
    Service.insert_ProjectWithProjectNameFromUser(project)
    projdata = {"loop": "first", "starttime": 30, "events": ["time1", "time2", "time3"]}
    project = ProjectModel("testuser4", "testproject2", projdata).to_json()
    Service.insert_ProjectWithProjectNameFromUser(project)
    return None