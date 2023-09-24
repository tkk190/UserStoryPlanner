
from fastapi import Request, HTTPException
from auth.settings import SECRET_KEY
from jose import jwt, JWTError
from fastapi import status


credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Could not validate token",
    headers={"WWW-Authenticate": "Bearer"},
)


def check_refresh_token(req: Request):
    cookies = req.cookies
    if 'refresh_token_content' not in cookies or 'refresh_token_signature' not in cookies:
        raise credentials_exception
    try:
        payload = jwt.decode(f"{cookies['refresh_token_content']}.{cookies['refresh_token_signature']}", SECRET_KEY, algorithms=["HS256"])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return username


def check_permission(req: Request):
    cookies = req.cookies
    if 'access_token_content' not in cookies or 'access_token_signature' not in cookies:
        raise credentials_exception
    try:
        payload = jwt.decode(f"{cookies['access_token_content']}.{cookies['access_token_signature']}", SECRET_KEY, algorithms=["HS256"])
        scope: str = payload.get("scope")
    except JWTError:
        raise credentials_exception
    method = req.method

    if method in ["POST", "PATCH", "PUT", "DELETE"]:
        if 'usp:write' not in scope:
            raise credentials_exception
    elif method in ["GET"]:
        if 'usp:read' not in scope and 'usp:write' not in scope:
            raise credentials_exception
    return scope


def check_permission_write(req: Request):
    cookies = req.cookies
    if 'access_token_content' not in cookies or 'access_token_signature' not in cookies:
        raise credentials_exception
    try:
        payload = jwt.decode(f"{cookies['access_token_content']}.{cookies['access_token_signature']}", SECRET_KEY, algorithms=["HS256"])
        scope: str = payload.get("scope")
    except JWTError:
        raise credentials_exception
    if 'usp:write' not in scope:
        raise credentials_exception
    return scope
