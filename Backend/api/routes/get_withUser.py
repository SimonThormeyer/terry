from api import app
from .responses import Standard200Response
from . import projects


@projects.route('/<user_ID>', methods=['GET'])
def get_withUser(user_id):
    # implement DB query etc
    res = {'User_ID': user_id}
    return Standard200Response(res)