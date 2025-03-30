import { TransactionsView } from "@/features/transactions/transactions-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Banko | Transactions",
  description: "View your transactions",
};

export default function TransactionsPage() {
  return <TransactionsView />;
}
