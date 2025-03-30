import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  FinanceByCategoryData,
  useFinanceByCategory,
} from "@/features/dashboard/hooks/use-finance-by-category";
import { cn, ValidDateRange } from "@/lib/utils";

type CategoriesProps = {
  dateRange: ValidDateRange;
};

export const Categories = ({ dateRange }: CategoriesProps) => {
  const { isLoading, financeByCategory } = useFinanceByCategory({ dateRange });

  return (
    <div className="grid gap-4 grid-cols-3">
      {isLoading || !financeByCategory ? (
        <CategoriesSkeleton />
      ) : (
        <CategoriesCard financeByCategory={financeByCategory} />
      )}
    </div>
  );
};

const CategoriesSkeleton = () => {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-[62px] rounded-xl" />
      ))}
    </>
  );
};

const CategoriesCard = ({
  financeByCategory,
}: {
  financeByCategory: FinanceByCategoryData;
}) => {
  if (Object.keys(financeByCategory).length === 0) {
    return (
      <div className="grid justify-center" style={{ gridColumn: "1 / -1" }}>
        🤷 No data available on this period
      </div>
    );
  }

  return (
    <>
      {Object.entries(financeByCategory).map(([category, finance]) => {
        const moreIncome = finance.income >= finance.expense;
        const borderColor = moreIncome
          ? "border-emerald-500"
          : "border-rose-500";
        const bgColor = moreIncome ? "bg-emerald-100" : "bg-rose-100";
        const progressColor = moreIncome ? "bg-emerald-500" : "bg-rose-500";

        return (
          <Card
            key={category}
            className={cn(
              "transition-all hover:shadow-md justify-between",
              `border-l-4 ${borderColor}`
            )}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex justify-between">
                <span className="capitalize">{category}</span>
                <div className="flex flex-col items-end">
                  {finance.income !== 0 && (
                    <span className="text-emerald-600">
                      ${Math.abs(finance.income).toLocaleString()}
                    </span>
                  )}
                  {finance.expense !== 0 && (
                    <span className="text-rose-600">
                      -${Math.abs(finance.expense).toLocaleString()}
                    </span>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress
                value={
                  moreIncome
                    ? finance.percentageOfTotalIncome * 100
                    : finance.percentageOfTotalExpense * 100
                }
                className={cn("h-2", bgColor)}
                indicatorClassName={progressColor}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                {moreIncome
                  ? `${(finance.percentageOfTotalIncome * 100).toFixed(
                      1
                    )}% of total income`
                  : `${(finance.percentageOfTotalExpense * 100).toFixed(
                      1
                    )}% of total expenses`}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
};
