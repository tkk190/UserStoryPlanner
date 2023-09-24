from pydantic import BaseModel
from models.alias_generator import to_camel

class PositionSwitch(BaseModel):
    id: int
    position: str

    class Config:
        alias_generator = to_camel
