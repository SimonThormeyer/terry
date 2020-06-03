from .responses import Standard200Response
from . import projects


@projects.route('/project/<project_name>', methods=['GET'])
def get_withProjectName(project_name):
    # implement DB query etc
    res = {'Project Name': project_name}
    return Standard200Response(res)
