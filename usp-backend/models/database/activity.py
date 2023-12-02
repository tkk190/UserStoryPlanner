from typing import Optional, List
from datetime import datetime

from sqlmodel import SQLModel, Field, Relationship, Enum, func
from models.database.project import Project

class ActivityStatus(str,Enum):
    active: 'active'
    done: 'done'
    archived: 'archived'


class ActivityBase(SQLModel):
    pass


class Activity(ActivityBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    position: str
    status: ActivityStatus = 'active'
    created: datetime = func.now()
    ideas: Optional[str]

    project_id: int = Field(default=None, foreign_key="project.id")
    project: Project = Relationship(back_populates="activities")

    steps: Optional[List["Step"]] = Relationship(back_populates="activity")

    status_histories: Optional[List["StatusHistory"]] = Relationship(back_populates="activity")
