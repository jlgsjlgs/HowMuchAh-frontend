// src/components/expenses/AddExpenseModal.tsx

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, ChevronsUpDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area'; // Import ScrollArea
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Field, FieldError } from '@/components/ui/field';
import { groupQueries } from '@/services/groups/queries';
import { CURRENCIES } from '@/lib/currencies';
import { type CreateExpenseData, createExpenseSchema } from '@/schemas/expenseSchemas';
import ExactSplitModal from './ExactSplitModal';
import ItemizedSplitModal from './ItemizedSplitModal';
import { useExpenseSplits } from '@/hooks/useExpenseSplits';
import { useApiErrorHandler } from '@/hooks/useApiErrorHandler';
import { expenseMutations } from '@/services/expenses/mutations';

interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
  groupId: string;
  currentUserId: string;
}

// Split configuration types
export type SplitType = 'equal' | 'exact' | 'itemized';

export interface ExactSplitConfig {
  amounts: Record<string, number>; // userId -> amount
}

export interface ItemizedItem {
  id: string;
  description: string;
  amount: number;
  assignedTo: string[]; // array of userIds
}

export interface ItemizedSplitConfig {
  items: ItemizedItem[];
}

export type SplitConfig = {
  type: SplitType;
  exactConfig?: ExactSplitConfig;
  itemizedConfig?: ItemizedSplitConfig;
};

const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Groceries',
  'Travel',
  'Healthcare',
  'Other',
];

