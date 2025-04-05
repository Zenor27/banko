from collections.abc import Iterable
import csv
from dataclasses import dataclass
from datetime import date, datetime
from typing import Any, Literal

from data.models.file_import import FileImport
from data.db import get_session
from data.models.transaction import Transaction
from sqlmodel import desc, select, func, case


@dataclass(frozen=True, slots=True, kw_only=True)
class Finance:
    income: float
    expense: float

    @property
    def balance(self) -> float:
        return self.income - self.expense


type GroupBy = Literal["day", "week", "month", "year", "total"]


def get_finance_by_period(
    *,
    start_date: date,
    end_date: date,
    group_by: GroupBy,
) -> dict[str, Finance]:
    match group_by:
        case "day":
            sql_group_by = func.strftime("%Y-%m-%d", Transaction.at)
        case "week":
            sql_group_by = func.strftime("%Y-W%W", Transaction.at)
        case "month":
            sql_group_by = func.strftime("%Y-M%m", Transaction.at)
        case "year":
            sql_group_by = func.strftime("%Y", Transaction.at)
        case "total":
            sql_group_by = func.strftime("Total", Transaction.at)

    stmt = (
        select(
            sql_group_by.label("period"),
            func.sum(case((Transaction.amount > 0, Transaction.amount), else_=0)).label(
                "income"
            ),
            func.abs(
                func.sum(case((Transaction.amount < 0, Transaction.amount), else_=0))
            ).label("expense"),
        )
        .where((Transaction.at >= start_date) & (Transaction.at <= end_date))
        .group_by(sql_group_by)
    )

    finance_by_period = dict[str, Finance]()
    with get_session() as session:
        for period, income, expense in session.exec(stmt):
            finance_by_period[str(period)] = Finance(
                income=float(income), expense=float(expense)
            )
    return finance_by_period


def get_finance(*, start_date: date, end_date: date) -> Finance:
    with get_session() as session:
        stmt = select(
            func.sum(case((Transaction.amount > 0, Transaction.amount), else_=0)).label(
                "income"
            ),
            func.abs(
                func.sum(case((Transaction.amount < 0, Transaction.amount), else_=0))
            ).label("expense"),
        ).where((Transaction.at >= start_date) & (Transaction.at <= end_date))
        maybe_result = session.exec(stmt).one_or_none()
        if maybe_result is None:
            return Finance(income=0.0, expense=0.0)

        income, expense = maybe_result
        return Finance(
            income=float(income or 0.0),
            expense=float(expense or 0.0),
        )


def get_finance_by_category(*, start_date: date, end_date: date) -> dict[str, Finance]:
    with get_session() as session:
        stmt = (
            select(
                Transaction.category,
                func.sum(
                    case((Transaction.amount > 0, Transaction.amount), else_=0)
                ).label("income"),
                func.abs(
                    func.sum(
                        case((Transaction.amount < 0, Transaction.amount), else_=0)
                    )
                ).label("expense"),
            )
            .where((Transaction.at >= start_date) & (Transaction.at <= end_date))
            .group_by(Transaction.category)
        )
        finance_by_category = dict[str, Finance]()
        for category, income, expense in session.exec(stmt):
            finance_by_category[category] = Finance(
                income=float(income), expense=float(expense)
            )
    return finance_by_category


def get_transactions(*, start_date: date, end_date: date) -> Iterable[Transaction]:
    with get_session() as session:
        stmt = (
            select(Transaction)
            .where((Transaction.at >= start_date) & (Transaction.at <= end_date))
            .order_by(desc(Transaction.at))
        )
        transactions = session.exec(stmt).all()
    return transactions


def import_from_csv(
    csv_file: bytes, *, header_mapping: dict[str, list[str]], file_name: str
) -> int:
    decoded = csv_file.decode("ISO-8859-1")
    if len(decoded) == 0:
        # TODO: raise custom exception
        raise ValueError("Empty CSV file")

    [headers, *rows] = decoded.splitlines()

    dialect = csv.Sniffer().sniff(headers)

    csv_reader = csv.DictReader(
        rows, fieldnames=headers.split(dialect.delimiter), delimiter=dialect.delimiter
    )

    def _get_header_value(row: dict[str, Any], key: str) -> Any:
        headers = header_mapping.get(key, [])
        for header in headers:
            value = row.get(header)
            if not value:
                continue
            return value

        raise ValueError(f"No value found for key: {key} within headers: {headers}")

    transactions_to_create = list[Transaction]()
    with get_session() as session:
        for row in csv_reader:
            at = datetime.strptime(_get_header_value(row, "at"), "%d/%m/%Y").date()
            name = _get_header_value(row, "name")
            category = _get_header_value(row, "category")
            amount = float(_get_header_value(row, "amount").replace(",", ".") or 0.0)

            # TODO: this is not optimized at all...
            transaction = session.exec(
                select(func.count("*")).where(
                    (Transaction.at == at)
                    & (Transaction.name == name)
                    & (Transaction.category == category)
                    & (Transaction.amount == amount)
                )
            ).one()
            if transaction != 0:
                continue

            transactions_to_create.append(
                Transaction(
                    at=at,
                    name=name,
                    category=category,
                    amount=amount,
                )
            )

        session.add_all(transactions_to_create)
        session.add(
            FileImport(
                at=date.today(),
                imported=len(transactions_to_create),
                file_name=file_name,
            )
        )
        session.commit()

    return len(transactions_to_create)
