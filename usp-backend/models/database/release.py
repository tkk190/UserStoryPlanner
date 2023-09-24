from typing import Optional, List
from datetime import datetime

from sqlmodel import SQLModel, Field, Relationship, Enum, func
from models.database.project import Project

class ReleaseStatus(str,Enum):
    opened: 'opened'
    running: 'running'
    testing: 'testing'
    releasing: 'releasing'
    done: 'done'
    archived: 'archived'

class ReleaseBase(SQLModel):
    pass


class Release(ReleaseBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    status: ReleaseStatus = 'opened'
    created: datetime = func.now()

    project_id: int = Field(default=None, foreign_key="project.id")
    project: Project = Relationship(back_populates="releases")

    stories: Optional[List["Story"]] = Relationship(back_populates="release")

    status_histories: Optional[List["StatusHistory"]] = Relationship(back_populates="release")
