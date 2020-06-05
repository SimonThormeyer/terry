from . import projects
from flask import request
from .responses import Standard200Response
import api.controller.mongoController as Controller
from api.models.models import Project


@projects.route('/test', methods=['GET'])
def test():
    res = {'Res': 'Test was successful!'}
    return Standard200Response(res)


@projects.route('/user/<user_ID>', methods=['GET'])
def get_withUser(user_ID):
    res = Controller.get_ProjectsFromUser(user_ID)
    return res


@projects.route('/project/<project_name>', methods=['GET'])
def get_withProjectName(project_name):
    res = Controller.get_ProjectWithProjectName(project_name)
    return res

@projects.route('/all', methods=['GET'])
def get_allProjects():
    res = Controller.get_AllProjects()
    return res

@projects.route('/user/<user_ID>/project/<project_name>', methods=['GET'])
def get_withUserAndProject(user_ID, project_name):
    res = Controller.get_ProjectWithProjectNameFromUser(user_ID, project_name)
    return res


@projects.route('/user/<user_ID>/project/<project_name>', methods=['POST'])
def post_withUserAndProject(user_ID, project_name):
    proj = request.get_json()
    project = Project(user_ID, project_name, proj).to_json()
    # Check if project is a HTTP 400 Status Code
    if isinstance(project, tuple):
        return project
    else: 
        res = Controller.post_ProjectWithProjectNameFromUser(project)
        return res


@projects.route('/remove/user/<user_ID>/project/<project_name>', methods=['DELETE'])
def delete_withUserAndProject(user_ID, project_name):
    res = Controller.delete_ProjectWithProjectNameFromUser(user_ID, project_name)
    return res
