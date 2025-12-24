import { useQuery } from '@tanstack/react-query';
import { Plus, PiggyBank } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { groupQueries } from '@/services/groups/queries';
import { formatDate } from '@/lib/formatters';

interface GroupDetailHeaderProps {
  groupId: string;
  onAddExpense: () => void;
  onSettle: () => void;
}

function GroupDetailHeader({ groupId, onAddExpense, onSettle }: GroupDetailHeaderProps) {
  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: groupQueries.getAll,
  });

  const group = groups?.find(g => g.id === groupId);

  if (isLoading) {
    return (
      <div className="mb-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-48 mb-2"></div>
        <div className="h-4 bg-muted rounded w-96"></div>
      </div>
    );
  }

  if (!group) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-2">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 break-words">
            {group.name}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Created {formatDate(group.createdAt)} by {group.ownerName}
          </p>
        </div>
        
        <div className="flex gap-2 sm:flex-shrink-0">
          <Button
            variant="outline"
            size="lg"
            onClick={onSettle}
            className="flex-1 sm:flex-initial"
          >
            <PiggyBank className="h-4 w-4 mr-1" />
            Settle
          </Button>
          <Button
            size="lg"
            onClick={onAddExpense}
            className="flex-1 sm:flex-initial"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Expense
          </Button>
        </div>
      </div>
    </div>
  );
}

export default GroupDetailHeader;