from .responses import Standard200Response
from . import projects


@projects.route('/user/<user_ID>', methods=['GET'])
def get_withUser(user_ID):
    # implement DB query etc
    res = {'User_ID': user_ID}

    return Standard200Response(res)
