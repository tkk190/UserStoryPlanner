from pydantic import BaseModel

class PossibleReleaseVersion(BaseModel):
    type: str
    version: str

