"use client";

import { DateRangePicker } from "@/components/date-range-picker";
import { PredefinedDateRanges } from "@/components/predefined-date-ranges";
import { Categories } from "@/features/dashboard/categories";
import { FinancialChart } from "@/features/dashboard/financial-chart";
import { Summary } from "@/features/dashboard/summary";
import { isValidDateRange, ValidDateRange } from "@/lib/utils";
import { endOfMonth, startOfMonth } from "date-fns";
import { useState } from "react";

export const DashboardView = () => {
  const [dateRange, setDateRange] = useState<ValidDateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="flex gap-4">
        <PredefinedDateRanges
          onDateRangeChange={(value) =>
            isValidDateRange(value) && setDateRange(value)
          }
        />
        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={(value) =>
            value && isValidDateRange(value) && setDateRange(value)
          }
        />
      </div>
      <FinancialChart dateRange={dateRange} />
      <Summary dateRange={dateRange} />
      <h2 className="text-xl font-bold tracking-tight">Categories</h2>
      <Categories dateRange={dateRange} />
    </div>
  );
};
