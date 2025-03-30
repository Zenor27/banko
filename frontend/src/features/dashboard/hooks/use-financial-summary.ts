import { getSummarySummaryPost } from "@/client";
import { toISODate, ValidDateRange } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export const useFinancialSummary = ({
  dateRange,
}: {
  dateRange: ValidDateRange;
}) => {
  const { isLoading, data: financialSummaryData } = useQuery({
    queryKey: ["financial-summary", dateRange],
    queryFn: async () =>
      await getSummarySummaryPost({
        body: {
          startDate: toISODate(dateRange.from),
          endDate: toISODate(dateRange.to),
        },
      }),
    select: (data) => data?.data,
  });
  return { isLoading, financialSummaryData };
};

export type FinancialSummaryData = NonNullable<
  ReturnType<typeof useFinancialSummary>["financialSummaryData"]
>;
