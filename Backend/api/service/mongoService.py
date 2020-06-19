from api import db
from bson.json_util import dumps

projs = db.projs
# proj_col = db['Project']
# proj_col2 = db.project2

def insert_ProjectWithProjectNameFromUser(project):
    post = projs.insert_one(project).inserted_id
    res = 'inserted with ObjectID ' + str(post)
    return dumps(res)

def query_ProjectsFromUser(user_ID):
    query = {'user_ID': user_ID}
    projects = []
    for post in projs.find(query):
        projects.append(post)
    projects.reverse()    
    return projects

def query_ProjectWithProjectName(project_name):
    query = {'project_name': project_name}
    projects = []
    for post in projs.find(query):
        projects.append(post)
    projects.reverse()    
    return dumps(projects)


def query_ProjectWithProjectNameFromUser(user_ID,project_name):
    query = {'user_ID': user_ID,
            'project_name': project_name}
    proj = projs.find_one(query)
    return dumps(proj)

def query_UserWithUserName(user_ID):
    query = {'user_ID': user_ID}
    user = projs.find_one(query)
    return user


def delete_ProjectWithProjectNameFromUser(user_ID,project_name):
    query = {'user_ID': user_ID,
            'project_name': project_name}
    res = projs.delete_one(query)
    return res

def query_AllProjects():
    return projs.find()


def check_ProjectName(user_ID, project_name):
    query = {'user_ID': user_ID,
            'project_name': project_name}
    if projs.count_documents(query) > 0:
        return False
    else: return True    

