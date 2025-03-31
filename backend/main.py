from collections.abc import Iterable
from datetime import date
from typing import Literal
from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

from data.transactions import Transaction
from core.transactions import (
    Finance,
    get_finance,
    get_finance_by_category,
    get_finance_by_period,
    get_filtered_transactions,
)


app = FastAPI()

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
async def get_transactions(request: GetTransactionsRequest) -> GetTransactionsResponse:
    transactions = get_filtered_transactions(
        start_date=request.start_date, end_date=request.end_date
    )
    return GetTransactionsResponse.from_data(transactions)


class GetCurrencyResponse(BaseAPIModel):
    currency_label: str
    currency_symbol: str
    currency_code: str


@app.get("/currency")
async def get_currency() -> GetCurrencyResponse:
    return GetCurrencyResponse(
        currency_label="euro", currency_symbol="€", currency_code="EUR"
    )
