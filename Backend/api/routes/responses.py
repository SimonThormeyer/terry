from flask_api import status
from flask import jsonify
from bson.json_util import dumps


def Standard200Response(content):
    content = dumps(content)
    return content, status.HTTP_200_OK


def Standard404ErrorResponse():
    return "the resource does not exist", status.HTTP_404_NOT_FOUND


def Standard400ErrorResponse(content):
    return content, status.HTTP_400_BAD_REQUEST

def Standard500ErrorResponse():
    return "an unexpected error occured", status.HTTP_INTERNAL_SERVER_ERROR