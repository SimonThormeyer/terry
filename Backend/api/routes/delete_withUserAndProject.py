from .responses import Standard200Response
from . import projects


@projects.route('/remove/user/<user_ID>/project/<project_name>', methods=['DELETE'])
def delete_withUserAndProject(user_id, project_name):
    # implement DB query etc
    res = {'User_ID': user_id,
           'Project_Name': project_name,
           'deleted': True}
    return Standard200Response(res)
