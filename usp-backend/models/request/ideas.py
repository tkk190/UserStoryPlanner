from pydantic import BaseModel
from models.alias_generator import to_camel

class IdeasWrite(BaseModel):
    id: int
    content: str

    class Config:
        alias_generator = to_camel
