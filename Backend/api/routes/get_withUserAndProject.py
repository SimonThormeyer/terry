from .responses import Standard200Response
from . import projects


@projects.route('/user/<user_ID>/project/<project_name>', methods=['GET'])
def get_withUserAndProject(user_ID, project_name):
    # implement DB query etc
    res = {'User_ID': user_ID,
           'Project_Name': project_name}
    return Standard200Response(res)
