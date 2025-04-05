from datetime import date
from sqlmodel import Field, SQLModel


class FileImport(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)

    at: date = Field()
    imported: int = Field()
    file_name: str = Field()
