from dataclasses import dataclass
import math
import pandas as pd
from datetime import date, datetime
from typing import Literal

from data.transactions import get_transactions


@dataclass(frozen=True, slots=True, kw_only=True)
class Finance:
    income: float
    expense: float

    @property
    def balance(self) -> float:
        return self.income - self.expense


def get_finance_by_period(
    *,
    start_date: date,
    end_date: date,
    group_by: Literal["day", "week", "month", "year", "total"],
) -> dict[str, Finance]:
    transactions = get_transactions()
    start_date_time, end_date_time = (
        datetime.combine(start_date, datetime.min.time()),
        datetime.combine(end_date, datetime.max.time()),
    )

    df = pd.DataFrame(transactions)
    df["at"] = pd.to_datetime(df["at"])
    df = df[(df["at"] >= start_date_time) & (df["at"] <= end_date_time)]

    match group_by:
        case "day":
            df["period"] = df["at"].dt.date
        case "week":
            df["period"] = df["at"].dt.strftime("%Y-W%U")
        case "month":
            df["period"] = df["at"].dt.strftime("%Y-M%m")
        case "year":
            df["period"] = df["at"].dt.strftime("%Y")
        case "total":
            df["period"] = "total"

    df = df.groupby("period").agg(
        income=("amount", lambda x: x[df["amount"] > 0].sum()),
        expense=("amount", lambda x: x[df["amount"] < 0].sum()),
    )

    finance_by_period = dict[str, Finance]()
    for period, row in df.iterrows():
        finance_by_period[str(period)] = Finance(
            income=abs(row["income"]),
            expense=abs(row["expense"]),
        )
    return finance_by_period


def get_finance(*, start_date: date, end_date: date) -> Finance:
    transactions = get_transactions()
    start_date_time, end_date_time = (
        datetime.combine(start_date, datetime.min.time()),
        datetime.combine(end_date, datetime.max.time()),
    )

    df = pd.DataFrame(transactions)
    df["at"] = pd.to_datetime(df["at"])
    df = df[(df["at"] >= start_date_time) & (df["at"] <= end_date_time)]

    income = abs(df[df["amount"] > 0]["amount"].sum())
    expense = abs(df[df["amount"] < 0]["amount"].sum())

    return Finance(income=income, expense=expense)
