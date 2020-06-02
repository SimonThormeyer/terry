from Backend.api import proj_col


def insert_ProjectWithProjectNameFromUser(user_ID,project_name, project):
    proj = {"project_name": project_name,
            "user_ID": user_ID,
            "project": project}
    res = proj_col.insert_one(proj)
    return res 

def query_ProjectsFromUser(user_ID):
    query = {"user_ID": user_ID}
    res = proj_col.find(query)
    return res 

def query_ProjectWithProjectName(project_name):
    query = {"project_name": project_name}
    res = proj_col.find(query)
    return res 

def query_ProjectWithProjectNameFromUser(user_ID,project_name):
    query = {"project_name": project_name,
            "user_ID": user_ID}
    res = proj_col.find(query)
    return res 

def delete_ProjectWithProjectNameFromUser(user_ID,project_name):
    query = {"project_name": project_name,
            "user_ID": user_ID}
    res = proj_col.delete_one(query)
    return res 


# TODO: projekt muss hier noch mit rein 
def update_ProjectWithProjectNameFromUser(user_ID,project_name, newUser_ID, newProject_name, project):
    query = {"project_name": project_name,
            "user_ID": user_ID}
    newValue = { "$set": {"project_name": project_name,
            "user_ID": user_ID, "project": project} }     
    res = proj_col.update_one(query, newValue)      
    return res   

# idk ob wir das brauchen
def query_AllProjects():
    return proj_col.find()


# Limit results with .limit()
# myresult = mycol.find().limit(5)