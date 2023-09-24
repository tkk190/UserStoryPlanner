import datetime

from typing import Annotated

from sqlmodel import Session
from fastapi import APIRouter, Depends

from models.database.project import Project
from models.database.activity import Activity
from models.database.step import Step, StepType
from models.database.story import Story, StoryStatus
from models.database.release import Release
from models.database.user import User
from auth.dependencies import check_permission_write
from routers.router_utils import get_session, insert_status_history

router = APIRouter(
    prefix="/maintain",
    tags=["maintain"],
    dependencies=[Depends(check_permission_write)]
)
MySession = Annotated[Session, Depends(get_session)]

@router.get("/new_project/{name}")
def add(name: str, session: MySession):
    project = Project(
        name=name,
        created=datetime.datetime.now(),
        updated=datetime.datetime.now()
    )
    session.add(project)
    session.commit()
    session.refresh(project)
    insert_status_history('', project.status, project_id=project.id)

    release_1 = Release(
        name='0.0.1',
        project_id=project.id
    )
    release_2 = Release(
        name='0.0.2',
        project_id=project.id
    )
    release_3 = Release(
        name='1.0.0',
        project_id=project.id
    )

    session.add(release_1)
    session.add(release_2)
    session.add(release_3)
    session.commit()
    session.refresh(release_1)
    session.refresh(release_2)
    session.refresh(release_3)
    insert_status_history('', release_1.status, release_id=release_1.id)
    insert_status_history('', release_2.status, release_id=release_2.id)
    insert_status_history('', release_3.status, release_id=release_3.id)

    activity_1 = Activity(
        name='Activicity 1',
        project_id=project.id,
        position='a'
    )
    activity_2 = Activity(
        name='Activicity 2',
        project_id=project.id,
        position='b'
    )
    default_activity = Activity(
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

    session.add(activity_1)
    session.add(activity_2)
    session.add(default_activity)
    session.commit()
    session.refresh(activity_1)
    session.refresh(activity_2)
    session.refresh(default_activity)
    insert_status_history('', activity_1.status, activity_id=activity_1.id)
    insert_status_history('', activity_2.status, activity_id=activity_2.id)
    insert_status_history('', default_activity.status, activity_id=default_activity.id)

    step_1_a = Step(
        name="Step 1a",
        activity_id=activity_1.id,
        position = 'a'
    )
    step_1_b = Step(
        name="Step 1b",
        activity_id=activity_1.id,
        position='b'
    )
    step_2_a = Step(
        name="Step 2a",
        activity_id=activity_2.id,
        position='a'
    )
    session.add(step_1_a)
    session.add(step_1_b)
    session.add(step_2_a)
    session.commit()
    session.refresh(step_1_a)
    session.refresh(step_1_b)
    session.refresh(step_2_a)
    insert_status_history('', step_1_a.status, step_id=step_1_a.id)
    insert_status_history('', step_1_b.status, step_id=step_1_b.id)
    insert_status_history('', step_2_a.status, step_id=step_2_a.id)

    story_1_a_1 = Story(
        name="Story 1a 1",
        step_id=step_1_a.id,
        release_id=release_1.id,
        position='a',
        story_points=1,
        status='planned',
        description="Description for Story 1a 1",
        definition_of_done="Definition of Done for Story 1a 1"
    )
    story_1_a_2 = Story(
        name="Story 1a 2",
        step_id=step_1_a.id,
        release_id=release_1.id,
        position='b',
        story_points=2,
        status='created',
        description="Description for Story 1a 2",
        definition_of_done="Definition of Done for Story 1a 2"
    )
    story_1_b_1 = Story(
        name="Story 1b 1",
        step_id=step_1_b.id,
        release_id=release_2.id,
        position='a',
        story_points=3,
        status='done',
        description="Description for Story 1b 1",
        definition_of_done="Definition of Done for Story 1b 1"

    )
    story_1_b_2 = Story(
        name="Story 1b 2",
        step_id=step_1_b.id,
        release_id=release_2.id,
        position='b',
        story_points=5,
        status='started',
        description="Description for Story 1b 2",
        definition_of_done="Definition of Done for Story 1b 2"

    )
    story_2_a_1 = Story(
        name="Story 2a 1",
        step_id=step_2_a.id,
        release_id=release_3.id,
        position='a',
        story_points=3,
        status='exported',
        description="Description for Story 2a 1",
        definition_of_done="Definition of Done for Story 2a 1"
    )
    session.add(story_1_a_1)
    session.add(story_1_a_2)
    session.add(story_1_b_1)
    session.add(story_1_b_2)
    session.add(story_2_a_1)
    session.commit()
    session.refresh(story_1_a_1)
    session.refresh(story_1_a_2)
    session.refresh(story_1_b_1)
    session.refresh(story_1_b_2)
    session.refresh(story_2_a_1)

    insert_status_history('', story_1_a_1.status, story_id=story_1_a_1.id)
    insert_status_history('', story_1_a_2.status, story_id=story_1_a_2.id)
    insert_status_history('', story_1_b_1.status, story_id=story_1_b_1.id)
    insert_status_history('', story_1_b_2.status, story_id=story_1_b_2.id)
    insert_status_history('', story_2_a_1.status, story_id=story_2_a_1.id)




