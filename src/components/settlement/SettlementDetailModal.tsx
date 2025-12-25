import { useQuery } from '@tanstack/react-query';
import { ArrowRight, ArrowDown, Receipt } from 'lucide-react';
import { settlementQueries } from '@/services/settlements/queries';
import { formatDate, formatCurrency } from '@/lib/formatters';
import type { SettlementDetail } from '@/services/settlements/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

interface SettlementDetailModalProps {
  open: boolean;
  onClose: () => void;
  settlementData?: SettlementDetail;
  settlementId?: string;
}

function SettlementDetailModal({ 
  open, 
  onClose, 
  settlementData, 
  settlementId 
}: SettlementDetailModalProps) {
  
  const { data: fetchedData, isLoading } = useQuery({
    queryKey: ['settlementDetail', settlementId],
    queryFn: () => settlementQueries.getDetail(settlementId!),
    enabled: open && !!settlementId && !settlementData,
  });

  const settlement = settlementData || fetchedData;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[95vw] max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Settlement Details</DialogTitle>
          {settlement && (
            <p className="text-sm text-muted-foreground mt-1">
              Settled on {formatDate(settlement.settledAt)}
            </p>
          )}
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : settlement ? (
          <div className="px-6 pb-6 flex-1 min-h-0">
            {settlement.transactions.length > 0 ? (
              <ScrollArea className="h-[400px] sm:h-[450px]">
                <div className="space-y-3 pr-4">
                  {settlement.transactions.map((transaction, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg bg-muted/30"
                    >
                      {/* Payer and Payee - Stacked on mobile, side-by-side on desktop */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        {/* Payer */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {transaction.payer.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {transaction.payer.email}
                          </p>
                        </div>

                        {/* Arrow - horizontal on mobile, vertical on desktop */}
                        <div className="flex justify-center sm:block">
                          <ArrowDown className="h-4 w-4 text-muted-foreground sm:hidden" />
                          <ArrowRight className="hidden sm:block h-4 w-4 text-muted-foreground" />
                        </div>

                        {/* Payee */}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">
                            {transaction.payee.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {transaction.payee.email}
                          </p>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-lg font-bold text-center">
                          {transaction.currency} {formatCurrency(transaction.amount, transaction.currency)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Receipt />
                  </EmptyMedia>
                  <EmptyTitle className="text-base">No Transactions</EmptyTitle>
                  <EmptyDescription className="text-sm">
                    This settlement has no transactions
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </div>
        ) : (
          <div className="px-6 pb-6">
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Receipt />
                </EmptyMedia>
                <EmptyTitle className="text-base">Not Found</EmptyTitle>
                <EmptyDescription className="text-sm">
                  Settlement details could not be loaded
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default SettlementDetailModal;