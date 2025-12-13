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

interface DeleteGroupModalProps {
  open: boolean;
  onClose: () => void;
  groupId: string | null;
  groupName?: string;
}

function DeleteGroupModal({ open, onClose, groupId, groupName }: DeleteGroupModalProps) {
  const queryClient = useQueryClient();

  const { mutate: deleteGroup, isPending } = useMutation({
    mutationFn: (id: string) => groupMutations.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast.success('Group deleted successfully!');
      onClose();
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to delete group');
    },
  });

  const handleDelete = () => {
    if (groupId) {
      deleteGroup(groupId);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Group</AlertDialogTitle>
          <AlertDialogDescription className="break-all">
            Are you sure you want to delete <span className="font-semibold">{groupName ? `"${groupName}"` : 'this group'}</span>?
            <br/>
            <br/>
            <span className="font-semibold">This action cannot be undone</span> and will remove all members and expenses.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteGroupModal;