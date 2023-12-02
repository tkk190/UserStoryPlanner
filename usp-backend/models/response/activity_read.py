from typing import Optional, List

from models.database.activity import ActivityBase
from models.response.step_read import StepRead
from models.alias_generator import to_camel
from pydantic import validator

class ActivityRead(ActivityBase):
    id: int
    name: str
    position: str
    status: str
    steps: Optional[List[StepRead]]
    project_id: int
    ideas: Optional[str]

    class Config:
        allow_population_by_field_name = True
        alias_generator = to_camel

    @validator('steps', pre=True, always=True)
    def filter_status(cls, v):
        return [s for s in v if s.status != 'archived']

ActivityRead.update_forward_refs()
