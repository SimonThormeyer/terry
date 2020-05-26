from .responses import Standard200Response
from . import projects


@projects.route('/test', methods=['GET'])
def test():
    res = {'Res': 'Test was successful!'}
    return Standard200Response(res)
