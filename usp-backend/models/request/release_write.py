from typing import Optional, Literal

from models.database.release import ReleaseBase, ReleaseStatus
from models.alias_generator import to_camel


class ReleaseWrite(ReleaseBase):
    id: int
    name: Optional[str]
    status: Optional[ReleaseStatus]
    project_id: Optional[int]

    class Config:
        alias_generator = to_camel
