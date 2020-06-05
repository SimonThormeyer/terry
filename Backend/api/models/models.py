import datetime
import json
from api.service.mongoService import check_ProjectName
from api.routes.responses import Standard400ErrorResponse



class Project():

    def __init__(self, user_ID, project_name, project):
        self.timestamp: str = str(datetime.datetime.now())
        self.user_ID: str = user_ID
        self.project_name: str = project_name
        self.project = project

    def to_json(self):
        if not check_ProjectName(self.user_ID, self.project_name):
            return Standard400ErrorResponse('Oooops, project_name already in use')
        elif len(self.user_ID) > 5 or len(self.project_name) > 255:
            return Standard400ErrorResponse('Oooops, user_ID (5) or project_name (255) too long')
        try:
            json_object = json.dumps(self.project)
        except ValueError as e:
            return Standard400ErrorResponse('Oooops, Body is not a valid JSON') 

        content = {
            'timestamp': self.timestamp,
            'user_ID': self.user_ID,
            'project_name': self.project_name,
            'project': self.project
        }
        return content