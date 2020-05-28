from .responses import Standard200Response
from . import projects


@projects.route('/test', methods=['GET'])
def test():
    res = {'Res': 'Test was successful!'}
    return Standard200Response(res)


@projects.route('/user/<user_ID>', methods=['GET'])
def get_withUser(user_ID):
    # implement DB query etc
    res = {'User_ID': user_ID}

    return Standard200Response(res)


@projects.route('/project/<project_name>', methods=['GET'])
def get_withProjectName(project_name):
    # implement DB query etc
    res = {'Project Name': project_name}
    return Standard200Response(res)


@projects.route('/user/<user_ID>/project/<project_name>', methods=['GET'])
def get_withUserAndProject(user_ID, project_name):
    # implement DB query etc
    res = {'User_ID': user_ID,
           'Project_Name': project_name}
    return Standard200Response(res)


@projects.route('/user/<user_ID>/project/<project_name>', methods=['POST'])
def post_withUserAndProject(user_id, project_name):
    # implement DB query etc
    res = {'User_ID': user_id,
           'Project_Name': project_name,
           'Added to DB': True}
    return Standard200Response(res)


@projects.route('/remove/user/<user_ID>/project/<project_name>', methods=['DELETE'])
def delete_withUserAndProject(user_id, project_name):
    # implement DB query etc
    res = {'User_ID': user_id,
           'Project_Name': project_name,
           'deleted': True}
    return Standard200Response(res)
