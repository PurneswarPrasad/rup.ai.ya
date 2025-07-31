import React, { useState, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Loader2, Download, LetterTextIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import UserProfileCard from '@/components/UserProfileCard';
import FinancialOverviewCard from '@/components/FinancialOverviewCard';
import TransactionSheet from '@/components/TransactionSheet';
import { ThemeToggle } from '@/components/ThemeToggle';
import SavingsChart from '@/components/SavingsChart';
import WantsVsNeedsChart from '@/components/WantsVsNeedsChart';
import InvestmentsGrid from '@/components/InvestmentsGrid';
import { format, parse } from 'date-fns';
import FinPal from '@/components/FinPal';
import TransactionDetailModal from '@/components/TransactionDetailModal';
import InvestmentDetailModal from '@/components/InvestmentDetailModal';
import { useNavigation } from 'react-day-picker';
import { toast } from 'sonner';

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  type: 'needs' | 'wants';
  date: string; // YYYY-MM-DD
  month: string; // YYYY-MM
}

export interface Income {
  id: string;
  amount: number;
  source: string;
  description: string;
  date: string;
  month: string;
}

export interface Investment {
  id: string;
  amount: number;
  type: string;
  description: string;
  date: string;
  month: string;
}

export const INITIAL_NEEDS_CATEGORIES = ['Rent/EMI', 'Utilities', 'Groceries', 'Transport', 'Bills', 'Health'];
export const INITIAL_WANTS_CATEGORIES = ['Dining Out', 'Entertainment', 'Shopping', 'Travel', 'Hobbies'];
export const INITIAL_INCOME_SOURCES = ['Salary', 'Freelance', 'Business', 'Other'];
export const INITIAL_INVESTMENT_TYPES = ['Mutual Funds', 'Stocks', 'Fixed Deposit', 'Gold'];

