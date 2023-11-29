import datetime
from typing import Annotated, List


from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func, case


from models.database.project import Project
from models.database.release import Release
from models.database.step import Step
from models.database.activity import Activity
from models.response.project_read import ProjectRead
from models.request.project_write import ProjectWrite
from auth.dependencies import check_permission
from routers.router_utils import get_session, insert_status_history

router = APIRouter(
    prefix="/project",
    tags=["project"],
    dependencies=[Depends(check_permission)]
)
MySession = Annotated[Session, Depends(get_session)]



@router.post("/{name}", response_model=ProjectRead, response_model_by_alias=True)
def add(name: str, session: MySession):
    name_assigned = session.exec(select(Project).where(Project.name == name)).first()
    if name_assigned is None:
        project = Project(
            name=name,
            created=datetime.datetime.now(),
            updated=datetime.datetime.now()
        )
        session.add(project)
        session.commit()
        session.refresh(project)
        insert_status_history('', project.status, project_id=project.id)
        release_def = Release(
            name="0.0.1",
            project_id=project.id
        )
        release_unplanned = Release(
            name="not planned",
            project_id=project.id
        )
        activity = Activity(
            name='Maintenance',
            position='zzz',
            project_id=project.id,
            steps=[
                Step(
                    name='Bug',
                    position='a',
                    type='bug',
                ),
                Step(
                    name='Feature',
                    position='b',
                    type='feature',
                ),
                Step(
                    name='Refactor',
                    position='c',
                    type='refactor',
                ),
            ]
        )
        session.add(release_def)
        session.add(release_unplanned)
        session.add(activity)
        session.commit()
        session.refresh(project)
        session.refresh(activity)
        insert_status_history('', release_def.status, release_id=release_def.id)
        insert_status_history('', release_unplanned.status, release_id=release_unplanned.id)
        insert_status_history('', activity.status, activity_id=activity.id)
        return project
    else:
        raise HTTPException(400, "project already exists")

@router.patch("")
def add(request: ProjectWrite, session: MySession):
    project = session.get(Project, request.id)
    if request.name is not None:
        project.name = request.name
    if request.short_name is not None:
        project.short_name = request.short_name
    if request.status is not None:
        insert_status_history(project.status, request.status, project_id=project.id)
        project.status = request.status
    project.updated = func.now()
    session.add(project)
    session.commit()
    session.refresh(project)
    return project

@router.delete("/{id}")
def delete(id: str, session: MySession):
    project = session.get(Project, id)
    # session.delete(project)
    insert_status_history(project.status, 'archived', project_id=project.id)
    project.status = 'archived'
    session.commit()
    return None

@router.get('/overview/{id}', response_model=ProjectRead, response_model_by_alias=True)
def overview(id: int, session: MySession):
    project = session.get(Project, id)
    if project is None:
        raise HTTPException(404)
    project.releases.sort(key=lambda d: d.name)
    return project

@router.get('/overview', response_model=List[ProjectRead], response_model_by_alias=True)
def overview(session: MySession):
    return session.exec(
        select(Project)
        .where(Project.status != 'archived')
        .order_by(
            case(
                (Project.status == 'development', 1),
                (Project.status == 'active', 2),
                (Project.status == 'deactivated', 3)
            ),
            func.lower(Project.name)
        )
    ).all()


