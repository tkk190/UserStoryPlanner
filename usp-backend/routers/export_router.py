from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.responses import HTMLResponse
from sqlmodel import Session, select

from models.database.project import Project
from models.database.story import Story
from models.database.step import Step
from models.database.activity import Activity
from models.database.release import Release
from auth.dependencies import check_permission
from routers.router_utils import get_session

router = APIRouter(
    prefix="/export",
    tags=["export"],
    dependencies=[Depends(check_permission)]
)
MySession = Annotated[Session, Depends(get_session)]



@router.get('/project_backlog/{id}/{type}', response_class=HTMLResponse)
def project_backlog(id: int, type: str, session: MySession):
    result = ''
    stories = session.exec(
        select(Story)
        .join(Step)
        .join(Activity)
        .join(Project)
        .where(Project.id == id)
        .where(Story.status != 'archived')
    ).all()

    for story in stories:
        if type == 'done' and story.status != 'done':
            continue
        if type == 'active' and story.status == 'done':
            continue
        story_text = story.name
        if len(story.release_text):
            story_text = story.release_text
        result += f"[{story.story_points:>2}] {story_text} <br/>"
    return result

@router.get('/release/{id}/{type}', response_class=HTMLResponse)
def release(id: int, type: str, session: MySession):
    result = ''
    stories = session.exec(
        select(Story)
        .join(Release)
        .where(Story.release_id == id)
        .where(Story.status != 'archived')
    ).all()

    for story in stories:
        if type == 'done' and story.status != 'done':
            continue
        if type == 'active' and story.status == 'done':
            continue
        story_text = story.name
        if len(story.release_text):
            story_text = story.release_text
        result += f"[{story.story_points:>2}] {story_text} <br/>"
    return result


