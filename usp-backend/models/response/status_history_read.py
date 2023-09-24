from datetime import datetime

from pydantic import validator

from models.database.status_history import StatusHistoryBase
from models.alias_generator import to_camel


class StatusHistoryRead(StatusHistoryBase):
    status_old: str
    status_new: str
    updated: str

    @validator('updated', pre=True, always=True)
    def filter_status(cls, v):
        return f"{v:%d.%m.%Y  %H:%M}"

    class Config:
        allow_population_by_field_name = True
        alias_generator = to_camel


StatusHistoryRead.update_forward_refs()
