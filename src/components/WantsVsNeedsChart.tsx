import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';
import { Target } from 'lucide-react';

interface WantsVsNeedsChartProps {
  totalNeeds: number;
  totalWants: number;
}

const WantsVsNeedsChart: React.FC<WantsVsNeedsChartProps> = ({ totalNeeds, totalWants }) => {
  const total = totalNeeds + totalWants;
  const needsPercentage = total > 0 ? Math.round((totalNeeds / total) * 100) : 0;
  const wantsPercentage = total > 0 ? 100 - needsPercentage : 0;

  const chartConfig = {
    Needs: { label: 'Needs', color: 'hsl(var(--destructive))' },
    Wants: { label: 'Wants', color: 'hsl(var(--primary))' },
  };

  const chartData = [
    { name: 'Needs', value: totalNeeds },
    { name: 'Wants', value: totalWants },
  ];
  
  return (
    <Card className="glass-card flex flex-col h-full">
      <CardHeader className="flex-row items-center gap-4 space-y-0 pb-4">
        <Target className="w-5 h-5 text-muted-foreground" />
        <CardTitle className="text-base font-semibold text-foreground/90">Wants vs Needs</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col items-center justify-center p-0">
        <ChartContainer
          config={chartConfig}
          className="relative mx-auto aspect-square h-48 w-48 sm:h-56 sm:w-56"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent
                  hideLabel 
                  formatter={(value, name) => (
                    <div className="flex flex-col p-1">
                      <span className="font-bold text-foreground">{name}</span>
                      <span className="text-muted-foreground">₹{Number(value).toLocaleString('en-IN')}</span>
                    </div>
                  )}
                />}
              />
              <Pie data={chartData} dataKey="value" nameKey="name" innerRadius="70%" outerRadius="100%" startAngle={90} endAngle={450}>
                {chartData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={`var(--color-${entry.name})`} stroke={`var(--color-${entry.name})`} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-destructive">{needsPercentage}%</span>
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
      </CardContent>
    </Card>
  );
};

export default WantsVsNeedsChart;
