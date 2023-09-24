from typing import Optional, Literal

from models.database.story import StoryBase, StoryStatus
from models.alias_generator import to_camel


# StoryStatus = Literal['created', 'planned', 'exported', 'started', 'done', 'archived']

class StoryWrite(StoryBase):
    id: int
    name: Optional[str]
    position: Optional[str]
    status: Optional[StoryStatus]
    story_points: Optional[int]
    description: Optional[str]
    definition_of_done: Optional[str]
    definition_of_ready: Optional[str]
    release_text: Optional[str]
    release_id: Optional[int]
    step_id: Optional[int]

    base_position: Optional[str]

    class Config:
        alias_generator = to_camel


class NewStory(StoryBase):
    name: str
    release_id: int
    step_id: int

    class Config:
        alias_generator = to_camel




# StoryWrite.update_forward_refs()
