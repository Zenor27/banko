from datetime import date
from typing import Literal
from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI
from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

from core.transactions import Finance, get_finance, get_finance_by_period


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
