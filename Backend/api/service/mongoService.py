from api import db
from bson.json_util import dumps

posts = db.posts

def insert_ProjectWithProjectNameFromUser(project):
    post = posts.insert_one(project).inserted_id
    res = 'inserted with ObjectID ' + str(post)
    return dumps(res)

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
    proj = posts.find_one(query)
    return dumps(proj)



def delete_ProjectWithProjectNameFromUser(user_ID,project_name):
    query = {'user_ID': user_ID,
            'project_name': project_name}
    res = posts.delete_one(query)
    return res 


def query_AllProjects():
    projects = []
    for post in posts.find():
        projects.append(post)
    projects.reverse()    
    return dumps(projects)


def check_ProjectName(user_ID, project_name):
    query = {'user_ID': user_ID,
            'project_name': project_name}
    if posts.count_documents(query) > 0:
        return False
    else: return True    

