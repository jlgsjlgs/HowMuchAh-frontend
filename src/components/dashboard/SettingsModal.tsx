import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { updateGroupSchema, type UpdateGroupFormData } from '@/schemas/groupSchemas';
import { groupMutations } from '@/services/groups/mutations';
import { useApiErrorHandler } from '@/hooks/useApiErrorHandler';
import type { Group } from '@/services/groups/types';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  group: Group | null;
}

function SettingsModal({ open, onClose, group }: SettingsModalProps) {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<UpdateGroupFormData>({
    resolver: zodResolver(updateGroupSchema),
  });

  // Reset form when group changes
  useEffect(() => {
    if (group) {
      reset({
        name: group.name,
        description: group.description || '',
      });
    }
  }, [group, reset]);

  const handleError = useApiErrorHandler<UpdateGroupFormData>(setError);

  const { mutate: updateGroup, isPending } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGroupFormData }) =>
      groupMutations.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      toast.success('Group updated successfully!');
      onClose();
    },
    onError: handleError,
  });

  const onSubmit = (data: UpdateGroupFormData) => {
    if (group) {
      // Only send fields that have values
      const payload: UpdateGroupFormData = {};
      if (data.name && data.name.trim()) payload.name = data.name.trim();
      if (data.description !== undefined) payload.description = data.description.trim();

      updateGroup({ id: group.id, data: payload });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!group) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Group Settings</DialogTitle>
          <DialogDescription>
            Update your group's name and description.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Group Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Group Name</Label>
            <Input
              id="name"
              placeholder="Weekend Trip"
              autoComplete="off"
              {...register('name')}
              disabled={isPending}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Trip to the beach with friends"
              rows={3}
              autoComplete="off"
              {...register('description')}
              disabled={isPending}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsModal;