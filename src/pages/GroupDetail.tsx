import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BanknoteX } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthenticatedNavBar from '@/components/layout/AuthenticatedNavBar';
import Footer from '@/components/layout/Footer';
import GroupDetailHeader from '@/components/expenses/GroupDetailHeader';
import AddExpenseModal from '@/components/expenses/AddExpenseModal';
import ExpenseDetailModal from '@/components/expenses/ExpenseDetailModal';
import { expenseQueries } from '@/services/expenses/queries';
import { formatDateShort, formatCurrency } from '@/lib/formatters';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Button } from '@/components/ui/button';

function GroupDetail() {
  const { groupId } = useParams<{ groupId: string }>();
  const { user } = useAuth();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0); 
  const pageSize = 6;

  useEffect(() => {
    setCurrentPage(0);
  }, [pageSize]);

  const { data: expenses, isLoading, error } = useQuery({
    queryKey: ['expenses', groupId, currentPage],
    queryFn: () => expenseQueries.getByGroup(groupId!, currentPage, pageSize),
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

  const handleAddExpense = () => {
    setShowAddExpense(true);
  };

  const handleSettle = () => {
    // TODO: Open settle modal
    console.log('Settle group');
  };

  const handleRowClick = (expenseId: string) => {
    setSelectedExpenseId(expenseId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AuthenticatedNavBar />
      
      <main className="flex-1 container mx-auto p-4 flex flex-col">
        <GroupDetailHeader 
          groupId={groupId!} 
          onAddExpense={handleAddExpense}
          onSettle={handleSettle}
        />

        {/* Table section */}
        <div className="flex-1 flex flex-col">
          {expenses.content.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <BanknoteX />
                </EmptyMedia>
                <EmptyTitle>No Expenses Yet</EmptyTitle>
                <EmptyDescription>
                  You haven&apos;t created any expenses yet. Get started by adding
                  your first expense.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <>
              <div className="rounded-lg border bg-card overflow-x-auto">
                <Table className="table-fixed w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[35%] sm:w-[45%]">Description</TableHead>
                      <TableHead className="w-[40%] sm:w-[30%]">Paid By</TableHead>
                      <TableHead className="text-right w-[25%] sm:w-[25%]">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.content.map((expense) => (
                      <TableRow 
                        key={expense.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleRowClick(expense.id)}
                      >
                        {/* Mobile: Combined date + description */}
                        <TableCell className="py-4 sm:hidden truncate">
                          <div className="text-xs text-muted-foreground mb-1">
                            {formatDateShort(expense.expenseDate)}
                          </div>
                          <div className="font-medium text-sm truncate">
                            {truncateText(expense.description, 15)}
                          </div>
                        </TableCell>
                        
                        {/* Desktop: Description only */}
                        <TableCell className="hidden sm:table-cell py-4">
                          <div className="font-medium truncate">
                            {expense.description}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatDateShort(expense.expenseDate)}
                          </div>
                        </TableCell>
                        
                        <TableCell className="text-xs sm:text-sm py-4 truncate">
                          {truncateText(expense.paidByName, 12)}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-sm py-4">
                          <span className={!expense.settled ? 'text-destructive' : ''}>
                            {formatCurrency(expense.totalAmount, expense.currency)}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {expenses.page.totalPages > 1 && (
                <div className="mt-auto pt-4 flex items-center justify-between px-2 sm:px-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                    disabled={currentPage === 0}
                  >
                    Previous
                  </Button>
                  
                  <span className="text-sm text-muted-foreground">
                    Page {expenses.page.number + 1} of {expenses.page.totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(expenses.page.totalPages - 1, prev + 1))}
                    disabled={currentPage === expenses.page.totalPages - 1}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />

      <AddExpenseModal
        open={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        groupId={groupId!}
        currentUserId={user?.id || ''}
      />

      {selectedExpenseId && (
        <ExpenseDetailModal
          open={!!selectedExpenseId}
          onClose={() => setSelectedExpenseId(null)}
          expenseId={selectedExpenseId}
          groupId={groupId!}
        />
      )}
    </div>
  );
}

export default GroupDetail;