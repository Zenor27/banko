import { Spinner } from "@/components/spinner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useFinancialSummary } from "@/features/dashboard/hooks/use-financial-summary";
import { useAmountFormatter } from "@/lib/use-currency";
import { cn, ValidDateRange } from "@/lib/utils";
import { ArrowUp, ArrowDown, DollarSign } from "lucide-react";

export const Summary = ({ dateRange }: { dateRange: ValidDateRange }) => {
  const { amountFormatter } = useAmountFormatter();
  const { isLoading, financialSummaryData } = useFinancialSummary({
    dateRange,
  });
  const balancePercent = financialSummaryData
    ? financialSummaryData.income !== 0
      ? (financialSummaryData.balance / financialSummaryData.income) * 100
      : 100
    : 0;

  return (
    <div className="grid gap-4 grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <ArrowUp className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          {isLoading || !financialSummaryData ? (
            <Spinner />
          ) : (
            <>
              <div className="text-2xl font-bold text-emerald-600">
                {amountFormatter(financialSummaryData.income)}
              </div>
              <p className="text-xs text-muted-foreground">
                For the selected period
              </p>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <ArrowDown className="h-4 w-4 text-rose-500" />
        </CardHeader>
        <CardContent>
          {isLoading || !financialSummaryData ? (
            <Spinner />
          ) : (
            <>
              <div className="text-2xl font-bold text-rose-600">
                {amountFormatter(financialSummaryData.expense)}
              </div>
              <p className="text-xs text-muted-foreground">
                For the selected period
              </p>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
          <DollarSign className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          {isLoading || !financialSummaryData ? (
            <Spinner />
          ) : (
            <>
              <div
                className={cn(
                  "text-2xl font-bold",
                  financialSummaryData.balance >= 0
                    ? "text-emerald-600"
                    : "text-rose-600"
                )}
              >
                {amountFormatter(financialSummaryData.balance)}
              </div>
              <p className="text-xs text-muted-foreground">
                {financialSummaryData.balance >= 0 ? "Surplus" : "Deficit"} of{" "}
                {balancePercent.toFixed(2)}%
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
