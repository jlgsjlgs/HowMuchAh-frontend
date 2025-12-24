import { useMemo } from 'react';
import { type SplitConfig } from '@/components/expenses/AddExpenseModal';
import { type ExpenseSplitDto } from '@/services/expenses/types';

/**
 * Custom hook to calculate expense splits based on split configuration
 * 
 * @param totalAmount - Total expense amount
 * @param selectedMembers - Array of member user IDs involved in the expense
 * @param splitConfig - Configuration object containing split type and details
 * @returns Array of ExpenseSplitDto ready for backend submission
 */
export function useExpenseSplits(
  totalAmount: number,
  selectedMembers: string[],
  splitConfig: SplitConfig
): ExpenseSplitDto[] {
  return useMemo(() => {
    // Guard against invalid inputs
    if (!totalAmount || totalAmount <= 0 || selectedMembers.length === 0) {
      return [];
    }

    switch (splitConfig.type) {
      case 'equal':
        return calculateEqualSplit(totalAmount, selectedMembers);
      
      case 'exact':
        return calculateExactSplit(selectedMembers, splitConfig.exactConfig);
      
      case 'itemized':
        return calculateItemizedSplit(splitConfig.itemizedConfig);
      
      default:
        return [];
    }
  }, [totalAmount, selectedMembers, splitConfig]);
}

/**
 * Calculate equal split - divide total amount equally among all members
 */
function calculateEqualSplit(
  totalAmount: number,
  selectedMembers: string[]
): ExpenseSplitDto[] {
  const amountPerPerson = totalAmount / selectedMembers.length;
  
  return selectedMembers.map(userId => ({
    userId,
    amountOwed: parseFloat(amountPerPerson.toFixed(2)),
  }));
}

/**
 * Calculate exact split - use the amounts specified by user
 */
function calculateExactSplit(
  selectedMembers: string[],
  exactConfig?: { amounts: Record<string, number> }
): ExpenseSplitDto[] {
  if (!exactConfig?.amounts) {
    return [];
  }

  return selectedMembers
    .map(userId => ({
      userId,
      amountOwed: exactConfig.amounts[userId] || 0,
    }))
    .filter(split => split.amountOwed > 0); // Only include users who owe something
}

/**
 * Calculate itemized split - divide each item's amount among assigned members
 */
function calculateItemizedSplit(
  itemizedConfig?: { items: Array<{ id: string; description: string; amount: number; assignedTo: string[] }> }
): ExpenseSplitDto[] {
  if (!itemizedConfig?.items || itemizedConfig.items.length === 0) {
    return [];
  }

  // Track how much each user owes across all items
  const userAmounts: Record<string, number> = {};

  // For each item, divide its amount equally among assigned members
  itemizedConfig.items.forEach(item => {
    if (item.assignedTo.length === 0 || item.amount <= 0) {
      return; // Skip items with no assignees or zero amount
    }

    const amountPerMember = item.amount / item.assignedTo.length;

    item.assignedTo.forEach(userId => {
      userAmounts[userId] = (userAmounts[userId] || 0) + amountPerMember;
    });
  });

  // Convert to array and round to 2 decimal places
  return Object.entries(userAmounts)
    .map(([userId, amountOwed]) => ({
      userId,
      amountOwed: parseFloat(amountOwed.toFixed(2)),
    }))
    .filter(split => split.amountOwed > 0); // Only include users who owe something
}