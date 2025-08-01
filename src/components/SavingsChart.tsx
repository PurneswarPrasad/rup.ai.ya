import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { format } from "date-fns";
import { Income, Expense, Investment } from "@/pages/Index";
import { BarChart3 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface SavingsChartProps {
  income: Income[];
  expenses: Expense[];
  investments: Investment[];
  selectedYear: number;
  setSelectedYear: (y: number) => void;
  mode: "savings" | "expenses";
  setMode: (m: "savings" | "expenses") => void;
}

const SavingsChart: React.FC<SavingsChartProps> = ({
  income,
  expenses,
  investments,
  selectedYear,
  setSelectedYear,
  mode,
  setMode,
}) => {
  const chartConfig = {
    savings: { label: "Savings", color: "hsl(var(--primary))" },
  };

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    [...income, ...expenses].forEach((t) => {
      years.add(parseInt(t.month.substring(0, 4), 10));
    });
    const sortedYears = Array.from(years).sort((a, b) => b - a);
    if (sortedYears.length === 0) return [new Date().getFullYear()];
    return sortedYears;
  }, [income, expenses]);

  const savingsData = useMemo(() => {
    const monthlyData: {
      [key: string]: { income: number; expenses: number; investments: number };
    } = {};

    const yearIncome = income.filter((i) =>
      i.month.startsWith(selectedYear.toString())
    );
    const yearExpenses = expenses.filter((e) =>
      e.month.startsWith(selectedYear.toString())
    );
    const yearInvestments = investments.filter((e) =>
      e.month.startsWith(selectedYear.toString())
    );

    yearIncome.forEach((i) => {
      const month = i.month;
      monthlyData[month] = {
        ...monthlyData[month],
        income: (monthlyData[month]?.income || 0) + i.amount,
      };
    });
    yearExpenses.forEach((e) => {
      const month = e.month;
      monthlyData[month] = {
        ...monthlyData[month],
        expenses: (monthlyData[month]?.expenses || 0) + e.amount,
      };
    });
    yearInvestments.forEach((e) => {
      const month = e.month;
      monthlyData[month] = {
        ...monthlyData[month],
        investments: (monthlyData[month]?.investments || 0) + e.amount,
      };
    });

    return Array.from({ length: 12 }).map((_, i) => {
      const monthStr = (i + 1).toString().padStart(2, "0");
      const monthKey = `${selectedYear}-${monthStr}`;
      const data = monthlyData[monthKey] || {
        income: 0,
        expenses: 0,
        investments: 0,
      };
      const savings = data.income - data.expenses - data.investments;
      const date = new Date(selectedYear, i, 1);

      return {
        month: format(date, "MMM"),
        fullMonth: format(date, "MMMM yyyy"),
        savings,
      };
    });
  }, [income, expenses, investments, selectedYear]);

  const hasData = useMemo(
    () => savingsData.some((d) => d.savings !== 0),
    [savingsData]
  );

  // In chart data, if mode === 'savings', show savings, else show expenses
  const chartData = useMemo(() => {
    return savingsData.map((d, i) => {
      const monthKey = `${selectedYear}-${String(i + 1).padStart(2, "0")}`;
      const incomeForMonth = income
        .filter((x) => x.month === monthKey)
        .reduce((sum, x) => sum + x.amount, 0);
      const investmentsForMonth = investments
        .filter((x) => x.month === monthKey)
        .reduce((sum, x) => sum + x.amount, 0);
      return {
        ...d,
        value:
          mode === "savings"
            ? d.savings
            : incomeForMonth - investmentsForMonth - (d.savings),
      };
    });
  }, [savingsData, mode, income, investments, selectedYear]);

  return (
    <Card className="glass-card h-full">
      <CardHeader className="flex-row items-center justify-between gap-4 space-y-0 pb-4">
        <div className="flex items-center gap-4">
          <BarChart3 className="w-5 h-5 text-muted-foreground" />
          <CardTitle className="text-base font-semibold text-foreground/90">
            {mode === "savings" ? "Savings per Month" : "Expenses per Month"}
          </CardTitle>
          <Select value={mode} onValueChange={setMode}>
            <SelectTrigger className="w-[120px] ml-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="savings">Savings</SelectItem>
              <SelectItem value="expenses">Expenses</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Select
          value={selectedYear.toString()}
          onValueChange={(value) => setSelectedYear(Number(value))}
        >
          <SelectTrigger className="w-[100px] bg-transparent border-0 shadow-none focus:ring-0 focus:ring-offset-0 text-muted-foreground hover:text-foreground">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            {availableYears.map((year) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <ChartContainer config={chartConfig} className="h-64 sm:h-80 w-full">
            <ResponsiveContainer>
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border) / 0.5)"
                />
                <XAxis
                  dataKey="month"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                />
                <Tooltip
                  cursor={{
                    stroke: "hsl(var(--border))",
                    strokeWidth: 1,
                    strokeDasharray: "3 3",
                  }}
                  content={
                    <ChartTooltipContent
                      formatter={(value, name, props) => (
                        <div>
                          <div className="font-medium text-foreground">
                            {props.payload.fullMonth}
                          </div>
                          <div className="text-muted-foreground">
                            {mode === "savings" ? "Savings" : "Expenses"}:{" "}
                            <span className="font-bold text-primary">
                              ₹{Number(value).toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>
                      )}
                      indicator="dot"
                    />
                  }
                />
                <defs>
                  <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={chartConfig.savings.color}
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor={chartConfig.savings.color}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={chartConfig.savings.color}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSavings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="h-64 sm:h-80 w-full flex items-center justify-center">
            <p className="text-muted-foreground">
              No savings data for {selectedYear}.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavingsChart;
