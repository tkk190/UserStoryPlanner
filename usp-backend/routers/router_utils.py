import toml

from sqlmodel import create_engine, Session, SQLModel

from models.database.status_history import StatusHistory

con_string = ""
with open('config/be_config.toml', mode="r", encoding='utf-8') as f:
    config = toml.load(f)

if config["db_type"] == 'postgres':
    con_string = config["db_connection_string"]
elif config["db_type"] == 'sqlite':
    sqlite_file_name = "../database.sqlite"
    con_string = f"sqlite:///{sqlite_file_name}?check_same_thread=False"

engine = create_engine(con_string)



def init_db():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


def increment_position(last_position: str, idx: int = None) -> str:
    if idx is None:
        idx = len(last_position) - 1
    last_char = last_position[idx]
    if last_char == 'Z':
        next_char = 'a'
    elif last_char == 'z':
        next_char = 'za'
    else:
        next_char = chr(ord(last_char) + 1)
    return last_position[:idx] + next_char + last_position[idx + 1:]


def decrement_position(last_position: str, idx: int = None) -> str:
    if idx is None:
        idx = len(last_position) - 1
    last_char = last_position[idx]
    if last_char == 'a':
        next_char = 'Z'
    elif last_char == 'A':
        raise Exception("last possible position reached")
    else:
        next_char = chr(ord(last_char) - 1)
    return last_position[:idx] + next_char + last_position[idx + 1:]


def get_new_position(first_position: str, secound_position: str) -> str:
    new_position = None
    for idx, i in enumerate(zip(first_position, secound_position)):
        if i[0] == i[1]:
            continue
        else:
            first_char = ord(i[0])
            secound_char = ord(i[1])
            if abs(first_char - secound_char) > 1:
                new_position = increment_position(first_position, idx)
            else:
                new_position = first_position + 'a'
            break
    if new_position is None:
        if len(first_position) == len(secound_position):
            new_position = first_position + 'a'
        elif len(first_position) > len(secound_position):
            new_position = increment_position(first_position, len(first_position) - 1)
        else:
            new_position = decrement_position(secound_position, len(secound_position) - 1)
    return new_position


def insert_status_history(
        status_old: str,
        status_new: str,
        project_id: int = None,
        release_id: int = None,
        activity_id: int = None,
        step_id: int = None,
        story_id: int = None
) -> bool:
    if status_old != status_new:
        return False
    status_history = StatusHistory(
        status_old=status_old,
        status_new=status_new,
    )
    if project_id is not None:
        status_history.project_id = project_id
    if release_id is not None:
        status_history.release_id = release_id
    if activity_id is not None:
        status_history.activity_id = activity_id
    if step_id is not None:
        status_history.step_id = step_id
    if story_id is not None:
        status_history.story_id = story_id

    with Session(engine) as session:
        session.add(status_history)
        session.commit()
        session.refresh(status_history)
    return True
