// src/components/expenses/ExpenseDetailModal.tsx

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { expenseQueries } from '@/services/expenses/queries';
import { expenseMutations } from '@/services/expenses/mutations';
import { useApiErrorHandler } from '@/hooks/useApiErrorHandler';
import { useState } from 'react';

interface ExpenseDetailModalProps {
  open: boolean;
  onClose: () => void;
  expenseId: string;
  groupId: string;
}

function ExpenseDetailModal({ open, onClose, expenseId, groupId }: ExpenseDetailModalProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();

  const handleError = useApiErrorHandler();

  // Fetch expense details
  const { data: expense, isLoading } = useQuery({
    queryKey: ['expense', expenseId],
    queryFn: () => expenseQueries.getById(expenseId),
    enabled: open && !!expenseId,
  });

  // Delete mutation
  const { mutate: deleteExpense, isPending: isDeleting } = useMutation({
    mutationFn: expenseMutations.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses', groupId] });
      toast.success('Expense deleted successfully!');
      setShowDeleteDialog(false);
      onClose();
    },
    onError: handleError,
  });

  const handleDelete = () => {
    deleteExpense(expenseId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Check if expense is fully settled
  const isSettled = expense?.splits.every(split => split.isSettled) ?? false;

  if (isLoading || !expense) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] p-0 gap-0 max-h-[90vh]">
          {/* Header */}
          <DialogHeader className="bg-primary text-primary-foreground p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">Expense Details</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-10 w-10 sm:h-8 sm:w-8 text-primary-foreground hover:bg-primary-foreground/20"
              >
                <X className="h-5 w-5 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {/* Description */}
            <div>
              <Label className="text-sm text-muted-foreground">Description</Label>
              <p className="text-base font-medium mt-1 break-words">{expense.description}</p>
            </div>

            {/* Total Amount */}
            <div>
              <Label className="text-sm text-muted-foreground">Total Amount</Label>
              <p className="text-2xl font-bold mt-1 break-all">
                {formatCurrency(expense.totalAmount, expense.currency)}
              </p>
            </div>

            {/* Date */}
            <div>
              <Label className="text-sm text-muted-foreground">Date</Label>
              <p className="text-base mt-1">{formatDate(expense.expenseDate)}</p>
            </div>

            {/* Category */}
            <div>
              <Label className="text-sm text-muted-foreground">Category</Label>
              <p className="text-base mt-1">{expense.category}</p>
            </div>

            {/* Paid By */}
            <div>
              <Label className="text-sm text-muted-foreground">Paid By</Label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                <p className="text-base font-medium break-words">{expense.paidBy.name}</p>
                <span className="text-xs text-muted-foreground break-all">({expense.paidBy.email})</span>
              </div>
            </div>

            {/* Split Details */}
            <div>
              <Label className="text-sm text-muted-foreground mb-3 block">Split Details</Label>
              <div className="space-y-2 bg-muted/30 rounded-lg p-3">
                {expense.splits.map((split) => (
                  <div 
                    key={split.id} 
                    className="flex justify-between items-center gap-3 py-2 border-b last:border-b-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium break-words">{split.user.name}</p>
                      <p className="text-xs text-muted-foreground break-all">{split.user.email}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`font-semibold ${!split.isSettled ? 'text-destructive' : 'text-green-600'}`}>
                        {formatCurrency(split.amountOwed, expense.currency)}
                      </p>
                      <p className="text-xs text-muted-foreground whitespace-nowrap">
                        {split.isSettled ? 'Settled' : 'Pending'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timestamps */}
            <div className="text-xs text-muted-foreground pt-4 border-t space-y-1">
              <p>Created: {formatDate(expense.createdAt)}</p>
              <p>Last updated: {formatDate(expense.updatedAt)}</p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-between gap-2 p-4 border-t">
            <div>
              {!isSettled && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Expense?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this expense? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default ExpenseDetailModal;