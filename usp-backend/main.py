from typing import Annotated, Optional
import toml

from fastapi import FastAPI, Request, Depends, Cookie, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from starlette import status
from starlette.responses import JSONResponse
from jose import JWTError, jwt

from routers.activity_router import router as activity_router
from routers.auth_router import router as auth_router
from routers.export_router import router as export_router
from routers.maintain_router import router as maintain_router
from routers.project_router import router as project_router
from routers.release_router import router as release_router
from routers.status_history_router import router as status_history_router
from routers.step_router import router as step_router
from routers.story_router import router as story_router

with open('config/be_config.toml', mode="r", encoding='utf-8') as f:
    config = toml.load(f)

SECRET_KEY = config["jwt_secret_key"]


app = FastAPI()

# @app.on_event("startup")
# def on_startup():
#     init_db()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(activity_router)
app.include_router(auth_router)
app.include_router(export_router)
app.include_router(maintain_router)
app.include_router(project_router)
app.include_router(release_router)
app.include_router(status_history_router)
app.include_router(step_router)
app.include_router(story_router)


def register_exception(app: FastAPI):
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):

        exc_str = f'{exc}'.replace('\n', ' ').replace('   ', ' ')

        content = {'status_code': 10422, 'message': exc_str, 'data': None}
        return JSONResponse(content=content, status_code=status.HTTP_422_UNPROCESSABLE_ENTITY)

@app.get("/")
async def root():
    return {"message": "Hello World"}


