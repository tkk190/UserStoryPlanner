from typing import Optional, Literal

from models.database.step import StepBase, StepStatus
from models.alias_generator import to_camel


class StepWrite(StepBase):
    id: int
    name: Optional[str]
    position: Optional[str]
    status: Optional[StepStatus]
    activity_id: Optional[int]

    class Config:
        alias_generator = to_camel

