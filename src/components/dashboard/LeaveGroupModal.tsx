import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
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
import { groupMutations } from '@/services/groups/mutations';

interface LeaveGroupModalProps {
  open: boolean;
  onClose: () => void;
  groupId: string | null;
  groupName?: string;
}

function LeaveGroupModal({ open, onClose, groupId, groupName }: LeaveGroupModalProps) {
  const queryClient = useQueryClient();

  const { mutate: leaveGroup, isPending } = useMutation({
    mutationFn: (id: string) => groupMutations.leave(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast.success('Left group successfully!');
      onClose();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to leave group');
    },
  });

  const handleLeave = () => {
    if (groupId) {
      leaveGroup(groupId);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Leave Group</AlertDialogTitle>
          <AlertDialogDescription className="break-all">
            Are you sure you want to leave <span className="font-semibold">{groupName ? `"${groupName}"` : 'this group'}</span>?
            <br />
            <br />
            You will lose access to all expenses and group information.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLeave}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? 'Leaving...' : 'Leave Group'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default LeaveGroupModal;