from typing import Optional, List

from models.database.project import ProjectBase
from models.response.activity_read import ActivityRead
from models.response.release_read import ReleaseRead
from pydantic import validator

from models.alias_generator import to_camel


class ProjectRead(ProjectBase):
    id: int
    name: str
    activities: Optional[List[ActivityRead]]
    releases: Optional[List[ReleaseRead]]
    status: str
    short_name: str


    @validator('releases', pre=True, always=True)
    def filter_release_status(cls, v):
        return [s for s in v if s.status != 'archived']

    @validator('activities', pre=True, always=True)
    def filter_acrivity_status(cls, v):
        return [s for s in v if s.status != 'archived']

    class Config:
        allow_population_by_field_name = True
        alias_generator = to_camel

# ProjectRead.update_forward_refs()
