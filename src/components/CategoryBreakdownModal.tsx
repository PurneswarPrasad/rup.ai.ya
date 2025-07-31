import React, { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Expense } from "@/pages/Index";

interface CategoryBreakdownModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expenses: Expense[];
  type: "needs" | "wants" | null;
  period: string;
  timeframe: string;
}

const CategoryBreakdownModal: React.FC<CategoryBreakdownModalProps> = ({
  open,
  onOpenChange,
  expenses,
  type,
  period,
  timeframe,
}) => {
  const categoryData = useMemo(() => {
    if (!type) return [];

    const filteredExpenses = expenses.filter(
      (expense) => expense.type === type
    );
    const categoryTotals = filteredExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as { [key: string]: number });

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        formattedAmount: `₹${amount.toLocaleString("en-IN")}`,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses, type]);

  const chartConfig = {
    amount: {
      label: "Amount",
      color:
        type === "needs" ? "hsl(var(--destructive))" : "hsl(var(--primary))",
    },
  };

  const totalAmount = categoryData.reduce((sum, item) => sum + item.amount, 0);

  if (!type) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] md:max-w-[700px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="capitalize">
            {type} Breakdown - {period}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Total {type}: ₹{totalAmount.toLocaleString("en-IN")}
          </p>
        </DialogHeader>

        <div className="flex-1 min-h-0 mt-4">
          {categoryData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  maxBarSize={60}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="category"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    interval={0}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name, props) => (
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground">
                              {props.payload.category}
                            </span>
                            <span className="text-muted-foreground">
                              Amount:{" "}
                              <span className="font-bold text-primary">
                                ₹{Number(value).toLocaleString("en-IN")}
                              </span>
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {((Number(value) / totalAmount) * 100).toFixed(1)}
                              % of total {type}
                            </span>
                          </div>
                        )}
                        indicator="dot"
                      />
                    }
                  />
                  <Bar
                    dataKey="amount"
                    fill={chartConfig.amount.color}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-[400px]">
              <p className="text-muted-foreground">
                No {type} data available for this period.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryBreakdownModal;
