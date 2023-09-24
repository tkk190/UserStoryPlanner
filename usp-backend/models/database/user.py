from typing import Optional, List
from datetime import datetime

from sqlmodel import SQLModel, Field, Relationship, Enum, func

from models.database.step import Step
from models.database.release import Release

class UserRight(str,Enum):
    none: 'none'
    read: 'read'
    write: 'write'


class UserBase(SQLModel):
    username: str = Field(unique=True)

class UserRead(UserBase):
    pass


class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    pw_hash: str
    permission: Optional[UserRight] = 'none'
    disabled: bool = False
