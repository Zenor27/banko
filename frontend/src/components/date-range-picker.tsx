"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn, isValidDateRange, ValidDateRange } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type DateRangePickerProps = {
  dateRange?: DateRange;
  onDateRangeChange?: (dateRange: ValidDateRange) => void;
};

export function DateRangePicker({
  dateRange,
  onDateRangeChange,
}: DateRangePickerProps) {
  const [partialDateRange, setPartialDateRange] = React.useState<
    DateRange | undefined
  >(dateRange);

  React.useEffect(() => {
    if (partialDateRange && isValidDateRange(partialDateRange)) {
      onDateRangeChange?.(partialDateRange);
    }
  }, [onDateRangeChange, partialDateRange]);

  React.useEffect(() => {
    setPartialDateRange(dateRange);
  }, [dateRange]);

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !partialDateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {partialDateRange?.from ? (
              partialDateRange.to ? (
                <>
                  {format(partialDateRange.from, "LLL dd, y")} -{" "}
                  {format(partialDateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(partialDateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={partialDateRange?.from}
            selected={partialDateRange}
            onSelect={setPartialDateRange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
