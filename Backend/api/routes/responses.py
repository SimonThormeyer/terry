from flask_api import status
from bson.json_util import dumps

from api import log


def Standard200Response(content):
    return content, status.HTTP_200_OK


def Standard404ErrorResponse():
    return "the resource does not exist", status.HTTP_404_NOT_FOUND


def Standard400ErrorResponse(content,body={}):
    content = dumps(content)
    body = dumps(body)
    content =  content + body
    log.info(content)
    return content, status.HTTP_400_BAD_REQUEST

def Standard500ErrorResponse():
    return "an unexpected error occured", status.HTTP_INTERNAL_SERVER_ERROR
