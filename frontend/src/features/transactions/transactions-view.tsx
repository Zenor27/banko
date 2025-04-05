"use client";

import { DateRangePicker } from "@/components/date-range-picker";
import { PredefinedDateRanges } from "@/components/predefined-date-ranges";
import { Input } from "@/components/ui/input";
import { TransactionsTable } from "@/features/transactions/transactions-table";
import { useDebounceCallback } from "@/lib/use-debounce";
import { ValidDateRange } from "@/lib/utils";
import { startOfMonth, endOfMonth } from "date-fns";
import { useState } from "react";

export const TransactionsView = () => {
  const [dateRange, setDateRange] = useState<ValidDateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  const [search, setSearch] = useState<string>("");
  const debouncedSetSearch = useDebounceCallback(setSearch, 100);

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
      <Input
        type="search"
        placeholder="🔎 Search transactions..."
        onChange={(e) => debouncedSetSearch(e.target.value)}
      />
      <TransactionsTable dateRange={dateRange} search={search} />
    </div>
  );
};
