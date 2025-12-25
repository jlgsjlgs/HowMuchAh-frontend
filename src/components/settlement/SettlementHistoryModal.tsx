import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import { expenseQueries } from '@/services/expenses/queries';
import { settlementQueries } from '@/services/settlements/queries';
import { settlementMutations } from '@/services/settlements/mutations';
import { type SettlementDetail } from '@/services/settlements/types';
import SettlementDetailModal from './SettlementDetailModal';
import { useApiErrorHandler } from '@/hooks/useApiErrorHandler';
import { formatDate } from '@/lib/formatters';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

interface SettlementHistoryModalProps {
  open: boolean;
  onClose: () => void;
  groupId: string;
}

function SettlementHistoryModal({ open, onClose, groupId }: SettlementHistoryModalProps) {
  const [detailModal, setDetailModal] = useState<{
    open: boolean;
    settlementData?: SettlementDetail;
    settlementId?: string;
  }>({ open: false });

  const queryClient = useQueryClient();

  const handleApiError = useApiErrorHandler();

  const { data: unsettledCount = 0, isLoading: isLoadingCount, error: unsettledCountError } = useQuery({
    queryKey: ['unsettledCount', groupId],
    queryFn: () => expenseQueries.getUnsettledCount(groupId),
    enabled: open && !!groupId,
  });

  const { data: history = [], isLoading: isLoadingHistory, error: historyError } = useQuery({
    queryKey: ['settlementHistory', groupId],
    queryFn: () => settlementQueries.getHistory(groupId),
    enabled: open && !!groupId,
  });

  const executeSettlementMutation = useMutation({
    mutationFn: () => settlementMutations.executeSettlement(groupId),
    onSuccess: (data) => {
      setDetailModal({ open: true, settlementData: data });
      queryClient.invalidateQueries({ queryKey: ['unsettledCount', groupId] });
      queryClient.invalidateQueries({ queryKey: ['settlementHistory', groupId] });
      queryClient.invalidateQueries({ queryKey: ['expenses', groupId] });
    },
    onError: handleApiError,
  });

  const handleSettleNow = () => {
    executeSettlementMutation.mutate();
  };

  const handleViewDetails = (settlementId: string) => {
    setDetailModal({ open: true, settlementId });
  };

  const isLoading = isLoadingCount || isLoadingHistory;
  const hasError = unsettledCountError || historyError;

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-md w-[95vw] max-h-[85vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle>Settlement History</DialogTitle>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : hasError ? (
            <div className="px-6 pb-6">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <AlertCircle className="text-destructive" />
                  </EmptyMedia>
                  <EmptyTitle className="text-base text-destructive">Failed to Load</EmptyTitle>
                  <EmptyDescription className="text-sm">
                    Could not load settlement data. This could be due to a network or permission issue.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          ) : (
            <>
              {/* Top Section - Unsettled Expenses */}
              <div className="px-6">
                {unsettledCount > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span>
                        {unsettledCount} unsettled {unsettledCount === 1 ? 'expense' : 'expenses'}
                      </span>
                    </div>
                    <Button 
                      onClick={handleSettleNow} 
                      className="w-full"
                      disabled={executeSettlementMutation.isPending}
                    >
                      {executeSettlementMutation.isPending ? 'Settling...' : 'Settle Now'}
                    </Button>
                  </div>
                ) : (
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <TrendingUp />
                      </EmptyMedia>
                      <EmptyTitle className="text-base">All Settled!</EmptyTitle>
                      <EmptyDescription className="text-sm">
                        No pending expenses to settle
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
              </div>

              <Separator className="my-4" />

              {/* Bottom Section - Settlement History */}
              <div className="px-6 pb-6 flex-1 min-h-0">
                <h3 className="text-sm font-medium mb-3">Past Settlements</h3>
                
                {history.length > 0 ? (
                  <ScrollArea className="h-[300px] sm:h-[350px]">
                    <div className="space-y-2 pr-4">
                      {history.map((settlement) => (
                        <div
                          key={settlement.id}
                          onClick={() => handleViewDetails(settlement.id)}
                          className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {formatDate(settlement.settledAt)}
                            </span>
                            <span className="text-muted-foreground">•</span>
                            <span className="text-muted-foreground">
                              {settlement.transactionCount} {settlement.transactionCount === 1 ? 'transaction' : 'transactions'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Calendar />
                      </EmptyMedia>
                      <EmptyTitle className="text-base">No History</EmptyTitle>
                      <EmptyDescription className="text-sm">
                        No settlements have been made yet
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <SettlementDetailModal
        open={detailModal.open}
        onClose={() => setDetailModal({ open: false })}
        settlementData={detailModal.settlementData}
        settlementId={detailModal.settlementId}
      />
    </>
  );
}

export default SettlementHistoryModal;