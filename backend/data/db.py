from collections.abc import Iterator
from contextlib import contextmanager
from sqlmodel import SQLModel, Session, create_engine


SQLITE_FILE_NAME = "banko.db"
SQLITE_URL = f"sqlite:///data/db/{SQLITE_FILE_NAME}"
CONNECT_ARGS = {"check_same_thread": False}

engine = create_engine(SQLITE_URL, connect_args=CONNECT_ARGS)


def create_db_and_tables() -> None:
    SQLModel.metadata.create_all(engine)


@contextmanager
def get_session() -> Iterator[Session]:
    with Session(engine) as session:
        yield session
