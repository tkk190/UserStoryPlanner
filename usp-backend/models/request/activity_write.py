from typing import Optional, Literal

from models.database.activity import ActivityBase, ActivityStatus
from models.alias_generator import to_camel


class ActivityWrite(ActivityBase):
    id: int
    name: Optional[str]
    position: Optional[str]
    status: Optional[ActivityStatus]

    project_id: Optional[int]

    class Config:
        alias_generator = to_camel
