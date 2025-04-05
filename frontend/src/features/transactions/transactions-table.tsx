import { DataTable } from "@/components/data-table";
import { DataTableSkeleton } from "@/components/data-table-skeleton";
import {
  useTransactions,
  useTransactionsTable,
} from "@/features/transactions/hooks/use-transactions";
import { ValidDateRange } from "@/lib/utils";

export const TransactionsTable = ({
  dateRange,
  search,
}: {
  dateRange: ValidDateRange;
  search: string;
}) => {
  const { isLoading, transactions } = useTransactions({ dateRange });
  const columns = useTransactionsTable();

  if (isLoading || !transactions) {
    return <DataTableSkeleton />;
  }

  return <DataTable columns={columns} data={transactions} filter={search} />;
};