function AddExpenseModal({ open, onClose, groupId, currentUserId }: AddExpenseModalProps) {
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [memberPopoverOpen, setMemberPopoverOpen] = useState(false);
  
  // Split configuration state
  const [splitConfig, setSplitConfig] = useState<SplitConfig>({
    type: 'equal',
  });

  // Modal states
  const [exactSplitModalOpen, setExactSplitModalOpen] = useState(false);
  const [itemizedSplitModalOpen, setItemizedSplitModalOpen] = useState(false);

  const form = useForm<CreateExpenseData>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      description: '',
      totalAmount: undefined,
      currency: 'SGD',
      paidByUserId: currentUserId,
      category: 'Food & Dining',
      expenseDate: new Date().toISOString().split('T')[0],
      splitType: 'equal',
    },
  });

  const handleError = useApiErrorHandler<CreateExpenseData>(form.setError);

  const queryClient = useQueryClient();

  const { data: members, isLoading: membersLoading } = useQuery({
    queryKey: ['groupMembers', groupId],
    queryFn: () => groupQueries.getMembers(groupId),
    enabled: open && !!groupId,
  });

  const { mutate: createExpense, isPending } = useMutation({
    mutationFn: expenseMutations.create,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['expenses', groupId]});
      toast.success('Expense added successfully!');
      form.reset();
      onClose();
    },
    onError: handleError,
  })

  useEffect(() => {
    if (open) {
      form.reset({
        description: '',
        totalAmount: undefined,
        currency: 'SGD',
        paidByUserId: currentUserId,
        category: 'Food & Dining',
        expenseDate: new Date().toISOString().split('T')[0],
        splitType: 'equal',
      });
      setSelectedMembers([currentUserId]);
      setSplitConfig({ type: 'equal' });
    }
  }, [open, currentUserId, form]);

  // Handle split type change
  const handleSplitTypeChange = (newType: SplitType) => {
    if (newType === 'equal') {
      // Just update the config, no modal needed
      form.setValue('splitType', newType);
      setSplitConfig({ type: 'equal' });
    } else if (newType === 'exact') {
      // Open exact split modal (don't set splitType yet)
      setExactSplitModalOpen(true);
    } else if (newType === 'itemized') {
      // Open itemized split modal (don't set splitType yet)
      setItemizedSplitModalOpen(true);
    }
  };

  const selectedCurrency = CURRENCIES.find(c => c.code === form.watch('currency'));
  const paidByMember = members?.find(m => m.userId === form.watch('paidByUserId'));
  const descriptionLength = form.watch('description')?.length || 0;
  const description = form.watch('description');
  const totalAmount = form.watch('totalAmount');
  const splitType = form.watch('splitType');

  const isFormValid = 
    !!description && 
    description.trim().length > 0 &&
    !!totalAmount && 
    totalAmount > 0 &&
    selectedMembers.length > 0;

  // Get split type label
  const getSplitTypeLabel = () => {
    switch (splitType) {
      case 'equal':
        return 'equally';
      case 'exact':
        return 'unequally';
      case 'itemized':
        return 'as itemized';
      default:
        return 'equally';
    }
  };

  const splits = useExpenseSplits(
    totalAmount || 0,
    selectedMembers,
    splitConfig
  );

  const onSubmit = (data: CreateExpenseData) => {
    if (selectedMembers.length === 0) {
      return;
    }
    
    createExpense({
      groupId,
      description: data.description,
      totalAmount: data.totalAmount!,
      currency: data.currency,
      paidByUserId: data.paidByUserId,
      category: data.category,
      expenseDate: data.expenseDate,
      splits: splits, 
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px] p-0 gap-0 max-h-[90vh] flex flex-col">
          <DialogHeader className="bg-primary text-primary-foreground p-4 rounded-t-lg shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-semibold">Add an expense</DialogTitle>
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

          {/* Scrollable Form Content */}
          <ScrollArea className="flex-1 overflow-y-auto">
            <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-6">
              {/* Split among section */}
              <Field>
                <Label className="text-sm text-muted-foreground">Split among:</Label>
                <Popover open={memberPopoverOpen} onOpenChange={setMemberPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={memberPopoverOpen}
                      className="w-full justify-between mt-1 h-auto min-h-[44px] sm:min-h-[42px]"
                    >
                      <div className="flex flex-wrap gap-1 flex-1 mr-2">
                        {selectedMembers.length === 0 ? (
                          <span className="text-muted-foreground">Select members...</span>
                        ) : (
                          selectedMembers.map((memberId) => {
                            const member = members?.find(m => m.userId === memberId);
                            return (
                              <span 
                                key={memberId} 
                                className="bg-secondary px-2 py-0.5 rounded text-sm truncate max-w-[120px] inline-block"
                                title={member?.userName}
                              >
                                {member?.userName}
                              </span>
                            );
                          })
                        )}
                      </div>
                      <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[calc(100vw-2rem)] sm:w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command>
                      <CommandList>
                        <CommandEmpty>No members found.</CommandEmpty>
                        <CommandGroup>
                          {membersLoading ? (
                            <CommandItem disabled>Loading members...</CommandItem>
                          ) : (
                            members?.map((member) => {
                              const isSelected = selectedMembers.includes(member.userId);
                              return (
                                <CommandItem
                                  key={member.userId}
                                  onSelect={() => {
                                    if (isSelected) {
                                      setSelectedMembers(selectedMembers.filter(id => id !== member.userId));
                                    } else {
                                      setSelectedMembers([...selectedMembers, member.userId]);
                                    }
                                  }}
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
                            })
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {selectedMembers.length === 0 && (
                  <FieldError>At least one member must be selected</FieldError>
                )}
              </Field>

              {/* Description */}
              <Field>
                <Input
                  placeholder="Enter a description"
                  {...form.register('description')}
                  maxLength={100}
                  className="text-base h-11"
                  autoComplete='off'
                />
                <div className="flex justify-between items-start gap-2 mt-1">
                  <div className="flex-1">
                    <FieldError>{form.formState.errors.description?.message}</FieldError>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {descriptionLength}/100
                  </div>
                </div>
              </Field>

              {/* Currency and Amount */}
              <div className="flex items-start gap-2">
                <div className="w-1/3">
                  <Select 
                    onValueChange={(value) => form.setValue('currency', value)}
                    value={form.watch('currency')}
                  >
                    <SelectTrigger className="h-[60px] text-base font-semibold">
                      <SelectValue>
                        {selectedCurrency?.symbol}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px] overflow-y-auto">
                      {CURRENCIES.map((curr) => (
                        <SelectItem className="py-3" key={curr.code} value={curr.code}>
                          <div className="flex flex-col items-start">
                            <div className="font-medium">{curr.symbol} {curr.code}</div>
                            <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {curr.name}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="w-2/3">
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="0.00"
                    autoComplete='off'
                    {...form.register('totalAmount', {
                      setValueAs: (value) => {
                        if (!value || value === '') return undefined;
                        const num = parseFloat(value);
                        return isNaN(num) ? undefined : num;
                      },
                    })}
                    onInput={(e) => {
                      const input = e.currentTarget;
                      let value = input.value.replace(/[^0-9.]/g, '');
                      
                      const parts = value.split('.');
                      if (parts.length > 2) {
                        value = parts[0] + '.' + parts.slice(1).join('');
                      }
                      
                      if (parts[1]?.length > 2) {
                        value = parts[0] + '.' + parts[1].substring(0, 2);
                      }
                      
                      input.value = value;
                    }}
                    className="text-2xl sm:text-3xl font-bold text-right border-2 px-3 h-[60px]"
                  />
                </div>
              </div>
              <div className="mt-1">
                <FieldError>{form.formState.errors.totalAmount?.message}</FieldError>
                <FieldError>{form.formState.errors.currency?.message}</FieldError>
              </div>

              {/* Paid by and split */}
              <div className="text-sm text-center space-y-1">
                <div className="flex flex-wrap justify-center items-center gap-x-1">
                  <span>Paid by</span>
                  <Select 
                    onValueChange={(value) => form.setValue('paidByUserId', value)}
                    value={form.watch('paidByUserId')}
                  >
                    <SelectTrigger className="inline-flex w-auto border-0 h-auto p-0 font-medium text-primary underline min-h-[44px] sm:min-h-auto">
                      <SelectValue>
                        {paidByMember?.userName || 'you'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {members?.map((member) => (
                        <SelectItem className="py-3" key={member.userId} value={member.userId}>
                          {member.userName} {member.userId === currentUserId ? '(you)' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span>and split</span>
                  <Select
                    value={splitType}
                    onValueChange={(value) => handleSplitTypeChange(value as SplitType)}
                  >
                    <SelectTrigger className="inline-flex w-auto border-0 h-auto p-0 font-medium text-primary underline min-h-[44px] sm:min-h-auto">
                      <SelectValue>
                        {getSplitTypeLabel()}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem 
                        className="py-3" 
                        value="equal"
                      >
                        Equally
                      </SelectItem>
                      <SelectItem 
                        className="py-3" 
                        value="exact"
                        onPointerDown={(e) => {
                          // If already exact, open modal immediately
                          if (splitType === 'exact') {
                            e.preventDefault();
                            setExactSplitModalOpen(true);
                          }
                        }}
                      >
                        By exact amounts
                      </SelectItem>
                      <SelectItem 
                        className="py-3" 
                        value="itemized"
                        onPointerDown={(e) => {
                          // If already itemized, open modal immediately
                          if (splitType === 'itemized') {
                            e.preventDefault();
                            setItemizedSplitModalOpen(true);
                          }
                        }}
                      >
                        Itemized
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date */}
              <Field>
                <Label className="text-sm font-normal text-muted-foreground">
                  Date
                </Label>
                <Input
                  type="date"
                  {...form.register('expenseDate')}
                  className="mt-1 h-11"
                  max={new Date().toISOString().split('T')[0]}
                />
                <FieldError>{form.formState.errors.expenseDate?.message}</FieldError>
              </Field>

              {/* Category */}
              <Field>
                <Label className="text-sm font-normal text-muted-foreground">
                  Category
                </Label>
                <Select 
                  onValueChange={(value) => form.setValue('category', value)}
                  value={form.watch('category')}
                >
                  <SelectTrigger className="mt-1 h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] overflow-y-auto">
                    {CATEGORIES.map((cat) => (
                      <SelectItem className="py-3" key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError>{form.formState.errors.category?.message}</FieldError>
              </Field>

              {/* Add padding at bottom for better scroll UX */}
              <div className="h-20" />
            </form>
          </ScrollArea>

          {/* Fixed Footer Actions */}
          <div className="flex justify-end gap-2 p-4 sm:p-6 border-t shrink-0 bg-background">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="min-h-[44px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isPending}
              className="bg-primary min-h-[44px]"
              onClick={form.handleSubmit(onSubmit)}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Exact Split Modal */}
      <ExactSplitModal
        open={exactSplitModalOpen}
        onClose={() => setExactSplitModalOpen(false)}
        members={members?.filter(m => selectedMembers.includes(m.userId)) || []}
        totalAmount={totalAmount || 0}
        currency={selectedCurrency?.symbol || '$'}
        currentUserId={currentUserId}
        onSave={(config) => {
          form.setValue('splitType', 'exact'); 
          setSplitConfig({
            type: 'exact',
            exactConfig: config,
          });
          setExactSplitModalOpen(false);
        }}
        initialConfig={splitConfig.exactConfig}
      />

      {/* Itemized Split Modal */}
      <ItemizedSplitModal
        open={itemizedSplitModalOpen}
        onClose={() => setItemizedSplitModalOpen(false)}
        members={members?.filter(m => selectedMembers.includes(m.userId)) || []}
        totalAmount={totalAmount || 0}
        currency={selectedCurrency?.symbol || '$'}
        currentUserId={currentUserId}
        onSave={(config) => {
          form.setValue('splitType', 'itemized');
          setSplitConfig({
            type: 'itemized',
            itemizedConfig: config,
          });
          setItemizedSplitModalOpen(false);
        }}
        initialConfig={splitConfig.itemizedConfig}
      />
    </>
  );
}

export default AddExpenseModal;