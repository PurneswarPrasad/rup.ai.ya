import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";
import { Target } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Expense } from "@/pages/Index";
import CategoryBreakdownModal from "../components/CategoryBreakdownModal";

interface WantsVsNeedsChartProps {
  expenses: Expense[];
  timeframe: TimeframeType;
  setTimeframe: (t: TimeframeType) => void;
  selectedPeriod: string;
  setSelectedPeriod: (p: string) => void;
}

type TimeframeType = "monthly" | "quarterly" | "yearly";

const WantsVsNeedsChart: React.FC<WantsVsNeedsChartProps> = ({
  expenses,
  timeframe,
  setTimeframe,
  selectedPeriod,
  setSelectedPeriod,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<
    "needs" | "wants" | null
  >(null);

  // Filter expenses based on selected timeframe and period
  const filteredExpenses = useMemo(() => {
    if (!selectedPeriod) return [];

    return expenses.filter((expense) => {
      const date = new Date(expense.date);
      const year = date.getFullYear();
      const month = date.getMonth();

      switch (timeframe) {
        case "monthly": {
          const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
          return monthKey === selectedPeriod;
        }
        case "quarterly": {
          const quarter = Math.floor(month / 3) + 1;
          const quarterKey = `${year}-Q${quarter}`;
          return quarterKey === selectedPeriod;
        }
        case "yearly":
          return year.toString() === selectedPeriod;
        default:
          return false;
      }
    });
  }, [expenses, timeframe, selectedPeriod]);

  const totalNeeds = useMemo(
    () =>
      filteredExpenses
        .filter((e) => e.type === "needs")
        .reduce((sum, e) => sum + e.amount, 0),
    [filteredExpenses]
  );

  const totalWants = useMemo(
    () =>
      filteredExpenses
        .filter((e) => e.type === "wants")
        .reduce((sum, e) => sum + e.amount, 0),
    [filteredExpenses]
  );

  const total = totalNeeds + totalWants;
  const needsPercentage =
    total > 0 ? Math.round((totalNeeds / total) * 100) : 0;
  const wantsPercentage = total > 0 ? 100 - needsPercentage : 0;

  const chartConfig = {
    Needs: { label: "Needs", color: "hsl(var(--destructive))" },
    Wants: { label: "Wants", color: "hsl(var(--primary))" },
  };

  const chartData = [
    { name: "Needs", value: totalNeeds },
    { name: "Wants", value: totalWants },
  ];

  const handleSegmentClick = (data: any) => {
    if (data && data.name && total > 0) {
      setSelectedSegment(data.name.toLowerCase() as "needs" | "wants");
      setModalOpen(true);
    }
  };

  const formatPeriodLabel = (period: string) => {
    if (timeframe === "monthly") {
      const [year, month] = period.split("-");
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    }
    return period;
  };

  const availablePeriods = useMemo(() => {
    const periods = new Set<string>();
    expenses.forEach((expense) => {
      const date = new Date(expense.date);
      const year = date.getFullYear();
      const month = date.getMonth();
      switch (timeframe) {
        case "monthly":
          periods.add(`${year}-${String(month + 1).padStart(2, "0")}`);
          break;
        case "quarterly": {
          const quarter = Math.floor(month / 3) + 1;
          periods.add(`${year}-Q${quarter}`);
          break;
        }
        case "yearly":
          periods.add(year.toString());
          break;
      }
    });
    return Array.from(periods).sort().reverse();
  }, [expenses, timeframe]);

  if (total === 0) {
    return null;
  }

  return (
    <>
      <Card className="glass-card flex flex-col h-full">
        <CardHeader className="flex-row items-center gap-4 space-y-0 pb-4">
          <Target className="w-5 h-5 text-muted-foreground" />
          <CardTitle className="text-base font-semibold text-foreground/90">
            Wants vs Needs
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-4">
          {/* Timeframe Selection */}
          <div className="flex gap-2 mb-4">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                {availablePeriods.map((period) => (
                  <SelectItem key={period} value={period}>
                    {formatPeriodLabel(period)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Chart */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <ChartContainer
              config={chartConfig}
              className="relative mx-auto aspect-square h-48 w-48 sm:h-56 sm:w-56 cursor-pointer"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        hideLabel
                        formatter={(value, name) => (
                          <div className="flex flex-col p-1">
                            <span className="font-bold text-foreground">
                              {name}
                            </span>
                            <span className="text-muted-foreground">
                              ₹{Number(value).toLocaleString("en-IN")}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Click to view breakdown
                            </span>
                          </div>
                        )}
                      />
                    }
                  />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="70%"
                    outerRadius="100%"
                    startAngle={90}
                    endAngle={450}
                    onClick={handleSegmentClick}
                  >
                    {chartData.map((entry) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={`var(--color-${entry.name})`}
                        stroke={`var(--color-${entry.name})`}
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-destructive">
                  {needsPercentage}%
                </span>
                <span className="text-sm text-muted-foreground">Needs</span>
              </div>
            </ChartContainer>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive" />
                <span>Needs ({needsPercentage}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                <span>Wants ({wantsPercentage}%)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <CategoryBreakdownModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        expenses={filteredExpenses}
        type={selectedSegment}
        period={formatPeriodLabel(selectedPeriod)}
        timeframe={timeframe}
      />
    </>
  );
};

export default WantsVsNeedsChart;
