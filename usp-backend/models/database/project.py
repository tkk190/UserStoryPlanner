from typing import Optional, List, Literal, Union
from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship, Enum

class ProjectStatus(str,Enum):
    development = 'development'
    running = 'active'
    deactivated = 'deactivated'
    archived = 'archived'


class ProjectBase(SQLModel):
    pass

class Project(ProjectBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    short_name: str = ''
    status: ProjectStatus = 'development'
    created: datetime
    updated: datetime
    openproject_id: Optional[int]

    activities: Optional[List["Activity"]] = Relationship(back_populates="project")
    releases: Optional[List["Release"]] = Relationship(back_populates="project")

    status_histories: Optional[List["StatusHistory"]] = Relationship(back_populates="project")

