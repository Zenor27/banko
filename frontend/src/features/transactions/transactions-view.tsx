"use client";

import { DateRangePicker } from "@/components/date-range-picker";
import { PredefinedDateRanges } from "@/components/predefined-date-ranges";
import { TransactionsTable } from "@/features/transactions/transactions-table";
import { ValidDateRange } from "@/lib/utils";
import { startOfMonth, endOfMonth } from "date-fns";
import { useState } from "react";

export const TransactionsView = () => {
  const [dateRange, setDateRange] = useState<ValidDateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
      <div className="flex gap-4">
        <PredefinedDateRanges onDateRangeChange={setDateRange} />
        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>
      <TransactionsTable dateRange={dateRange} />
    </div>
  );
};
