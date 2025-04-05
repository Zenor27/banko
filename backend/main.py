from collections.abc import Iterable, Sequence
import logging
from sqlmodel import select
from contextlib import asynccontextmanager
import csv
from datetime import date
import json
from typing import Annotated, Literal
from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI, File, Form
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

from data.models.file_import import FileImport
from data.db import create_db_and_tables, get_session
from data.models.transaction import Transaction
from core.transactions import (
    Finance,
    get_finance,
    get_finance_by_category,
    get_finance_by_period,
    get_transactions,
    import_from_csv,
)

logger = logging.getLogger(__name__)


@asynccontextmanager
async def init_database_lifespan(_app: FastAPI):
    logger.info("Creating database and tables...")
    create_db_and_tables()
    logger.info("Database and tables created.")
    yield


app = FastAPI(lifespan=init_database_lifespan)

ORIGINS = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
BaseConfig = ConfigDict(alias_generator=to_camel, extra="forbid", populate_by_name=True)


class BaseAPIModel(BaseModel):
    model_config = BaseConfig


class GetFinancialChartRequest(BaseAPIModel):
    start_date: date
    end_date: date
    group_by: Literal["day", "week", "month", "year", "total"]


class FinanceResponse(BaseAPIModel):
    income: float
    expense: float


class GetFinancialChartResponse(BaseAPIModel):
    finance_by_period: dict[str, FinanceResponse]

    @classmethod
    def from_core(
        cls, finance_by_period: dict[str, Finance]
    ) -> "GetFinancialChartResponse":
        return cls(
            finance_by_period={
                period: FinanceResponse(income=finance.income, expense=finance.expense)
                for period, finance in finance_by_period.items()
            }
        )


@app.post("/financial_chart")
async def get_financial_chart(
    request: GetFinancialChartRequest,
) -> GetFinancialChartResponse:
    return GetFinancialChartResponse.from_core(
        get_finance_by_period(
            start_date=request.start_date,
            end_date=request.end_date,
            group_by=request.group_by,
        )
    )


class GetFinancialSummaryRequest(BaseAPIModel):
    start_date: date
    end_date: date


class GetFinancialSummaryResponse(BaseAPIModel):
    income: float
    expense: float
    balance: float

    @classmethod
    def from_core(cls, finance: Finance) -> "GetFinancialSummaryResponse":
        return cls(
            income=finance.income,
            expense=finance.expense,
            balance=finance.balance,
        )


@app.post("/summary")
async def get_summary(
    request: GetFinancialSummaryRequest,
) -> GetFinancialSummaryResponse:
    return GetFinancialSummaryResponse.from_core(
        get_finance(
            start_date=request.start_date,
            end_date=request.end_date,
        )
    )


class GetByCategoriesRequest(BaseAPIModel):
    start_date: date
    end_date: date


class GetByCategoriesFinanceResponse(BaseAPIModel):
    income: float
    expense: float

    percentage_of_total_income: float
    percentage_of_total_expense: float

    @classmethod
    def from_core(
        cls, finance: Finance, total_income: float, total_expense: float
    ) -> "GetByCategoriesFinanceResponse":
        return cls(
            income=finance.income,
            expense=finance.expense,
            percentage_of_total_income=(
                finance.income / total_income if total_income else 0
            ),
            percentage_of_total_expense=(
                finance.expense / total_expense if total_expense else 0
            ),
        )


class GetByCategoriesResponse(BaseAPIModel):
    finance_by_category: dict[str, GetByCategoriesFinanceResponse]

    @classmethod
    def from_core(
        cls, finance_by_category: dict[str, Finance]
    ) -> "GetByCategoriesResponse":
        total_income = sum(finance.income for finance in finance_by_category.values())
        total_expense = sum(finance.expense for finance in finance_by_category.values())

        return cls(
            finance_by_category={
                category: GetByCategoriesFinanceResponse.from_core(
                    finance=finance,
                    total_income=total_income,
                    total_expense=total_expense,
                )
                for category, finance in finance_by_category.items()
            }
        )


@app.post("/by_categories")
async def get_by_categories(request: GetByCategoriesRequest) -> GetByCategoriesResponse:
    return GetByCategoriesResponse.from_core(
        finance_by_category=get_finance_by_category(
            start_date=request.start_date, end_date=request.end_date
        )
    )


class GetTransactionsRequest(BaseAPIModel):
    start_date: date
    end_date: date
    transaction_type: Literal["income", "expense", "all"]


class GetTransactionResponse(BaseAPIModel):
    at: date
    name: str
    category: str
    amount: float

    @classmethod
    def from_data(cls, transaction: Transaction) -> "GetTransactionResponse":
        return cls(
            at=transaction.at,
            name=transaction.name,
            category=transaction.category,
            amount=transaction.amount,
        )


class GetTransactionsResponse(BaseAPIModel):
    transactions: list[GetTransactionResponse]

    @classmethod
    def from_data(
        cls, transactions: Iterable[Transaction]
    ) -> "GetTransactionsResponse":
        return cls(
            transactions=[
                GetTransactionResponse.from_data(transaction)
                for transaction in transactions
            ]
        )


@app.post("/transactions")
async def transactions(request: GetTransactionsRequest) -> GetTransactionsResponse:
    transactions = get_transactions(
        start_date=request.start_date, end_date=request.end_date
    )
    return GetTransactionsResponse.from_data(transactions)


class GetCurrencyResponse(BaseAPIModel):
    currency_label: str
    currency_symbol: str
    currency_code: str


@app.get("/currency")
async def get_currency() -> GetCurrencyResponse:
    # TODO: make this configurable
    return GetCurrencyResponse(
        currency_label="euro", currency_symbol="€", currency_code="EUR"
    )


class ImportInfoResponse(BaseAPIModel):
    headers: list[str]

    first_values_by_header: dict[str, list[str]]


@app.post("/import/info")
async def get_import_info(file: Annotated[bytes, File()]) -> ImportInfoResponse:
    decoded = file.decode("ISO-8859-1")
    if len(decoded) < 1:
        raise ValueError("File is empty")

    [header_row, *rows] = decoded.splitlines()
    dialect = csv.Sniffer().sniff(header_row)
    headers = header_row.split(dialect.delimiter)
    first_values_by_header = {
        header: [row.split(dialect.delimiter)[i] for row in rows[:5]]
        for i, header in enumerate(headers)
    }

    return ImportInfoResponse(
        headers=headers, first_values_by_header=first_values_by_header
    )


class ImportTransactionsResponse(BaseAPIModel):
    imported: int


@app.post("/import/transactions")
async def import_transactions(
    file: Annotated[bytes, File()], form_mapping: Annotated[str, Form()], file_name: str
) -> ImportTransactionsResponse:
    headers_mapping = dict[str, list[str]](json.loads(form_mapping))
    return ImportTransactionsResponse(
        imported=import_from_csv(
            file, header_mapping=headers_mapping, file_name=file_name
        )
    )


class ImportHistoryResponse(BaseAPIModel):
    at: date
    file_name: str
    imported: int

    @classmethod
    def from_file_import(
        cls, file_import: Sequence[FileImport]
    ) -> list["ImportHistoryResponse"]:
        return [
            cls(
                at=file_import.at,
                file_name=file_import.file_name,
                imported=file_import.imported,
            )
            for file_import in file_import
        ]


@app.get("/import/history")
async def import_history() -> list[ImportHistoryResponse]:
    with get_session() as session:
        return ImportHistoryResponse.from_file_import(
            file_import=session.exec(select(FileImport)).all()
        )
