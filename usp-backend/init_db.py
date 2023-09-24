import toml

from sqlmodel import SQLModel, create_engine, Session, text

from models.database import *


con_string = ""
with open('config/be_config.toml', mode="r", encoding='utf-8') as f:
    config = toml.load(f)

if config["db_type"] == 'postgres':
    con_string = config["db_connection_string"]
elif config["db_type"] == 'sqlite':
    sqlite_file_name = "../database.sqlite"
    con_string = f"sqlite:///{sqlite_file_name}?check_same_thread=False"

print(con_string)

engine = create_engine(con_string, echo=True)
with Session(engine) as session:
    res = session.exec(text("select version()")).first()
    print(res)

print(engine)
SQLModel.metadata.create_all(engine)
