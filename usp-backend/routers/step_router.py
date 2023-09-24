from typing import Annotated, List

from sqlmodel import Session, select
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from models.database.step import Step
from models.database.activity import Activity
from models.request.position_switch import PositionSwitch
from models.request.step_write import StepWrite
from auth.dependencies import check_permission
from routers.router_utils import get_session, increment_position, insert_status_history

router = APIRouter(
    prefix="/step",
    tags=["step"],
    dependencies=[Depends(check_permission)]
)
MySession = Annotated[Session, Depends(get_session)]

class NewStep(BaseModel):
    name: str

@router.post("/{activity_id}", response_model_by_alias=True)
def add(activity_id: int, request: NewStep, session: MySession):
    last_position = session.exec(select(Step.position).where(Step.activity_id == activity_id).order_by(Step.position.desc())).first()
    if last_position is None:
        position = 'a'
    else:
        position = increment_position(last_position, len(last_position) - 1)
    step = Step(activity_id=activity_id, name=request.name, position=position)
    session.add(step)
    session.commit()
    session.refresh(step)
    insert_status_history('', step.status, step_id=step.id)
    return step

@router.patch("", response_model_by_alias=True)
def edit(request: StepWrite, session: MySession):
    new_position = None
    step = session.get(Step, request.id)
    highest_position = session.exec(
        select(Activity.position)
        .order_by(Activity.position.desc())
    ).first()
    if highest_position is not None:
        if step.activity_id != request.activity_id:
            new_position = increment_position(highest_position)
    if step is None:
        raise HTTPException(404)
    if request.name is not None:
        step.name = request.name
    if request.status is not None:
        insert_status_history(step.status, request.status, step_id=step.id)
        step.status = request.status
    if request.activity_id is not None:
        step.activity_id = request.activity_id
    if new_position is not None:
        step.position = new_position
    else:
        if request.position is not None:
            step.position = request.position
    session.commit()
    session.refresh(step)
    return step

@router.patch("/switch", response_model_by_alias=True)
def switch(request: List[PositionSwitch], session: MySession):
    for req in request:
        story = session.get(Step, req.id)
        if story is not None:
            story.position = req.position
        else:
            raise HTTPException(404)
    session.commit()

@router.delete("/{id}")
def delete(id: int, session: MySession):
    step = session.get(Step, id)
    # session.delete(step)
    insert_status_history(step.status, 'archived', step_id=step.id)
    step.status = 'archived'
    session.commit()
    return None
