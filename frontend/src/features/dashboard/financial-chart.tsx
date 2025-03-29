"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { mockChartData } from "@/lib/mock-data";
import { BarChart3, LineChart, PieChart } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartType = "bar" | "line" | "pie";

type GroupBy = "day" | "week" | "month" | "year" | "total";

export const FinancialChart = () => {
  const [chartType, setChartType] = useState<ChartType>("bar");
  const [groupBy, setGroupBy] = useState<GroupBy>("day");

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return <FinancialBarChart />;
      case "line":
        return <div>Line Chart</div>;
      case "pie":
        return <div>Pie Chart</div>;
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
              <LineChart className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="pie" aria-label="Pie Chart">
              <PieChart className="h-4 w-4" />
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

const FinancialBarChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={mockChartData.month}
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
          contentStyle={{
            borderRadius: "12px",
            padding: "10px",
            border: "1px solid var(--border)",
          }}
        />
        <Legend />
        <Bar
          name="Income"
          dataKey="income"
          fill="hsl(143, 85%, 40%)"
          radius={[8, 8, 0, 0]}
          barSize={30}
        />
        <Bar
          name="Expenses"
          dataKey="expenses"
          fill="hsl(364, 84%, 61%)"
          radius={[8, 8, 0, 0]}
          barSize={30}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
