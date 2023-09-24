from typing import Optional

from models.database.story import StoryBase
from models.alias_generator import to_camel
from models.response.release_read import ReleaseRead
from sqlmodel import Field

class StoryRead(StoryBase):
    id: int
    name: str
    position: str
    status: str
    story_points: int
    description: str
    definition_of_done: str
    definition_of_ready: str
    release_text: str
    release: ReleaseRead

    class Config:
        allow_population_by_field_name = True
        alias_generator = to_camel


StoryRead.update_forward_refs()
