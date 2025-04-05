from datetime import date
from sqlmodel import Field, SQLModel


class Transaction(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)

    at: date = Field()
    name: str = Field()
    category: str = Field()
    amount: float = Field()
