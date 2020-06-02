from Backend.api.service import mongoService as mS
from Backend.api.routes import responses
from Backend.api import proj_col

def post_ProjectWithProjectNameFromUser(user_ID, project_name, project):
    res = mS.insert_ProjectWithProjectNameFromUser(user_ID, project_name, project)
    return responses.Standard200Response(res)

def get_ProjectsFromUser(user_ID):
    res = mS.query_ProjectsFromUser(user_ID)
    if res.count == 0:
        return responses.Standard404ErrorResponse
    return responses.Standard200Response(res)

def get_ProjectWithProjectName(project_name):
    res = mS.query_ProjectWithProjectName(project_name)
    if res.count == 0:
        return responses.Standard404ErrorResponse
    return responses.Standard200Response(res)

def get_ProjectWithProjectNameFromUser(user_ID,project_name):
    res = mS.query_ProjectWithProjectNameFromUser(user_ID,project_name)
    if res.count == 0:
        return responses.Standard404ErrorResponse
    return responses.Standard200Response(res)

def delete_ProjectWithProjectNameFromUser(user_ID,project_name):
    query = {"project_name": project_name,
            "user_ID": user_ID}
    res = proj_col.delete_one(query)
    return responses.Standard200Response(res)


# TODO: projekt muss hier noch mit rein 
def update_ProjectWithProjectNameFromUser(user_ID,project_name, newUser_ID, newProject_name):
    res = mS.update_ProjectWithProjectNameFromUser(user_ID, project_name, newUser_ID, newProject_name)
    return responses.Standard200Response(res)  

# idk ob wir das brauchen
def get_AllProjects():
    res = mS.query_AllProjects()
    if res.count == 0:
        return responses.Standard404ErrorResponse
    return responses.Standard200Response(res)
