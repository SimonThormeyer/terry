# from Backend.api import proj_col
from Backend.api import db
from Backend.api.Models import Project


def insert_ProjectWithProjectNameFromUser(user_ID,project_name, project):
    #TODO: Error handling when the req dont validate
    proj = {"project_name": project_name,
            "user_ID": user_ID,
            "project": project}
    project = Project(proj).save()
    res = project
    return res

def query_ProjectsFromUser(user_ID):
    res = Project.objects.get(user_ID=user_ID)
    return res

def query_ProjectWithProjectName(project_name):
    res = Project.objects.get(project_name=project_name)
    return res

def query_ProjectWithProjectNameFromUser(user_ID,project_name):

    res = Project.objects.get(project_name=project_name,user_ID=user_ID)
    return res

def delete_ProjectWithProjectNameFromUser(user_ID,project_name):

    res = Project.objects.get(project_name=project_name,user_ID=user_ID).delete()
    return res


def update_ProjectWithProjectNameFromUser(user_ID,project_name, project):
    newProj = {"project_name": project_name,
            "user_ID": user_ID, "project": project}
    res = Project.objects.get(project_name=project_name,user_ID=user_ID).update(newProj)
    return res   

# idk ob wir das brauchen
def query_AllProjects():
    return Project.objects().to_json()


# Limit results with .limit()
# myresult = mycol.find().limit(5)