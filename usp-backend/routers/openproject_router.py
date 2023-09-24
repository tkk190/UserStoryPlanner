from typing import Annotated, List, Any

from sqlmodel import Session, select
from fastapi import APIRouter, Depends, HTTPException, Body

from models.database.story import Story

from exporter.op_status import op_status_mapping

from routers.router_utils import get_session, insert_status_history

router = APIRouter(
    prefix="/openproject",
    tags=["openproject"]
)
MySession = Annotated[Session, Depends(get_session)]


@router.post("")
async def change_story_status(session: MySession, body: Any = Body(...)):
    if body['action'] == "work_package:updated":
        openproject_story_id = body['work_package']['id']
        story = session.exec(select(Story).where(Story.openproject_id == openproject_story_id)).first()
        if story is None:
            return
        new_status_openproject = body['work_package']['_embedded']['status']['name']
        new_status = op_status_mapping[new_status_openproject]
        insert_status_history(story.status, new_status, story_id=story.id)
        story.status = new_status
        session.commit()
