from .responses import Standard200Response
from . import projects


@projects.route('/user/<user_ID>/project/<project_name>', methods=['POST'])
def post_withUserAndProject(user_id, project_name):
    # implement DB query etc
    res = {'User_ID': user_id,
           'Project_Name': project_name,
           'Added to DB': True}
    return Standard200Response(res)
