from typing import Annotated, List
import toml

from sqlmodel import Session, select
from fastapi import APIRouter, Depends, HTTPException

from models.database.story import Story
from models.request.story_write import StoryWrite, NewStory
from models.request.position_switch import PositionSwitch
from utils import get_language_pack
from exporter.openproject import export_story
from auth.dependencies import check_permission
from routers.router_utils import get_session, increment_position, get_new_position, insert_status_history

router = APIRouter(
    prefix="/story",
    tags=["story"],
    dependencies=[Depends(check_permission)]
)
MySession = Annotated[Session, Depends(get_session)]

lang_release = get_language_pack()

@router.put("")
async def add(request: NewStory, session: MySession):
    last_position = session.exec(select(Story.position).where(Story.step_id == request.step_id).order_by(Story.position.desc())).first()
    if last_position is None:
        position = 'a'
    else:
        position = increment_position(last_position, len(last_position) - 1)
    story = Story(
        step_id=request.step_id,
        release_id=request.release_id,
        name=request.name,
        position=position,
        definition_of_done='\n'.join([f"- {d}" for d in lang_release['default_dod']])
    )
    session.add(story)
    session.commit()
    session.refresh(story)
    insert_status_history('', story.status, story_id=story.id)
    return story

@router.patch("", response_model_by_alias=True)
async def add(request: StoryWrite, session: MySession):
    new_position = None
    story = session.get(Story, request.id)
    if request.base_position is not None:
        next_position = session.exec(
            select(Story.position)
            .where(Story.step_id == request.step_id)
            .where(Story.position > request.base_position)
            .order_by(Story.position.desc())
        ).first()
        if next_position is None:
            new_position = increment_position(request.base_position)
        else:
            new_position = get_new_position(request.base_position, next_position)
    else:
        if story.step_id != request.step_id or story.release_id != request.release_id:
            highest_position = session.exec(
                select(Story.position)
                .where(Story.step_id == request.step_id)
                .order_by(Story.position.desc())
            ).first()
            if highest_position is not None:
                new_position = increment_position(highest_position)


    if story is None:
        raise HTTPException(404)
    if request.name is not None:
        story.name = request.name
    if request.status is not None:
        insert_status_history(story.status, request.status, story_id=story.id)
        status = request.status
        if request.status == 'exporting':
            state = export_story(session, story.id)
            if state == True:
                insert_status_history('exporting', 'exported', story_id=story.id)
                status = 'exported'
        story.status = status
    if request.step_id is not None:
        story.step_id = request.step_id
    if request.release_id is not None:
        story.release_id = request.release_id
    if request.story_points is not None:
        story.story_points = request.story_points
    if request.description is not None:
        story.description = request.description
    if request.release_text is not None:
        story.release_text = request.release_text
    if request.definition_of_done is not None:
        story.definition_of_done = request.definition_of_done
    if request.definition_of_ready is not None:
        story.definition_of_ready = request.definition_of_ready
    if new_position is not None:
        story.position = new_position
    session.commit()
    session.refresh(story)
    return story


@router.patch("/switch", response_model_by_alias=True)
async def add(request: List[PositionSwitch], session: MySession):
    for req in request:
        story = session.get(Story, req.id)
        if story is not None:
            story.position = req.position
        else:
            raise HTTPException(404)
    session.commit()

@router.delete("/{id}")
async def delete(id: int, session: MySession):
    story = session.get(Story, id)
    # session.delete(story)
    insert_status_history(story.status, 'archived', story_id=story.id)
    story.status = 'archived'
    session.commit()
    return None

@router.get("/{id}")
def get_story(id: int, session: MySession):
    return session.get(Story, id)

