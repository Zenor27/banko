"use client";

import { DateRangePicker } from "@/components/date-range-picker";
import { PredefinedDateRanges } from "@/components/predefined-date-ranges";
import { Categories } from "@/features/dashboard/categories";
import { FinancialChart } from "@/features/dashboard/financial-chart";
import { Summary } from "@/features/dashboard/summary";
import { endOfMonth, startOfMonth } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";

export const DashboardView = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="flex gap-4">
        <PredefinedDateRanges onDateRangeChange={setDateRange} />
        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />
      </div>
      <FinancialChart />
      <Summary />
      <Categories />
    </div>
  );
};
