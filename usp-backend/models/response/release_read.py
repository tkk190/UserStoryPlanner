from models.database.release import ReleaseBase
from models.alias_generator import to_camel


class ReleaseRead(ReleaseBase):
    id: int
    name: str
    status: str = 'opened'

    class Config:
        allow_population_by_field_name = True
        alias_generator = to_camel

ReleaseRead.update_forward_refs()