const Index = () => {
  const [expenses, setExpenses] = useState<Expense[]>(() => JSON.parse(localStorage.getItem('expenses_v2') || '[]'));
  const [income, setIncome] = useState<Income[]>(() => JSON.parse(localStorage.getItem('income_v2') || '[]'));
  const [investments, setInvestments] = useState<Investment[]>(() => JSON.parse(localStorage.getItem('investments_v2') || '[]'));
  
  const [showTransactionSheet, setShowTransactionSheet] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  
  const [transactionModalState, setTransactionModalState] = useState<{ open: boolean; type: 'income' | 'expense' | 'investment' | null; title: string }>({ open: false, type: null, title: '' });
  const [investmentModalState, setInvestmentModalState] = useState<{ open: boolean; type: string | null; title: string }>({ open: false, type: null, title: '' });

  const [pickerMode, setPickerMode] = useState<'day' | 'month' | 'year'>('day');
  const [pickerYear, setPickerYear] = useState(new Date().getFullYear());
  const [yearGridStart, setYearGridStart] = useState(new Date().getFullYear() - 5);
  
  const [isImporting, setIsImporting] = useState(false);

  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  // Load and save data
  useEffect(() => { localStorage.setItem('expenses_v2', JSON.stringify(expenses)); }, [expenses]);
  useEffect(() => { localStorage.setItem('income_v2', JSON.stringify(income)); }, [income]);
  useEffect(() => { localStorage.setItem('investments_v2', JSON.stringify(investments)); }, [investments]);

  const addTransaction = (type: 'income' | 'expense' | 'investment', data: any) => {
    const date = format(selectedDate, 'yyyy-MM-dd');
    const month = format(selectedDate, 'yyyy-MM');
    const newTransaction = { ...data, id: Date.now().toString(), date, month };

    if (type === 'income') setIncome(prev => [newTransaction, ...prev]);
    else if (type === 'expense') setExpenses(prev => [newTransaction, ...prev]);
    else if (type === 'investment') setInvestments(prev => [newTransaction, ...prev]);
  };
  
  const handleDeleteTransaction = (id: string, type: 'income' | 'expense' | 'investment') => {
    if (type === 'income') {
      setIncome(prev => prev.filter(i => i.id !== id));
    } else if (type === 'expense') {
      setExpenses(prev => prev.filter(e => e.id !== id));
    }
    else {
      setInvestments(prev => prev.filter(inv => inv.id !== id));
    }
  };

  const handleDeleteInvestment = (id: string) => {
    setInvestments(prev => prev.filter(inv => inv.id !== id));
  };

  const handleViewTransactionDetails = (type: 'income' | 'expense' | 'investment') => {
    setTransactionModalState({
      open: true,
      type,
      title: type === 'income' ? 'Income Details' : type === 'expense' ? 'Expense Details' : 'Investment Details'
    });
  };

  const handleViewInvestmentDetails = (type: string) => {
    setInvestmentModalState({
      open: true,
      type: type,
      title: `${type} Transactions`
    });
  };

  const { avgSalary, avgExpenses, totalInvestmentsTillDate, avgSavings} = useMemo(() => {
    const allMonths = new Set([...income.map(i => i.month), ...expenses.map(e => e.month)]);
    if (allMonths.size === 0) {
      return { avgSalary: 0, avgExpenses: 0, totalInvestmentsTillDate: 0, avgSavings: 0 };
    }

    let totalSalary = 0;
    let totalExpensesNum = 0;
    let totalInvestmentsNum = 0;

    for (const month of allMonths) {
      const monthlyIncome = income.filter(i => i.month === month).reduce((sum, i) => sum + i.amount, 0);
      const monthlyExpenses = expenses.filter(e => e.month === month).reduce((sum, e) => sum + e.amount, 0);
      const monthlyInvestments = investments.filter(e => e.month === month).reduce((sum, e) => sum + e.amount, 0);
      
      totalSalary += monthlyIncome;
      totalExpensesNum += monthlyExpenses;
      totalInvestmentsNum += monthlyInvestments;
    }

    const numMonths = allMonths.size;
    const avgSalary = totalSalary / numMonths;
    const avgExpenses = totalExpensesNum / numMonths;
    const avgInvestments = totalInvestmentsNum / numMonths;
    const totalInvestmentsTillDate = totalInvestmentsNum;
    const avgSavings = avgSalary - avgExpenses - avgInvestments;

    return { avgSalary, avgExpenses,totalInvestmentsTillDate, avgSavings};
  }, [income, expenses, investments]);

  // Filtered data for selected month
  const selectedMonth = useMemo(() => format(selectedDate, 'yyyy-MM'), [selectedDate]);
  const currentMonthIncome = useMemo(() => income.filter(i => i.month === selectedMonth), [income, selectedMonth]);
  const currentMonthExpenses = useMemo(() => expenses.filter(e => e.month === selectedMonth), [expenses, selectedMonth]);
  const currentMonthInvestments = useMemo(() => investments.filter(e => e.month === selectedMonth), [investments, selectedMonth]);

  const selectedInvestmentTransactions = useMemo(() => {
    if (!investmentModalState.type) return [];
    return investments.filter(inv => inv.type === investmentModalState.type);
  }, [investments, investmentModalState.type]);

  // Calculations
  const totalIncome = useMemo(() => currentMonthIncome.reduce((sum, i) => sum + i.amount, 0), [currentMonthIncome]);
  const totalExpenses = useMemo(() => currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0), [currentMonthExpenses]);
  const totalInvestments = useMemo(() => currentMonthInvestments.reduce((sum, e) => sum + e.amount, 0), [currentMonthInvestments]);
  const totalSavings = totalIncome - totalExpenses - totalInvestments;

  const totalNeeds = useMemo(() => currentMonthExpenses.filter(e => e.type === 'needs').reduce((sum, e) => sum + e.amount, 0), [currentMonthExpenses]);
  const totalWants = useMemo(() => currentMonthExpenses.filter(e => e.type === 'wants').reduce((sum, e) => sum + e.amount, 0), [currentMonthExpenses]);

  const handleMonthSelect = (monthIndex: number) => {
    setCalendarMonth(new Date(pickerYear, monthIndex));
    setPickerMode('day');
  };

  const handleYearSelect = (year: number) => {
    setPickerYear(year);
    setPickerMode('month');
  };

  const handleImport = async () => {
    setIsImporting(true);
    try {
        const response = await fetch('https://api.sheety.co/77ccbae9ae41b8a3c560ca1d5caa7b1e/sampleUpload/sheet1');
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        const apiTransactions = data.sheet1;

        if (!apiTransactions || !Array.isArray(apiTransactions)) {
            throw new Error("Invalid data format received from API.");
        }

        const allExistingIds = new Set([
            ...income.map(i => i.id),
            ...expenses.map(e => e.id),
            ...investments.map(inv => inv.id)
        ]);

        const newIncomes: Income[] = [];
        const newExpenses: Expense[] = [];
        const newInvestments: Investment[] = [];

        for (const tx of apiTransactions) {
            const newId = `sheety-${tx.id}`;
            if (allExistingIds.has(newId)) {
                continue;
            }

            if (!tx.date || !tx.transactionKind || !tx.amount) {
                console.warn("Skipping incomplete transaction from API:", tx);
                continue;
            }

            const transactionDate = parse(tx.date, 'dd MMMM yyyy', new Date());
            if (isNaN(transactionDate.getTime())) {
                console.warn("Skipping transaction with invalid date:", tx);
                continue;
            }

            const dateStr = format(transactionDate, 'yyyy-MM-dd');
            const monthStr = format(transactionDate, 'yyyy-MM');

            const commonData = {
                id: newId,
                amount: Number(tx.amount),
                description: tx.description || '',
                date: dateStr,
                month: monthStr,
            };

            switch (tx.transactionKind) {
                case 'Income':
                    newIncomes.push({
                        ...commonData,
                        source: tx['incomeSource/ExpenseCategory/investmentType'] || 'Other',
                    });
                    break;
                case 'Expense':
                    newExpenses.push({
                        ...commonData,
                        category: tx['incomeSource/ExpenseCategory/investmentType'] || 'Other',
                        type: tx.transactionType?.toLowerCase() === 'wants' ? 'wants' : 'needs',
                    });
                    break;
                case 'Investment':
                    newInvestments.push({
                        ...commonData,
                        type: tx['incomeSource/ExpenseCategory/investmentType'] || 'Other',
                    });
                    break;
                default:
                    console.warn(`Unknown transaction kind: ${tx.transactionKind}`);
            }
        }
        
        const totalNew = newIncomes.length + newExpenses.length + newInvestments.length;

        if (totalNew > 0) {
            setIncome(prev => [...prev, ...newIncomes]);
            setExpenses(prev => [...prev, ...newExpenses]);
            setInvestments(prev => [...prev, ...newInvestments]);
            toast.success("Import Successful!", {
                description: `${totalNew} new transaction(s) have been added.`,
            });
        } else {
            toast.info("No New Transactions", {
                description: "Your records are already up-to-date.",
            });
        }

    } catch (error) {
        console.error("Failed to import transactions:", error);
        toast.error("Import Failed", {
            description: error instanceof Error ? error.message : "Could not fetch or process transaction data.",
        });
    } finally {
        setIsImporting(false);
    }
  };

  const CustomCaption = (props: { displayMonth: Date }) => {
    const { goToMonth, nextMonth, previousMonth } = useNavigation();
    return (
      <div className="flex items-center justify-center relative pt-1 mb-4">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 absolute left-1"
          disabled={!previousMonth}
          onClick={() => previousMonth && goToMonth(previousMonth)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => setPickerMode('year')}
          className="text-sm font-medium"
        >
          {format(props.displayMonth, 'MMMM yyyy')}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 absolute right-1"
          disabled={!nextMonth}
          onClick={() => nextMonth && goToMonth(nextMonth)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  const renderCalendarContent = () => {
    switch (pickerMode) {
      case 'year':
        return (
          <div className="p-3">
            <div className="flex items-center justify-center relative pt-1 mb-4">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 absolute left-1"
                onClick={() => setYearGridStart(yearGridStart - 12)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                {yearGridStart} - {yearGridStart + 11}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 absolute right-1"
                onClick={() => setYearGridStart(yearGridStart + 12)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 12 }).map((_, i) => {
                const year = yearGridStart + i;
                return (
                  <Button
                    key={year}
                    variant={year === pickerYear ? 'default' : 'ghost'}
                    onClick={() => handleYearSelect(year)}
                  >
                    {year}
                  </Button>
                );
              })}
            </div>
          </div>
        );
      case 'month':
        return (
          <div className="p-3">
            <div className="flex items-center justify-center relative pt-1 mb-4">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 absolute left-1"
                onClick={() => setPickerMode('year')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">{pickerYear}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 12 }).map((_, i) => (
                <Button
                  key={i}
                  variant={i === calendarMonth.getMonth() && pickerYear === calendarMonth.getFullYear() ? 'default' : 'ghost'}
                  onClick={() => handleMonthSelect(i)}
                >
                  {format(new Date(pickerYear, i), 'MMM')}
                </Button>
              ))}
            </div>
          </div>
        );
      case 'day':
      default:
        return (
          <Calendar
            mode="single"
            selected={selectedDate}
            month={calendarMonth}
            onMonthChange={setCalendarMonth}
            onSelect={(date) => {
              if (date) {
                setSelectedDate(date);
                setIsCalendarOpen(false);
                setPickerMode('day'); // Reset picker mode on selection
              }
            }}
            components={{
              Caption: (props) => <CustomCaption {...props} />,
            }}
            initialFocus
          />
        );
    }
  };

  const handleLogOut = () => {
    sessionStorage.clear();
    window.location.href = "/"; // or use navigate("/") if you're using react-router
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-6 md:mb-8">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground/90">
              Rup.<span className="text-primary">ai</span>.ya
            </h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <Popover open={isCalendarOpen} onOpenChange={(isOpen) => {
              setIsCalendarOpen(isOpen);
              if (isOpen) {
                setCalendarMonth(selectedDate);
                setPickerYear(selectedDate.getFullYear());
                setYearGridStart(selectedDate.getFullYear() - 5);
              } else {
                setPickerMode('day');
              }
            }}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-auto justify-start text-left font-normal month-selector">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span className="hidden md:inline">{format(selectedDate, 'd MMMM yyyy')}</span>
                  <span className="md:hidden">{format(selectedDate, "d MMM, yy")}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                {renderCalendarContent()}
              </PopoverContent>
            </Popover>
            <Button 
              variant="outline" 
              onClick={handleImport} 
              disabled={isImporting}
              className="w-9 p-0 md:w-auto md:px-3"
            >
              {isImporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Download className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Import</span>
                </>
              )}
            </Button>
            <Button 
              size="sm" 
              onClick={() => setShowTransactionSheet(true)} 
              className="add-transaction bg-success hover:bg-success/90 text-success-foreground w-9 p-0 md:w-auto md:px-3"
            >
              <Plus className="h-4 w-4 md:mr-2" />
              <span className="hidden md:inline">Add</span>
            </Button>
            <Button 
              onClick={() => setShowLogoutDialog(true)}
              variant="outline"
              className="bg-transparent border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white transition-all duration-300"
            >
              Log out
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <main className="space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
            <div className="lg:col-span-2 user-profile">
              <UserProfileCard 
                avgSalary={avgSalary}
                avgExpenses={avgExpenses}
                totalInvestments={totalInvestmentsTillDate}
                avgSavings={avgSavings}
              />
            </div>
            <div className="lg:col-span-3 financial-overview">
              <FinancialOverviewCard 
                income={totalIncome}
                expenses={totalExpenses}
                investments={totalInvestments}
                savings={totalSavings}
                onViewIncomeDetails={() => handleViewTransactionDetails('income')}
                onViewExpenseDetails={() => handleViewTransactionDetails('expense')}
                onViewInvestmentDetails={() => handleViewTransactionDetails('investment')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
            <div className={`${currentMonthExpenses.length > 0 ? "lg:col-span-3" : "lg:col-span-5"} savings-chart`}>
              <SavingsChart income={income} expenses={expenses} investments={investments}/>
            </div>
            {currentMonthExpenses.length > 0 && (
              <div className="lg:col-span-2">
                <WantsVsNeedsChart totalNeeds={totalNeeds} totalWants={totalWants} />
              </div>
            )}
          </div>

          <div className="investments-grid">
            <InvestmentsGrid 
              investments={investments} 
              onViewDetails={handleViewInvestmentDetails}
            />
          </div>
        </main>
      </div>

      <TransactionSheet
        open={showTransactionSheet}
        onOpenChange={setShowTransactionSheet}
        onAddIncome={(data) => addTransaction('income', data)}
        onAddExpense={(data) => addTransaction('expense', data)}
        onAddInvestment={(data) => addTransaction('investment', data)}
      />

      <TransactionDetailModal
        open={transactionModalState.open}
        onOpenChange={(isOpen) => setTransactionModalState(prev => ({ ...prev, open: isOpen }))}
        title={transactionModalState.title}
        transactions={transactionModalState.type === 'income' ? currentMonthIncome : transactionModalState.type === 'expense' ? currentMonthExpenses : currentMonthInvestments}
        type={transactionModalState.type}
        onDelete={handleDeleteTransaction}
      />
      
      <InvestmentDetailModal
        open={investmentModalState.open}
        onOpenChange={(isOpen) => setInvestmentModalState(prev => ({ ...prev, open: isOpen }))}
        title={investmentModalState.title}
        transactions={selectedInvestmentTransactions}
        onDelete={handleDeleteInvestment}
      />

      <FinPal 
        income={income}
        expenses={expenses}
        investments={investments}
      />

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out? You will need to log in again to access your data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowLogoutDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={handleLogOut}
            >
              Log Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
