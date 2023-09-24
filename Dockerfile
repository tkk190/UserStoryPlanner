FROM python:3.10-alpine
COPY pyproject.toml ./
RUN pip install poetry
RUN poetry install
COPY . .
CMD ["poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3000"]