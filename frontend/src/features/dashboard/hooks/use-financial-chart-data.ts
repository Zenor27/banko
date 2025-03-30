import { getFinancialChartFinancialChartPost } from "@/client";
import { GroupBy } from "@/features/dashboard/types";
import { toISODate, ValidDateRange } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

type UseFinancialChartProps = {
  dateRange: ValidDateRange;
  groupBy: GroupBy;
};

export const useFinancialChartData = ({
  dateRange,
  groupBy,
}: UseFinancialChartProps) => {
  const { isLoading, data: financialChartData } = useQuery({
    queryKey: ["financial-chart", dateRange, groupBy],
    queryFn: async () =>
      await getFinancialChartFinancialChartPost({
        body: {
          startDate: toISODate(dateRange.from),
          endDate: toISODate(dateRange.to),
          groupBy,
        },
      }),
    select: (data) => data?.data,
  });
  return { isLoading, financialChartData };
};

export type FinancialChartData = NonNullable<
  ReturnType<typeof useFinancialChartData>["financialChartData"]
>;
