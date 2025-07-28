import React from 'react';
import { Investment } from '@/pages/Index';
import { TrendingUp, LineChart, CircleDollarSign, Wallet, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from './ui/card';

interface InvestmentsGridProps {
  investments: Investment[];
  onViewDetails: (type: string) => void;
}

const iconMap: { [key: string]: { icon: React.ReactNode, bg: string, text: string } } = {
  'Mutual Funds': { icon: <LineChart />, bg: 'bg-teal-500/10', text: 'text-teal-500' },
  'Stocks': { icon: <TrendingUp />, bg: 'bg-blue-500/10', text: 'text-blue-500' },
  'Gold': { icon: <CircleDollarSign />, bg: 'bg-yellow-500/10', text: 'text-yellow-500' },
  'Fixed Deposit': { icon: <Wallet />, bg: 'bg-purple-500/10', text: 'text-purple-500' },
};

const InvestmentsGrid: React.FC<InvestmentsGridProps> = ({ investments, onViewDetails }) => {

  const investmentSummary = React.useMemo(() => {
    if (!investments || investments.length === 0) return [];
    
    const summary = investments.reduce((acc, investment) => {
      if (!acc[investment.type]) {
        acc[investment.type] = 0;
      }
      acc[investment.type] += investment.amount;
      return acc;
    }, {} as { [key: string]: number });

    return Object.entries(summary).map(([type, amount]) => ({
      type,
      amount,
    }));
  }, [investments]);

  if (investmentSummary.length === 0) {
    return null;
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <Activity className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-base font-semibold text-foreground/90">Total Investments</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {investmentSummary.map(({ type, amount }) => {
          const style = iconMap[type] || { icon: <TrendingUp />, bg: 'bg-gray-500/10', text: 'text-gray-500' };

          return (
            <Card
              key={type}
              className="glass-card p-4 flex flex-col items-center justify-center text-center h-40 cursor-pointer group hover:animate-shake"
              onClick={() => onViewDetails(type)}
            >
              <div className={cn("h-12 w-12 rounded-full flex items-center justify-center mb-3", style.bg, style.text)}>
                {React.cloneElement(style.icon as React.ReactElement, { className: "h-6 w-6" })}
              </div>
              <p className="text-sm font-medium text-muted-foreground">{type}</p>
              <p className="text-lg font-bold text-foreground">₹{amount.toLocaleString('en-IN')}</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default InvestmentsGrid;
