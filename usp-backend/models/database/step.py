from typing import Optional, List
from datetime import datetime

from sqlmodel import SQLModel, Field, Relationship, Enum, func

from models.database.activity import Activity


class StepStatus(str,Enum):
    active: 'active'
    done: 'done'
    archived: 'archived'

class StepType(str,Enum):
    bug: 'bug'
    feature: 'feature'
    refactor: 'refactor'
    story: 'story'


class StepBase(SQLModel):
    pass

class Step(StepBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    position: str
    status: StepStatus = 'active'
    type: StepType = 'story'
    created: datetime = func.now()

    activity_id: int = Field(default=None, foreign_key="activity.id")
    activity: Activity = Relationship(back_populates="steps")

    stories: Optional[List["Story"]] = Relationship(back_populates="step")

    status_histories: Optional[List["StatusHistory"]] = Relationship(back_populates="step")


