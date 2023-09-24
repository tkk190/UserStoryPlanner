from typing import Annotated, List

from fastapi import APIRouter, Depends
from sqlmodel import Session, select

from models.database.status_history import StatusHistory
from models.response.status_history_read import StatusHistoryRead
from auth.dependencies import check_permission
from routers.router_utils import get_session

router = APIRouter(
    prefix="/status_history",
    tags=["status_history"],
    dependencies=[Depends(check_permission)]
)
MySession = Annotated[Session, Depends(get_session)]



@router.get('/project/{id}', response_model=List[StatusHistoryRead])
def status_history_project(id: int, session: MySession):
    status_history = session.exec(
        select(StatusHistory)
        .where(StatusHistory.project_id == id)\
        .order_by(StatusHistory.updated)
    ).all()
    return status_history

@router.get('/release/{id}', response_model=List[StatusHistoryRead])
def status_history_release(id: int, session: MySession):
    status_history = session.exec(
        select(StatusHistory)
        .where(StatusHistory.release_id == id)\
        .order_by(StatusHistory.updated)
    ).all()
    return status_history

@router.get('/activity/{id}', response_model=List[StatusHistoryRead])
def status_history_activity(id: int, session: MySession):
    status_history = session.exec(
        select(StatusHistory)
        .where(StatusHistory.activity_id == id)\
        .order_by(StatusHistory.updated)
    ).all()
    return status_history

@router.get('/step/{id}', response_model=List[StatusHistoryRead])
def status_history_step(id: int, session: MySession):
    status_history = session.exec(
        select(StatusHistory)
        .where(StatusHistory.step_id == id)\
        .order_by(StatusHistory.updated)
    ).all()
    return status_history

@router.get('/story/{id}', response_model=List[StatusHistoryRead])
def status_history_story(id: int, session: MySession):
    status_history = session.exec(
        select(StatusHistory)
        .where(StatusHistory.story_id == id)\
        .order_by(StatusHistory.updated)
    ).all()
    return status_history
