import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowUp, ArrowDown, PiggyBank } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface UserProfileCardProps {
  avgSalary: number;
  avgSavings: number;
  avgExpenses: number;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ avgSalary, avgSavings, avgExpenses }) => {
  return (
    <Card className="glass-card h-full">
      <CardHeader className="flex-row items-center gap-4 space-y-0 pb-4">
         <UserIcon className="w-5 h-5 text-muted-foreground" />
        <CardTitle className="text-base font-semibold text-foreground/90">User Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-white/50">
            <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-xl font-semibold text-foreground">John Doe</p>
            <p className="text-sm text-muted-foreground">Financial Manager</p>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <StatItem 
            icon={<ArrowUp className="h-4 w-4 text-success" />}
            label="Avg. Salary/Month"
            value={avgSalary}
            valueColor="text-success"
          />
          <Separator />
          <StatItem 
            icon={<PiggyBank className="h-4 w-4 text-primary" />}
            label="Avg. Savings/Month"
            value={avgSavings}
            valueColor={avgSavings >= 0 ? 'text-primary' : 'text-destructive'}
          />
          <Separator />
          <StatItem 
            icon={<ArrowDown className="h-4 w-4 text-destructive" />}
            label="Avg. Expenses/Month"
            value={avgExpenses}
            valueColor="text-destructive"
          />
        </div>
      </CardContent>
    </Card>
  );
};

const StatItem = ({ icon, label, value, valueColor }: { icon: React.ReactNode, label: string, value: number, valueColor: string }) => (
  <div className="flex justify-between items-center">
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-muted-foreground">{label}</span>
    </div>
    <span className={cn("font-medium", valueColor)}>
      ₹{value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
    </span>
  </div>
);

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

export default UserProfileCard;
