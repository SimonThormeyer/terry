from flask import Blueprint
projects = Blueprint('projects', __name__)

from .routes import get_withProjectName, get_withUser, get_withUserAndProject, post_withUserAndProject, get_allProjects, test, testfillDB, testdb, getUser
