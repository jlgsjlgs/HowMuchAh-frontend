// src/components/expenses/ExactSplitModal.tsx

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type ExactSplitConfig } from './AddExpenseModal';

interface Member {
  userId: string;
  userName: string;
}

interface ExactSplitModalProps {
  open: boolean;
  onClose: () => void;
  members: Member[];
  totalAmount: number;
  currency: string;
  currentUserId: string;
  onSave: (config: ExactSplitConfig) => void;
  initialConfig?: ExactSplitConfig;
}

function ExactSplitModal({
  open,
  onClose,
  members,
  totalAmount,
  currency,
  currentUserId,
  onSave,
  initialConfig,
}: ExactSplitModalProps) {
  const [amounts, setAmounts] = useState<Record<string, string>>({});

  // Initialize amounts when modal opens
  useEffect(() => {
    if (open) {
      if (initialConfig?.amounts) {
        // Load from existing config
        const stringAmounts: Record<string, string> = {};
        Object.entries(initialConfig.amounts).forEach(([userId, amount]) => {
          stringAmounts[userId] = amount.toString();
        });
        setAmounts(stringAmounts);
      } else {
        // Initialize with equal split
        const equalAmount = totalAmount / members.length;
        const initialAmounts: Record<string, string> = {};
        members.forEach(member => {
          initialAmounts[member.userId] = equalAmount.toFixed(2);
        });
        setAmounts(initialAmounts);
      }
    }
  }, [open, members, totalAmount, initialConfig]);

  const handleAmountChange = (userId: string, value: string) => {
    // Only allow numbers and one decimal point
    let cleanValue = value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const parts = cleanValue.split('.');
    if (parts.length > 2) {
      cleanValue = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limit to 2 decimal places
    if (parts[1]?.length > 2) {
      cleanValue = parts[0] + '.' + parts[1].substring(0, 2);
    }

    setAmounts(prev => ({
      ...prev,
      [userId]: cleanValue,
    }));
  };

  // Calculate total of all amounts
  const calculateTotal = () => {
    return Object.values(amounts).reduce((sum, amountStr) => {
      const amount = parseFloat(amountStr) || 0;
      return sum + amount;
    }, 0);
  };

  const currentTotal = calculateTotal();
  const difference = Math.abs(totalAmount - currentTotal);
  const isValid = difference == 0; // Allow for rounding errors

  const handleSave = () => {
    const numericAmounts: Record<string, number> = {};
    Object.entries(amounts).forEach(([userId, amountStr]) => {
      numericAmounts[userId] = parseFloat(amountStr) || 0;
    });

    onSave({ amounts: numericAmounts });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 max-h-[90vh]">
        {/* Header */}
        <DialogHeader className="bg-primary text-primary-foreground p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Split by exact amounts</DialogTitle>
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
        <div className="flex flex-col max-h-[calc(90vh-140px)]">
          {/* Scrollable member list */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {members.map((member) => (
              <div key={member.userId} className="flex items-center gap-3">
                <Label className="flex-1 text-base">
                  {member.userName}
                  {member.userId === currentUserId && (
                    <span className="text-muted-foreground ml-1">(you)</span>
                  )}
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{currency}</span>
                  <Input
                    type="text"
                    inputMode="decimal"
                    value={amounts[member.userId] || ''}
                    onChange={(e) => handleAmountChange(member.userId, e.target.value)}
                    className="w-24 text-right"
                    placeholder="0.00"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Total summary */}
          <div className="border-t p-4 sm:p-6 space-y-3 bg-muted/30">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Total of splits:</span>
              <span className={!isValid ? 'text-destructive font-medium' : 'font-medium'}>
                {currency} {currentTotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Expense amount:</span>
              <span className="font-medium">{currency} {totalAmount.toFixed(2)}</span>
            </div>
            {!isValid && (
              <div className="text-sm text-destructive">
                {currentTotal > totalAmount 
                  ? `Splits exceed total by ${currency} ${difference.toFixed(2)}`
                  : `Splits are short by ${currency} ${difference.toFixed(2)}`
                }
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isValid}
            className="bg-primary"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ExactSplitModal;