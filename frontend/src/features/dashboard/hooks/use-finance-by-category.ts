import { getByCategoriesByCategoriesPost } from "@/client";
import { toISODate, ValidDateRange } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

type UseFinanceByCategoryProps = {
  dateRange: ValidDateRange;
};

export const useFinanceByCategory = ({
  dateRange,
}: UseFinanceByCategoryProps) => {
  const { isLoading, data: financeByCategory } = useQuery({
    queryKey: ["finance-by-category", dateRange],
    queryFn: async () =>
      await getByCategoriesByCategoriesPost({
        body: {
          startDate: toISODate(dateRange.from),
          endDate: toISODate(dateRange.to),
        },
      }),
    select: (data) => data?.data?.financeByCategory,
  });

  return {
    isLoading,
    financeByCategory,
  };
};

export type FinanceByCategoryData = NonNullable<
  ReturnType<typeof useFinanceByCategory>["financeByCategory"]
>;
