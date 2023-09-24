from typing import Optional
from datetime import datetime

from sqlmodel import SQLModel, Field, Relationship, func

from models.database.project import Project
from models.database.story import Story
from models.database.step import Step
from models.database.activity import Activity
from models.database.release import Release


class StatusHistoryBase(SQLModel):
    pass

class StatusHistory(StatusHistoryBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    status_old: str
    status_new: str
    project_id: int = Field(default=None, foreign_key="project.id")
    release_id: int = Field(default=None, foreign_key="release.id")
    activity_id: int = Field(default=None, foreign_key="activity.id")
    step_id: int = Field(default=None, foreign_key="step.id")
    story_id: int = Field(default=None, foreign_key="story.id")
    updated: datetime = func.now()

    project: Project = Relationship(back_populates="status_histories")
    release: Release = Relationship(back_populates="status_histories")
    activity: Activity = Relationship(back_populates="status_histories")
    step: Step = Relationship(back_populates="status_histories")
    story: Story = Relationship(back_populates="status_histories")


