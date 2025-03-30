"use client";

import { Spinner } from "@/components/spinner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  FinancialChartData,
  useFinancialChartData,
} from "@/features/dashboard/hooks/use-financial-chart-data";
import { GroupBy } from "@/features/dashboard/types";
import { ValidDateRange } from "@/lib/utils";
import { BarChart3, LineChartIcon, PieChartIcon } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
  Pie,
  Cell,
} from "recharts";

type ChartType = "bar" | "line" | "pie";

type FinancialChartProps = {
  dateRange: ValidDateRange;
};

export const FinancialChart = ({ dateRange }: FinancialChartProps) => {
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [groupBy, setGroupBy] = useState<GroupBy>("day");
  const { isLoading, financialChartData } = useFinancialChartData({
    dateRange,
    groupBy,
  });

  const renderChart = () => {
    if (isLoading || !financialChartData) {
      return (
        <div className="flex justify-center items-center h-full">
          <Spinner />
        </div>
      );
    }

    if (!Object.keys(financialChartData.financeByPeriod).length) {
      return (
        <div className="flex justify-center items-center h-full">
          🤷 No data available on this period
        </div>
      );
    }

    switch (chartType) {
      case "bar":
        return <FinancialBarChart financialChartData={financialChartData} />;
      case "line":
        return <FinancialLineChart financialChartData={financialChartData} />;
      case "pie":
        return <FinancialPieChart financialChartData={financialChartData} />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex justify-between space-y-4">
        <div>
          <CardTitle>Income vs Expenses</CardTitle>
          <CardDescription>Track your financial flow over time</CardDescription>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <ToggleGroup
            type="single"
            value={chartType}
            onValueChange={(value) => setChartType(value as ChartType)}
            className="bg-background border"
          >
            <ToggleGroupItem value="bar" aria-label="Bar Chart">
              <BarChart3 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="line" aria-label="Line Chart">
              <LineChartIcon className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="pie" aria-label="Pie Chart">
              <PieChartIcon className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>

          <Tabs
            defaultValue={groupBy}
            onValueChange={(value) => setGroupBy(value as GroupBy)}
          >
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
              <TabsTrigger value="total">Total</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">{renderChart()}</div>
      </CardContent>
    </Card>
  );
};

const FinancialBarChart = ({
  financialChartData,
}: {
  financialChartData: FinancialChartData;
}) => {
  const chartData = Object.entries(financialChartData.financeByPeriod).map(
    ([key, value]) => ({
      name: key,
      income: value.income,
      expense: value.expense,
    })
  );
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <YAxis
          tickFormatter={(value) => `$${value}`}
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <Tooltip
          labelFormatter={(label) => `Period: ${label}`}
          formatter={(value, name) => [`${name}: $${Number(value).toFixed(2)}`]}
          contentStyle={{
            borderRadius: "12px",
            padding: "10px",
          }}
        />
        <Legend />
        <Bar
          name="Income"
          dataKey="income"
          fill="var(--color-emerald-600)"
          radius={[8, 8, 0, 0]}
          barSize={30}
        />
        <Bar
          name="Expense"
          dataKey="expense"
          fill="var(--color-rose-600)"
          radius={[8, 8, 0, 0]}
          barSize={30}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

const FinancialLineChart = ({
  financialChartData,
}: {
  financialChartData: FinancialChartData;
}) => {
  const chartData = Object.entries(financialChartData.financeByPeriod).map(
    ([key, value]) => ({
      name: key,
      income: value.income,
      expense: value.expense,
    })
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <YAxis
          tickFormatter={(value) => `$${value}`}
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <Tooltip
          labelFormatter={(label) => `Period: ${label}`}
          formatter={(value, name) => [`${name}: $${Number(value).toFixed(2)}`]}
          contentStyle={{
            borderRadius: "12px",
            padding: "10px",
          }}
        />
        <Legend />
        <Line
          name="Income"
          type="monotone"
          dataKey="income"
          stroke="var(--color-emerald-600)"
          strokeWidth={3}
          dot={{ r: 4, fill: "var(--color-emerald-600)" }}
          activeDot={{ r: 6, fill: "var(--color-emerald-600)" }}
        />
        <Line
          name="Expense"
          type="monotone"
          dataKey="expense"
          stroke="var(--color-rose-600)"
          strokeWidth={3}
          dot={{ r: 4, fill: "var(--color-rose-600)" }}
          activeDot={{ r: 6, fill: "var(--color-rose-600)" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

const FinancialPieChart = ({
  financialChartData,
}: {
  financialChartData: FinancialChartData;
}) => {
  const chartData = [
    {
      name: "Income",
      value: Object.values(financialChartData.financeByPeriod).reduce(
        (sum, item) => sum + item.income,
        0
      ),
      color: "var(--color-emerald-600)",
    },
    {
      name: "Expenses",
      value: Object.values(financialChartData.financeByPeriod).reduce(
        (sum, item) => sum + item.expense,
        0
      ),
      color: "var(--color-rose-600)",
    },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={120}
          innerRadius={60}
          dataKey="value"
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`$${Number(value).toFixed(2)}`]}
          contentStyle={{
            borderRadius: "12px",
            padding: "10px",
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};
