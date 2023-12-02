from typing import Annotated, List

from sqlmodel import Session, select
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from models.database.activity import Activity
from models.request.activity_write import ActivityWrite
from models.request.ideas import IdeasWrite
from models.request.position_switch import PositionSwitch
from auth.dependencies import check_permission
from routers.router_utils import get_session, increment_position, insert_status_history

router = APIRouter(
    prefix="/activity",
    tags=["activity"],
    dependencies=[Depends(check_permission)]
)
MySession = Annotated[Session, Depends(get_session)]

class NewActivity(BaseModel):
    name: str

@router.post("/ideas")
def add_ideas(ideas: IdeasWrite, session: MySession):
    activity = session.get(Activity, ideas.id)
    activity.ideas = ideas.content
    session.commit()
    return None

@router.post("/{project_id}")
async def add(project_id: int, request: NewActivity, session: MySession):
    last_position = session.exec(select(Activity.position).where(Activity.project_id == project_id).where(Activity.position != 'zzz').order_by(Activity.position.desc())).first()
    if last_position is None:
        position = 'a'
    else:
        position = increment_position(last_position, len(last_position) - 1)
    activity = Activity(project_id=project_id, name=request.name, position=position)
    session.add(activity)
    session.commit()
    session.refresh(activity)
    insert_status_history('', activity.status, activity_id=activity.id)
    return activity

@router.patch("/switch", response_model_by_alias=True)
async def add(request: List[PositionSwitch], session: MySession):
    for req in request:
        story = session.get(Activity, req.id)
        if story is not None:
            story.position = req.position
        else:
            raise HTTPException(404)
    session.commit()

@router.patch("", response_model_by_alias=True)
async def add(request: ActivityWrite, session: MySession):
    activity = session.get(Activity, request.id)
    if activity is None:
        raise HTTPException(404)
    if request.name is not None:
        activity.name = request.name
    if request.project_id is not None:
        activity.project_id = request.project_id
    if request.status is not None:
        insert_status_history(activity.status, request.status, activity_id=activity.id)
        activity.status = request.status
    session.commit()
    session.refresh(activity)
    return activity

@router.delete("/{id}")
async def delete(id: int, session: MySession):
    activity = session.get(Activity, id)
    # session.delete(activity)
    insert_status_history(activity.status, 'archived', activity_id=activity.id)
    activity.status = 'archived'
    session.commit()
    return activity

