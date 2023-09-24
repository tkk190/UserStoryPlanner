from typing import Optional, List
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from beanie import Document, Link, init_beanie, BackLink
from uuid import UUID, uuid4

from pydantic import Field


class Release(Document):
    # id: UUID = Field(default_factory=uuid4)
    name: str
    status: str


class Story(Document):
    # id: UUID = Field(default_factory=uuid4)
    name: str
    release: Release
    story_points: int
    status: str
    description: str
    definition_of_done: str


class Step(Document):
    # id: UUID = Field(default_factory=uuid4)
    name: str
    stories: List[Link[Story]] = []


class Project(Document):
    # id: UUID = Field(default_factory=uuid4)
    name: str
    activities: List[Link["Activity"]] = []


class Activity(Document):
    # id: UUID = Field(default_factory=uuid4)
    name: str
    steps: List[Link[Step]] = []
    project: List[BackLink[Project]] = Field(original_field="activities")




