from typing import Optional, List
from datetime import datetime

from sqlmodel import SQLModel, Field, Relationship, Enum, func

from models.database.step import Step
from models.database.release import Release


class StoryStatus(str, Enum):
    created: 'created'
    planned: 'planned'
    exporting: 'exporting'
    exported: 'exported'
    started: 'started'
    done: 'done'
    archived: 'archived'

class StoryBase(SQLModel):
    pass


class Story(StoryBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    position: str
    status: StoryStatus = 'created'
    story_points: int = 0
    description: str = ''
    definition_of_done: str = ''
    definition_of_ready: str = ''
    release_text: str = ''
    openproject_id: Optional[str]
    created: datetime = func.now()

    step_id: int = Field(default=None, foreign_key="step.id")
    step: Step = Relationship(back_populates="stories")

    release_id: int = Field(default=None, foreign_key="release.id")
    release: Release = Relationship(back_populates="stories")

    status_histories: Optional[List["StatusHistory"]] = Relationship(back_populates="story")
