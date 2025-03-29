import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown, DollarSign } from "lucide-react";

export const Summary = () => {
  // In a real app, we would calculate these values based on the dateRange
  const totalIncome = 8750;
  const totalExpenses = 5320;
  const difference = totalIncome - totalExpenses;
  const percentDifference = ((difference / totalIncome) * 100).toFixed(1);

  return (
    <div className="grid gap-4 grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <ArrowUp className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600">
            ${totalIncome.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            For the selected period
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <ArrowDown className="h-4 w-4 text-rose-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-rose-600">
            ${totalExpenses.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            For the selected period
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
          <DollarSign className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div
            className={cn(
              "text-2xl font-bold",
              difference >= 0 ? "text-emerald-600" : "text-rose-600"
            )}
          >
            ${difference.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            {difference >= 0 ? "Surplus" : "Deficit"} of {percentDifference}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
