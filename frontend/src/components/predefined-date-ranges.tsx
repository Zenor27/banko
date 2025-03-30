"use client";

import { Button } from "@/components/ui/button";
import { ValidDateRange } from "@/lib/utils";
import {
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subMonths,
} from "date-fns";

type PredefinedDateRangesProps = {
  onDateRangeChange: (dateRange: ValidDateRange) => void;
};

export const PredefinedDateRanges = ({
  onDateRangeChange,
}: PredefinedDateRangesProps) => {
  const handleCurrentMonth = () => {
    const today = new Date();
    onDateRangeChange({
      from: startOfMonth(today),
      to: endOfMonth(today),
    });
  };

  const handleLastMonth = () => {
    const today = new Date();
    const lastMonth = subMonths(today, 1);
    onDateRangeChange({
      from: startOfMonth(lastMonth),
      to: endOfMonth(lastMonth),
    });
  };

  const handleLastTwoMonths = () => {
    const today = new Date();
    onDateRangeChange({
      from: startOfMonth(subMonths(today, 2)),
      to: endOfMonth(today),
    });
  };

  const handleLastYear = () => {
    const today = new Date();
    const lastYear = subMonths(today, 12);
    onDateRangeChange({
      from: startOfYear(lastYear),
      to: endOfYear(today),
    });
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleCurrentMonth}
        className="h-9"
      >
        Current Month
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleLastMonth}
        className="h-9"
      >
        Last Month
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleLastTwoMonths}
        className="h-9"
      >
        Last 2 Months
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleLastYear}
        className="h-9"
      >
        Last Year
      </Button>
    </div>
  );
};
