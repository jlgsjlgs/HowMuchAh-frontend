import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import AuthenticatedNavBar from '@/components/layout/AuthenticatedNavBar';
import Footer from '@/components/layout/Footer';
import GroupDetailHeader from '@/components/expenses/GroupDetailHeader';
import { expenseQueries } from '@/services/expenses/queries';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

function GroupDetail() {
  const { groupId } = useParams<{ groupId: string }>();

  const { data: expenses, isLoading, error } = useQuery({
    queryKey: ['expenses', groupId],
    queryFn: () => expenseQueries.getByGroup(groupId!),
    enabled: !!groupId,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <AuthenticatedNavBar />
        <main className="flex-1 container mx-auto p-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !expenses) {
    return (
      <div className="min-h-screen flex flex-col">
        <AuthenticatedNavBar />
        <main className="flex-1 container mx-auto p-4">
          <div className="text-center py-12">
            <p className="text-destructive mb-4">Failed to load expense details for group</p>
            <p className="text-destructive mb-4">This could be due to a network or permission issue</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const truncateText = (text: string, maxLength: number = 20) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Mobile: Short format (12/20), Desktop: Full format (Dec 20, 2024)
    return date.toLocaleDateString('en-SG', { 
      month: 'numeric', 
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2, // No decimals if whole number
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleAddExpense = () => {
    // TODO: Open add expense modal
    console.log('Add expense');
  };

  const handleSettle = () => {
    // TODO: Open settle modal
    console.log('Settle group');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AuthenticatedNavBar />
      
      <main className="flex-1 container mx-auto p-4">
        <GroupDetailHeader 
          groupId={groupId!} 
          onAddExpense={handleAddExpense}
          onSettle={handleSettle}
        />

        {/* Table section */}
        {expenses.content.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg">
            <p className="text-muted-foreground">No expenses yet.</p>
          </div>
        ) : (
          <div className="rounded-lg border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] sm:w-[100px]">Description</TableHead>
                  <TableHead className="w-[80px] sm:w-[120px]">Paid By</TableHead>
                  <TableHead className="text-right w-[70px] sm:w-[100px]">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenses.content.map((expense) => (
                  <TableRow 
                    key={expense.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => {/* TODO: Navigate to expense detail */}}
                  >
                    {/* <TableCell className="text-xs sm:text-sm py-4">
                      {formatDate(expense.expenseDate)}
                    </TableCell>
                    <TableCell className="font-medium text-sm py-4">
                      <span>{truncateText(expense.description, 15)}</span>
                    </TableCell> */}
                    <TableCell className="py-4 sm:hidden">
                      <div className="text-xs text-muted-foreground mb-1">
                        {formatDate(expense.expenseDate)}
                      </div>
                      <div className="font-medium text-sm">
                        {truncateText(expense.description, 15)}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs sm:text-sm py-4">
                      {truncateText(expense.paidByName, 12)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-sm py-4">
                      {formatCurrency(expense.totalAmount, expense.currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default GroupDetail;