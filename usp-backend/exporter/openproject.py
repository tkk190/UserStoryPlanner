import requests
import toml

from models.database.story import Story
from models.database.step import Step
from models.database.project import Project
from models.database.activity import Activity
from models.database.status_history import StatusHistory
from sqlmodel import select, create_engine, Session

con_string = ""
with open('config/be_config.toml', mode="r", encoding='utf-8') as f:
    config = toml.load(f)

if config["db_type"] == 'postgres':
    con_string = config["db_connection_string"]
elif config["db_type"] == 'sqlite':
    sqlite_file_name = "../database.sqlite"
    con_string = f"sqlite:///{sqlite_file_name}?check_same_thread=False"

engine = create_engine(con_string)

project_number = config["openproject_project_number"]
url = config["openproject_url"]
url_versions = f"https://{url}/api/v3/projects/{project_number}/versions"
url_categories = f"https://{url}/api/v3/projects/{project_number}/categories"
url_work_packages = f"https://{url}/api/v3/projects/{project_number}/work_packages"
token = f'Basic {config["openproject_token"]}'


def get_project_id(story_project_name):
    r = requests.get(url_categories, headers={"Authorization": token}, verify=False)
    res = r.json()
    elements = res['_embedded']['elements']
    for element in elements:
        if element['name'] == story_project_name:
            return element['id']
    return None

def create_request_body_task(task_name, project, story_id):
    request_body = {
        "subject": f"{task_name}",
        "category": {
            "href": f"/api/v3/categories/{project.openproject_id}",
            "title": project.name
        },
        "type": {
            "href": "/api/v3/types/1",
            "title": "Task"
        },
        "_links": {
            "parent": {
                "href": f"/api/v3/work_packages/{story_id}"
            }
        }

    }
    return request_body


def create_request_body_story(step, story, project, version):
    request_body = {
        "subject": f"{step.name}/{story.name}",
        "category": {
            "href": f"/api/v3/categories/{project.openproject_id}",
            "title": project.name
        },
        "description": {
            "format": "markdown",
            "raw": f"#### Description/Beschreibung \n {story.description} \n \n --- \n #### Definition of Done \n {story.definition_of_done} \n \n --- \n #### Definition of Ready \n {story.definition_of_ready}",
            "html": ""
        },
        "storyPoints": f"{story.story_points}",
        "type": {
            "href": "/api/v3/types/6",
            "title": "User story"
        }
    }
    if version is not None:
        request_body['version'] = {
                "href": f"/api/v3/versions/{version.id}",
                "title": version.name
              }
    return request_body

def create_request_body_simple(name, version=None):
    request_body = {
        "subject": name,
        "type": {
            "href": "/api/v3/types/6",
            "title": "User story"
        }
    }
    if version is not None:
        request_body['version'] = {
                "href": f"/api/v3/versions/{version['id']}",
                "title": version.name
              }
    return request_body



def create_relation(story_id, task_id):
    request_body = {
        "_links":
            {
                "from": {
                    "href": f"/api/v3/work_packages/{task_id}"
                },
                "to": {
                    "href": f"/api/v3/work_packages/{story_id}"
                }
            },
        "type": "relates"
    }
    print(request_body)

    url_create_relation = f"https://{url}/api/v3/work_packages/{story_id}/relations"
    r = requests.post(
        url=url_create_relation,
        headers={
            'Authorization': token,
            'content-type': 'application/json'
        },
        json=request_body,
        verify=False
    )
    print(r)
    result = r.json()
    print(result)

    return result['id']


def create_version(version_name):
    #check if version exists
    r = requests.get(url_versions, headers={"Authorization": token}, verify=False)
    res = r.json()
    elements = res['_embedded']['elements']
    for element in elements:
        if element['name'] == version_name:
            return {'id': element['id'], 'name': version_name}

    #create new version
    url_create_version = f"https://{url}/api/v3/versions"
    r = requests.post(
        url=url_create_version,
        headers={
            'Authorization': token,
            'content-type': 'application/json'
        },
        json= {
            "name": version_name,
            "definingProject": {
                "href": "/api/v3/projects/19",
                "title": "SCRUM"
            }
        },
        verify=False
    )
    print(r)
    result = r.json()
    print(result)
    version = {'id': result['id'], 'name': version_name}
    create_work_package_in_openproject(create_request_body_simple('Sonstiges', version))
    return version



def create_work_package_in_openproject(request_body):
    r = requests.post(
        url=url_work_packages,
        headers={
            'Authorization': token,
            'content-type': 'application/json'
        },
        json=request_body,
        verify=False
    )
    result = r.json()

    return result['id']

def update_work_package_in_openproject(request_body, id):
    r = requests.get(
        url=f"https://{url}/api/v3/work_packages/{id}",
        headers={
            'Authorization': token,
            'content-type': 'application/json'
        },
        json=request_body,
        verify=False
    )
    get_result = r.json()
    request_body['lockVersion'] = get_result['lockVersion']
    r = requests.patch(
        url=f"https://{url}/api/v3/work_packages/{id}",
        headers={
            'Authorization': token,
            'content-type': 'application/json'
        },
        json=request_body,
        verify=False
    )
    result = r.json()

    return result['id']


def send_story(
        project: Project,
        step: Step,
        story: Story,
        version
):
    request_body = create_request_body_story(step, story, project, version)
    if story.openproject_id is not None:
        story_id = update_work_package_in_openproject(request_body, story.openproject_id)
    else:
        story_id = create_work_package_in_openproject(request_body)
        for task_name in story.definition_of_done.split('- '):
            task_name = task_name.replace("\n", "")
            if len(task_name) > 0:
                request_body = create_request_body_task(task_name, project, story_id)
                task_id = create_work_package_in_openproject(request_body)
                # relation_id = create_relation(story_id, task_id)

    return story_id



def export_story(session, story_id, version = None):
    res = session.exec(select(Project, Step, Story).select_from(Story).join(Step).join(Activity).join(Project).where(Story.id == story_id)).first()
    (project, step, story) = res
    if project.openproject_id is None:
        openproject_id = get_project_id(project.name)
        if openproject_id is None:
            return False
        project.openproject_id = openproject_id
        session.commit()


    openproject_story_id = send_story(project, step, story, version)
    if openproject_story_id is not None:
        story.openproject_id = openproject_story_id
        session.commit()
    else:
        return False
    return True


