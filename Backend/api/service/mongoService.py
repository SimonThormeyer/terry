# from Backend.api import proj_col
from api import db, app
import json
from bson.json_util import dumps

posts = db.posts

def insert_ProjectWithProjectNameFromUser(project):
    post = posts.insert_one(project).inserted_id
    res = 'inserted with ObjectID ' + str(post)
    return res

def query_ProjectsFromUser(user_ID):
    query = {'user_ID': user_ID}
    projects = []
    for post in posts.find(query):
        projects.append(post)
    projects.reverse()    
    return dumps(projects)

def query_ProjectWithProjectName(project_name):
    query = {'project_name': project_name}
    projects = []
    for post in posts.find(query):
        projects.append(post)
    projects.reverse()    
    return dumps(projects)


def query_ProjectWithProjectNameFromUser(user_ID,project_name):
    query = {'user_ID': user_ID,
            'project_name': project_name}
    projects = []
    for post in posts.find(query):
        projects.append(post)
    projects.reverse()    
    return dumps(projects)



def delete_ProjectWithProjectNameFromUser(user_ID,project_name):
    query = {'user_ID': user_ID,
            'project_name': project_name}
    res = posts.delete_one(query)
    return res 


# TODO: projekt muss hier noch mit rein 
def update_ProjectWithProjectNameFromUser(user_ID,project_name, newUser_ID, newProject_name):
    query = {'user_ID': user_ID,
            'project_name': project_name}
    newValue = { '$set': {'project_name': project_name,
            'user_ID': user_ID} }      


def query_AllProjects():
    allProjects = posts.find()
    projects = []
    for post in allProjects:
        projects.append(post)
    projects.reverse()    
    return dumps(projects)

def check_ProjectName(user_ID, project_name):
    query = {'user_ID': user_ID,
            'project_name': project_name}
    if posts.count_documents(query) > 0:
        return False
    else: return True    