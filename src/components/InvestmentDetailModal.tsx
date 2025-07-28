import React, { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Investment } from '@/pages/Index';
import { Separator } from './ui/separator';
import { cn } from '@/lib/utils';

interface InvestmentDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  transactions: Investment[];
  onDelete: (id: string) => void;
}

const InvestmentDetailModal: React.FC<InvestmentDetailModalProps> = ({ open, onOpenChange, title, transactions, onDelete }) => {
  const [deleteCandidate, setDeleteCandidate] = useState<string | null>(null);

  const groupedTransactions = useMemo(() => {
    if (!transactions) return {};
    return transactions.reduce((acc, transaction) => {
      const date = transaction.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(transaction);
      return acc;
    }, {} as { [key: string]: Investment[] });
  }, [transactions]);

  const sortedDates = useMemo(() => {
    return Object.keys(groupedTransactions).sort((a, b) => parseISO(b).getTime() - parseISO(a).getTime());
  }, [groupedTransactions]);

  const handleDeleteClick = (id: string) => {
    setDeleteCandidate(id);
  };

  const confirmDelete = () => {
    if (deleteCandidate) {
      onDelete(deleteCandidate);
    }
    setDeleteCandidate(null);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[550px] flex flex-col h-[70vh]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 min-h-0">
            <ScrollArea className="h-full pr-4">
              {sortedDates.length > 0 ? (
                <div className="space-y-6">
                  {sortedDates.map((date) => (
                    <div key={date}>
                      <p className="text-sm font-medium text-muted-foreground mb-2">{format(parseISO(date), 'EEEE, d MMMM yyyy')}</p>
                      <div className="space-y-2">
                        {groupedTransactions[date].map((tx) => (
                          <div key={tx.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                            <div>
                              <p className="font-medium text-foreground">
                                {tx.description || 'Investment'}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={cn("font-bold text-blue-600")}>
                                +₹{tx.amount.toLocaleString('en-IN')}
                              </span>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteClick(tx.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Separator className="mt-4" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No transactions for this investment type.</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteCandidate} onOpenChange={(isOpen) => !isOpen && setDeleteCandidate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this investment transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteCandidate(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default InvestmentDetailModal;
