import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { INITIAL_INCOME_SOURCES, INITIAL_NEEDS_CATEGORIES, INITIAL_WANTS_CATEGORIES, INITIAL_INVESTMENT_TYPES } from '@/pages/Index';

interface TransactionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddIncome: (income: { amount: number; source: string; description: string }) => void;
  onAddExpense: (expense: { amount: number; description: string; category: string; type: 'needs' | 'wants' }) => void;
  onAddInvestment: (investment: { amount: number; type: string; description: string }) => void;
}

const TransactionSheet: React.FC<TransactionSheetProps> = ({ open, onOpenChange, onAddIncome, onAddExpense, onAddInvestment }) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [expenseType, setExpenseType] = useState<'needs' | 'wants'>('needs');
  const [incomeSource, setIncomeSource] = useState('');
  const [investmentType, setInvestmentType] = useState('');

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setCategory('');
    setExpenseType('needs');
    setIncomeSource('');
    setInvestmentType('');
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = (type: 'income' | 'expense' | 'investment') => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('Please fill in a valid amount.');
      return;
    }

    switch (type) {
      case 'income':
        if (!incomeSource) { alert('Please select an income source.'); return; }
        onAddIncome({ amount: numAmount, source: incomeSource, description });
        break;
      case 'expense':
        if (!category) { alert('Please select a category.'); return; }
        onAddExpense({ amount: numAmount, description, category, type: expenseType });
        break;
      case 'investment':
        if (!investmentType) { alert('Please select an investment type.'); return; }
        onAddInvestment({ amount: numAmount, type: investmentType, description });
        break;
    }
    handleClose();
  };

  const expenseCategories = expenseType === 'needs' ? INITIAL_NEEDS_CATEGORIES : INITIAL_WANTS_CATEGORIES;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add a New Transaction</SheetTitle>
          <SheetDescription>Track your income, expenses, and investments to stay on top of your finances.</SheetDescription>
        </SheetHeader>
        <Tabs defaultValue="expense" className="w-full mt-4" onValueChange={resetForm}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expense">Expense</TabsTrigger>
            <TabsTrigger value="investment">Investment</TabsTrigger>
          </TabsList>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input id="amount" type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input id="description" placeholder="e.g., Monthly Salary, Groceries" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>

          <TabsContent value="income" className="space-y-4">
            <div className="space-y-2">
              <Label>Source</Label>
              <Select value={incomeSource} onValueChange={setIncomeSource}>
                <SelectTrigger><SelectValue placeholder="Select income source" /></SelectTrigger>
                <SelectContent>
                  {INITIAL_INCOME_SOURCES.map(src => <SelectItem key={src} value={src}>{src}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <SheetFooter>
              <Button onClick={() => handleSubmit('income')} className="w-full bg-success hover:bg-success/90 text-success-foreground">Add Income</Button>
            </SheetFooter>
          </TabsContent>

          <TabsContent value="expense" className="space-y-4">
             <div className="space-y-2">
              <Label>Type</Label>
              <Tabs defaultValue="needs" value={expenseType} onValueChange={(v) => setExpenseType(v as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="needs">Needs</TabsTrigger>
                  <TabsTrigger value="wants">Wants</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>
                  {expenseCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
             <SheetFooter>
              <Button onClick={() => handleSubmit('expense')} className="w-full" variant="destructive">Add Expense</Button>
            </SheetFooter>
          </TabsContent>

          <TabsContent value="investment" className="space-y-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={investmentType} onValueChange={setInvestmentType}>
                <SelectTrigger><SelectValue placeholder="Select investment type" /></SelectTrigger>
                <SelectContent>
                  {INITIAL_INVESTMENT_TYPES.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <SheetFooter>
              <Button onClick={() => handleSubmit('investment')} className="w-full bg-blue-600 hover:bg-blue-700">Add Investment</Button>
            </SheetFooter>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default TransactionSheet;
