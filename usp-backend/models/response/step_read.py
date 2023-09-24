from typing import Optional, List

from models.database.step import StepBase
from models.response.story_read import StoryRead
from models.alias_generator import to_camel

from pydantic import validator


class StepRead(StepBase):
    id: int
    name: str
    position: str
    status: str
    stories: Optional[List[StoryRead]]

    class Config:
        allow_population_by_field_name = True
        alias_generator = to_camel

    @validator('stories', pre=True, always=True)
    def filter_status(cls, v):
        return [s for s in v if s.status != 'archived']


StepRead.update_forward_refs()

