import { DataTable } from "@/components/data-table";
import {
  useTransactions,
  useTransactionsTable,
} from "@/features/transactions/hooks/use-transactions";
import { ValidDateRange } from "@/lib/utils";

export const TransactionsTable = ({
  dateRange,
}: {
  dateRange: ValidDateRange;
}) => {
  const { isLoading, transactions } = useTransactions({ dateRange });
  const columns = useTransactionsTable();

  if (isLoading || !transactions) {
    return "Loading...";
  }

  return <DataTable columns={columns} data={transactions} />;
};
