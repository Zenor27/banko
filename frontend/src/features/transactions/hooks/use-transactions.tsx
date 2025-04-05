import { transactionsTransactionsPost } from "@/client";
import { createColumnHelper } from "@tanstack/react-table";
import { cn, toISODate, ValidDateRange } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useAmountFormatter } from "@/lib/use-currency";

type UseTransactionsProps = {
  dateRange: ValidDateRange;
};

export const useTransactions = ({ dateRange }: UseTransactionsProps) => {
  const { isLoading, data: transactions } = useQuery({
    queryKey: ["transactions", dateRange],
    queryFn: async () =>
      await transactionsTransactionsPost({
        body: {
          startDate: toISODate(dateRange.from),
          endDate: toISODate(dateRange.to),
          transactionType: "all",
        },
      }),
    select: (data) => data?.data?.transactions,
  });

  return { isLoading, transactions };
};

export type TransactionsData = NonNullable<
  ReturnType<typeof useTransactions>["transactions"]
>;

const columnHelper = createColumnHelper<TransactionsData[number]>();

export const useTransactionsTable = () => {
  const { amountFormatter } = useAmountFormatter();
  return [
    columnHelper.accessor("at", {
      header: "Date",
    }),
    columnHelper.accessor("category", {
      header: "Category",
    }),
    columnHelper.accessor("name", {
      header: "Name",
      filterFn: "fuzzy",
    }),
    columnHelper.accessor("amount", {
      header: "Amount",
      cell: ({ getValue }) => {
        const amount = getValue();
        return (
          <div
            className={cn(
              "flex items-center gap-1",
              amount > 0 ? "text-emerald-600" : "text-rose-600"
            )}
          >
            {amount > 0 ? (
              <ArrowUp className="h-4 w-4 text-emerald-500" />
            ) : (
              <ArrowDown className="h-4 w-4 text-rose-500" />
            )}
            {amountFormatter(amount)}
          </div>
        );
      },
    }),
  ];
};
