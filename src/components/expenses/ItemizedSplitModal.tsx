// src/components/expenses/ItemizedSplitModal.tsx

import { useState, useEffect } from 'react';
import { X, Plus, Trash2, ChevronsUpDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { type ItemizedSplitConfig, type ItemizedItem } from './AddExpenseModal';

interface Member {
  userId: string;
  userName: string;
}

interface ItemizedSplitModalProps {
  open: boolean;
  onClose: () => void;
  members: Member[];
  totalAmount: number;
  currency: string;
  currentUserId: string;
  onSave: (config: ItemizedSplitConfig) => void;
  initialConfig?: ItemizedSplitConfig;
}

function ItemizedSplitModal({
  open,
  onClose,
  members,
  totalAmount,
  currency,
  currentUserId,
  onSave,
  initialConfig,
}: ItemizedSplitModalProps) {
  const [items, setItems] = useState<ItemizedItem[]>([]);
  const [itemAmounts, setItemAmounts] = useState<Record<string, string>>({});
  const [popoverOpenStates, setPopoverOpenStates] = useState<Record<string, boolean>>({});

  // Initialize items when modal opens
  useEffect(() => {
    if (open) {
      if (initialConfig?.items && initialConfig.items.length > 0) {
        setItems(initialConfig.items);
        // Initialize string amounts from config
        const amounts: Record<string, string> = {};
        initialConfig.items.forEach(item => {
          amounts[item.id] = item.amount.toString();
        });
        setItemAmounts(amounts);
      } else {
        // Start with one empty item
        const newId = crypto.randomUUID();
        setItems([
          {
            id: newId,
            description: '',
            amount: 0,
            assignedTo: members.map(m => m.userId),
          },
        ]);
        setItemAmounts({ [newId]: '' });
      }
      setPopoverOpenStates({});
    }
  }, [open, members, initialConfig]);

  const addItem = () => {
    const newId = crypto.randomUUID();
    setItems(prev => [
      ...prev,
      {
        id: newId,
        description: '',
        amount: 0,
        assignedTo: members.map(m => m.userId),
      },
    ]);
    setItemAmounts(prev => ({ ...prev, [newId]: '' }));
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(prev => prev.filter(item => item.id !== id));
      setItemAmounts(prev => {
        const newAmounts = { ...prev };
        delete newAmounts[id];
        return newAmounts;
      });
    }
  };

  const updateItem = (id: string, updates: Partial<ItemizedItem>) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const handleAmountChange = (id: string, value: string) => {
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

    // Store as string for display
    setItemAmounts(prev => ({ ...prev, [id]: cleanValue }));
    // Update item with numeric value
    updateItem(id, { amount: parseFloat(cleanValue) || 0 });
  };

  const toggleMemberSelection = (itemId: string, userId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const isSelected = item.assignedTo.includes(userId);
    const newAssignedTo = isSelected
      ? item.assignedTo.filter(id => id !== userId)
      : [...item.assignedTo, userId];

    updateItem(itemId, { assignedTo: newAssignedTo });
  };

  const togglePopover = (itemId: string, isOpen: boolean) => {
    setPopoverOpenStates(prev => ({
      ...prev,
      [itemId]: isOpen,
    }));
  };

  // Calculate grand total
  const grandTotal = items.reduce((sum, item) => sum + (item.amount || 0), 0);

  // Check if totals match (allow 1 cent rounding error)
  const difference = Math.abs(totalAmount - grandTotal);
  const totalsMatch = difference == 0;

  // Check if all items are valid
  const isValid = 
    totalsMatch &&
    items.every(item => 
      item.description.trim().length > 0 && 
      item.amount > 0 &&
      item.assignedTo.length > 0
    );

  const handleSave = () => {
    onSave({ items });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] p-0 gap-0 max-h-[90vh]">
        {/* Header */}
        <DialogHeader className="bg-primary text-primary-foreground p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Itemized expense</DialogTitle>
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
        <div className="flex flex-col max-h-[calc(90vh-180px)]">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-2 p-4 pb-2 text-sm font-medium text-muted-foreground border-b">
            <div className="col-span-5">Item</div>
            <div className="col-span-3 text-left">{currency}</div>
            <div className="col-span-3">Members</div>
            <div className="col-span-1"></div>
          </div>

          {/* Scrollable items list */}
          <div className="flex-1 overflow-y-auto p-2 pt-2 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-start">
                {/* Description */}
                <div className="col-span-5">
                  <Input
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, { description: e.target.value })}
                    className="h-10"
                  />
                </div>

                {/* Amount */}
                <div className="col-span-3">
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={itemAmounts[item.id] || ''}
                    onChange={(e) => handleAmountChange(item.id, e.target.value)}
                    className="h-10 text-right"
                  />
                </div>

                {/* Members multi-select */}
                <div className="col-span-3">
                  <Popover 
                    open={popoverOpenStates[item.id] || false}
                    onOpenChange={(isOpen) => togglePopover(item.id, isOpen)}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        className="w-full justify-between h-10 text-sm"
                      >
                        <span className="truncate">
                          {item.assignedTo.length === 0
                            ? '0'
                            : item.assignedTo.length === members.length
                            ? 'All'
                            : `${item.assignedTo.length}`
                          }
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[250px] p-0" align="start">
                      <Command>
                        <CommandList>
                          <CommandEmpty>No members found.</CommandEmpty>
                          <CommandGroup>
                            {members.map((member) => {
                              const isSelected = item.assignedTo.includes(member.userId);
                              return (
                                <CommandItem
                                  key={member.userId}
                                  onSelect={() => toggleMemberSelection(item.id, member.userId)}
                                  className="cursor-pointer py-3"
                                >
                                  <Checkbox
                                    checked={isSelected}
                                    className="mr-2"
                                  />
                                  <span className="flex-1 truncate">
                                    {member.userName}
                                    {member.userId === currentUserId && ' (you)'}
                                  </span>
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Delete button */}
                <div className="col-span-1 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    disabled={items.length === 1}
                    className="h-10 w-10"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}

            {/* Add item button */}
            <Button
              type="button"
              variant="outline"
              onClick={addItem}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add item
            </Button>
          </div>

          {/* Grand total */}
          <div className="border-t p-4 bg-muted/30 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Total of items:</span>
              <span className={!totalsMatch ? 'text-destructive font-medium' : 'font-medium'}>
                {currency} {grandTotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Expense amount:</span>
              <span className="font-medium">{currency} {totalAmount.toFixed(2)}</span>
            </div>
            {!totalsMatch && (
              <div className="text-sm text-destructive">
                {grandTotal > totalAmount 
                  ? `Items exceed total by ${currency} ${difference.toFixed(2)}`
                  : `Items are short by ${currency} ${difference.toFixed(2)}`
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

export default ItemizedSplitModal;