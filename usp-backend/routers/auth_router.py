from typing import Annotated, Optional
from base64 import b64decode

from sqlmodel import Session, select
from fastapi import APIRouter, Depends, Response, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel

from auth.authentification import authenticate_user, pwd_context
from auth.dependencies import check_refresh_token, credentials_exception
from auth.token import create_access_token, create_refresh_token
from models.database.user import User
from auth.settings import DOMAIN
from routers.router_utils import get_session

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)
MySession = Annotated[Session, Depends(get_session)]


class LoginForm(BaseModel):
    username: str
    password: str
    scope: Optional[str]


@router.post("/login")
def login(
        form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
        session: MySession,
        response: Response
):
    user = authenticate_user(session, form_data.username, b64decode(form_data.password).decode('utf-8'))
    if not user:
        raise credentials_exception

    access_token = create_access_token(
        data={
            "sub": user.username,
            "scope": [f"usp:{user.permission}"]
        }
    )
    refresh_token = create_refresh_token(
        data={
            "sub": user.username
        }
    )
    response.set_cookie(key="access_token_signature", value='.'.join(access_token.split('.')[-1:]), httponly=True, secure=True, samesite="strict", domain=DOMAIN)
    response.set_cookie(key="access_token_content", value='.'.join(access_token.split('.')[:-1]), secure=True, samesite="strict", domain=DOMAIN)
    response.set_cookie(key="refresh_token_signature", value='.'.join(refresh_token.split('.')[-1:]), httponly=True, secure=True, samesite="strict", domain=DOMAIN)
    response.set_cookie(key="refresh_token_content", value='.'.join(refresh_token.split('.')[:-1]), secure=True, samesite="strict", domain=DOMAIN)
    return None

@router.post("/refresh")
def refresh(
        session: MySession,
        response: Response,
        username: Annotated[str, Depends(check_refresh_token)]
):
    user = session.exec(select(User).where(User.username == username)).first()
    if user is None:
        raise credentials_exception

    access_token = create_access_token(
        data={
            "sub": user.username,
            "scope": [f"usp:{user.permission}"]
        }
    )
    response.set_cookie(key="access_token_signature", value='.'.join(access_token.split('.')[-1:]), httponly=True, secure=True, samesite="strict", domain=DOMAIN)
    response.set_cookie(key="access_token_content", value='.'.join(access_token.split('.')[:-1]), secure=True, samesite="strict", domain=DOMAIN)
    return None


@router.post("/create_user")
def create_user(form_data: LoginForm, session: MySession):
    user_check = session.exec(select(User).where(User.username == form_data.username)).first()
    user_count = session.exec(select(User)).all()
    if user_check is not None:
        raise HTTPException(400, "user allready exists")
    user = User(
        username=form_data.username,
        pw_hash=pwd_context.hash(b64decode(form_data.password))
    )
    if len(user_count) == 0:
        user.permission = 'write'
    session.add(user)
    session.commit()

@router.post("/reset_password")
def reset_password(form_data: LoginForm, session: MySession):
    user = session.exec(select(User).where(User.username == form_data.username)).first()
    user.pw_hash = pwd_context.hash(b64decode(form_data.password))
    session.add(user)
    session.commit()

