DIR="./migrations/env.py"
if [ ! -f "$DIR" ]; then
  poetry run python init_db.py
  poetry run alembic init migrations
  cp ./config/env.py ./migrations/env.py
  cp ./config/script.py.mako ./migrations/script.py.mako
fi

poetry run alembic revision --autogenerate
poetry run alembic upgrade head

poetry run uvicorn main:app --host usp-backend --port 3000
