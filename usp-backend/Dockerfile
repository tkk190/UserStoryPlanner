FROM python:3.10-alpine
WORKDIR /usp-backend
COPY ./usp-backend .
COPY ./config/be_config.toml ./config/be_config.toml
RUN pip install poetry
RUN poetry install
# RUN poetry run alembic init migrations
#CMD ["poetry", "run", "python", "init_db.py"]
CMD ["/bin/sh", "alembic.sh"]
# COPY ./usp-backend/config/env.py ./migrations/env.py
# CMD ["poetry", "run", "alembic", "revision", "--autogenerate"]
# CMD ["poetry", "run", "alembic", "upgrade", "head"]
# CMD ["poetry", "run", "uvicorn", "main:app", "--host", "usp-backend", "--port", "3000"]
