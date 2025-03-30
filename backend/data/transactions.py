import csv
from dataclasses import dataclass
from datetime import date, datetime
import os


@dataclass(frozen=True, slots=True, kw_only=True)
class Transaction:
    at: date
    name: str
    category: str
    amount: float

    @property
    def is_income(self) -> bool:
        return self.amount > 0

    @property
    def is_expense(self) -> bool:
        return self.amount < 0


def _remove_duplicates(transactions: list[Transaction]) -> list[Transaction]:
    # Temporary solutions to avoid using a database and bulk import CSV files
    return list(set(transactions))


def get_transactions() -> list[Transaction]:
    transactions = list[Transaction]()
    csv_files_path = os.path.join(os.path.dirname(__file__), "csv")
    for filename in os.listdir(csv_files_path):
        with open(os.path.join(csv_files_path, filename), "r") as file:
            reader = csv.DictReader(file, delimiter=";")
            for row in reader:
                transactions.append(
                    Transaction(
                        at=datetime.strptime(
                            row["Date de comptabilisation"], "%d/%m/%Y"
                        ).date(),
                        name=row["Libelle simplifie"],
                        category=row["Categorie"],
                        amount=float((row["Debit"] or row["Credit"]).replace(",", ".")),
                    )
                )

    return _remove_duplicates(transactions)
