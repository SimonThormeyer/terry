from api.service import mongoService as Service
from api.routes import responses

def post_ProjectWithProjectNameFromUser(project):
    res = Service.insert_ProjectWithProjectNameFromUser(project)
    return responses.Standard200Response(res)

def get_ProjectsFromUser(user_ID):
    res = Service.query_ProjectsFromUser(user_ID)
    if res.count == 0:
        return responses.Standard404ErrorResponse
    return responses.Standard200Response(res)

def get_ProjectWithProjectName(project_name):
    res = Service.query_ProjectWithProjectName(project_name)
    if res.count == 0:
        return responses.Standard404ErrorResponse
    return responses.Standard200Response(res)

def get_ProjectWithProjectNameFromUser(user_ID,project_name):
    res = Service.query_ProjectWithProjectNameFromUser(user_ID,project_name)
    if res.count == 0:
        return responses.Standard404ErrorResponse
    return responses.Standard200Response(res)

def delete_ProjectWithProjectNameFromUser(user_ID,project_name):
    query = {"project_name": project_name,
            "user_ID": user_ID}
    res = Service.delete_ProjectWithProjectNameFromUser(user_ID,project_name)
    return responses.Standard200Response(res)


def update_ProjectWithProjectNameFromUser(user_ID,project_name, project):
    res = Service.update_ProjectWithProjectNameFromUser(user_ID, project_name, project)
    return responses.Standard200Response(res)  

def get_AllProjects():
    res = Service.query_AllProjects()
    if res.count == 0:
        return responses.Standard404ErrorResponse
    return str(res)
