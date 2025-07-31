import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import InfoIconWithTooltip from '@/components/ui/InfoIconWithTooltip';
import { Button } from '@/components/ui/button';
import { Landmark, PiggyBank, ShoppingCart, Wallet, ChevronRight, ChartNoAxesCombined } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FinancialOverviewCardProps {
  income: number;
  expenses: number;
  investments: number;
  savings: number;
  onViewIncomeDetails: () => void;
  onViewExpenseDetails: () => void;
  onViewInvestmentDetails: () => void;
}

const FinancialOverviewCard: React.FC<FinancialOverviewCardProps> = ({ income, expenses, investments, savings, onViewIncomeDetails, onViewExpenseDetails, onViewInvestmentDetails }) => {
  return (
    <Card className="glass-card h-full">
      <CardHeader className="flex-row items-center gap-4 space-y-0 pb-4">
        <Landmark className="w-5 h-5 text-muted-foreground" />
        <CardTitle className="text-base font-semibold text-foreground/90">Financial Overview</CardTitle>
        <InfoIconWithTooltip text={
          <>
            Your complete financial summary for the <strong>current month</strong> including total income, expenses, investments, and current net savings.
          </>
        } />
      </CardHeader>
      <CardContent className="space-y-2">
        <OverviewItem 
          title="Income" 
          amount={income} 
          icon={<Wallet className="h-4 w-4" />} 
          colorClass="text-success"
          iconBgClass="bg-success/10 hover:bg-success/20"
          onViewDetails={onViewIncomeDetails}
        />
        <OverviewItem 
          title="Expenses" 
          amount={expenses} 
          icon={<ShoppingCart className="h-4 w-4" />} 
          colorClass="text-destructive"
          iconBgClass="bg-destructive/10 hover:bg-destructive/20"
          onViewDetails={onViewExpenseDetails}
        />
        <OverviewItem 
          title="Investments" 
          amount={investments} 
          icon={<ChartNoAxesCombined className="h-4 w-4" />} 
          colorClass="text-yellow-500"
          iconBgClass="bg-yellow-900/20 hover:bg-yellow-900/30"
          onViewDetails={onViewInvestmentDetails}
        />
        <OverviewItem 
          title="Balance at the end of the month/Savings" 
          amount={savings} 
          icon={<PiggyBank className="h-4 w-4" />} 
          colorClass={savings >= 0 ? 'text-primary' : 'text-destructive'}
          iconBgClass="bg-primary/10 hover:bg-primary/20"
        />
      </CardContent>
    </Card>
  );
};

interface OverviewItemProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  colorClass: string;
  iconBgClass: string;
  onViewDetails?: () => void;
}

const OverviewItem: React.FC<OverviewItemProps> = ({ title, amount, icon, colorClass, iconBgClass, onViewDetails }) => {
  const Component = onViewDetails ? 'button' : 'div';
  return (
    <Component
      className={cn(
        "flex items-center justify-between p-2 rounded-lg w-full text-left",
        onViewDetails && "hover:bg-muted/50 cursor-pointer transition-colors"
      )}
      onClick={onViewDetails}
    >
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className={cn("text-2xl font-bold", colorClass)}>₹{amount.toLocaleString('en-IN')}</p>
      </div>
      <div className="flex items-center gap-1">
        <div className={cn("rounded-full h-10 w-10 flex items-center justify-center", iconBgClass, colorClass)}>
          {icon}
        </div>
        {onViewDetails && <ChevronRight className="h-5 w-5 text-muted-foreground" />}
      </div>
    </Component>
  );
};

export default FinancialOverviewCard;
