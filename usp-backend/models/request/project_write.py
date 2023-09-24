from typing import Optional

from models.database.project import ProjectStatus, ProjectBase
from models.alias_generator import to_camel

class ProjectWrite(ProjectBase):
    id: int
    name: Optional[str]
    status: Optional[ProjectStatus]
    short_name: Optional[str]

    class Config:
        alias_generator = to_camel



