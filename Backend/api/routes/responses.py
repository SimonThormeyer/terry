from flask_api import status
from flask import jsonify


def Test(content):
    return content


def Standard200Response(content):
    content = jsonify(content)
    return content, status.HTTP_200_OK


def Standard404ErrorResponse():
    return "the resource does not exist", status.HTTP_404_NOT_FOUND


def Standard500ErrorResponse():
    return "an unexpected error occured", status.HTTP_INTERNAL_SERVER_ERROR