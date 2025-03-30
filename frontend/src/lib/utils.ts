import { clsx, type ClassValue } from "clsx";
import { DateRange } from "react-day-picker";
import { twMerge } from "tailwind-merge";

export type ValidDateRange = {
  from: Date;
  to: Date;
};

export const isValidDateRange = (
  dateRange: DateRange
): dateRange is ValidDateRange => {
  return dateRange.from !== undefined && dateRange.to !== undefined;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toISODate = (date: Date) => {
  return date.toLocaleDateString("sv");
};
