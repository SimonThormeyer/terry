from flask import Blueprint
projects = Blueprint('projects', __name__)

from .routes import delete_withUserAndProject, get_withProjectName, get_withUser, get_withUserAndProject, post_withUserAndProject, test
