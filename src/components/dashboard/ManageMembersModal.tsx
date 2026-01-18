import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { UserMinus, Mail, Copy, RefreshCw, Link2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { sendInvitationSchema, type SendInvitationFormData } from '@/schemas/invitationSchemas';
import { groupQueries } from '@/services/groups/queries';
import { groupMutations } from '@/services/groups/mutations';
import { invitationQueries } from '@/services/invitations/queries';
import { invitationMutations } from '@/services/invitations/mutations';
import { invitationLinkQueries } from '@/services/invitationLinks/queries';
import { invitationLinkMutations } from '@/services/invitationLinks/mutations';
import { useApiErrorHandler } from '@/hooks/useApiErrorHandler';
import type { InvitationStatus } from '@/services/invitations/types';

interface ManageMembersModalProps {
  open: boolean;
  onClose: () => void;
  groupId: string | null;
}

function ManageMembersModal({ open, onClose, groupId }: ManageMembersModalProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('members');

  // Fetch members
  const { data: members, isLoading: loadingMembers } = useQuery({
    queryKey: ['group-members', groupId],
    queryFn: () => groupQueries.getMembers(groupId!),
    enabled: !!groupId && open,
  });

  // Fetch invitations
  const { data: invitations, isLoading: loadingInvitations } = useQuery({
    queryKey: ['group-invitations', groupId],
    queryFn: () => invitationQueries.getByGroup(groupId!),
    enabled: !!groupId && open,
  });

  // Fetch current invitation link
  const { data: invitationLink, isLoading: loadingLink } = useQuery({
    queryKey: ['invitation-link', groupId],
    queryFn: () => invitationLinkQueries.getCurrent(groupId!),
    enabled: !!groupId && open && activeTab === 'add',
  });

  // Remove member mutation
  const { mutate: removeMember } = useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) =>
      groupMutations.removeMember(groupId, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-members', groupId] });
      toast.success('Member removed successfully!');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to remove member');
    },
  });

  // Send invitation form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetInviteForm,
    setError,
  } = useForm<SendInvitationFormData>({
    resolver: zodResolver(sendInvitationSchema),
  });

  const handleError = useApiErrorHandler<SendInvitationFormData>(setError);

  // Send invitation mutation
  const { mutate: sendInvitation, isPending: sendingInvite } = useMutation({
    mutationFn: (data: SendInvitationFormData) =>
      invitationMutations.send(groupId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-invitations', groupId] });
      toast.success('Invitation sent successfully!');
      resetInviteForm();
      setActiveTab('invitations');
    },
    onError: handleError,
  });

  // Revoke invitation mutation
  const { mutate: revokeInvitation } = useMutation({
    mutationFn: (invitationId: string) =>
      invitationMutations.revoke(groupId!, invitationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group-invitations', groupId] });
      toast.success('Invitation revoked successfully!');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to revoke invitation');
    },
  });

  // Regenerate invitation link mutation
  const { mutate: regenerateLink, isPending: regeneratingLink } = useMutation({
    mutationFn: () => invitationLinkMutations.regenerate(groupId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invitation-link', groupId] });
      toast.success('Invitation link regenerated successfully!');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to regenerate link');
    },
  });

  const onSubmitInvite = (data: SendInvitationFormData) => {
    sendInvitation(data);
  };

  const copyLinkToClipboard = () => {
    if (invitationLink?.link) {
      navigator.clipboard.writeText(invitationLink.link);
      toast.success('Link copied to clipboard!');
    }
  };

  const getStatusBadge = (status: InvitationStatus) => {
    const variants: Record<InvitationStatus, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      PENDING: { variant: 'default', label: 'Pending' },
      ACCEPTED: { variant: 'outline', label: 'Accepted' },
      DECLINED: { variant: 'secondary', label: 'Declined' },
      REVOKED: { variant: 'destructive', label: 'Revoked' },
    };
    const { variant, label } = variants[status];
    return <Badge variant={variant}>{label}</Badge>;
  };

  if (!groupId) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Members & Invitations</DialogTitle>
          <DialogDescription>
            View members, manage invitations, and add new people to the group.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
            <TabsTrigger value="add">Add Member</TabsTrigger>
          </TabsList>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-4">
            {loadingMembers ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : members && members.length > 0 ? (
              <div className="space-y-2" key="members-list">
                {members.map((member) => (
                  <div
                    key={member.userId}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium break-all">{member.userName}</p>
                      <p className="text-sm text-muted-foreground break-all">{member.userEmail}</p>
                    </div>
                    {!member.owner && (
                      <ConfirmDialog
                        trigger={<Button variant="ghost" size="sm"><UserMinus className="h-4 w-4" /></Button>}
                        title="Remove Member"
                        description={
                          <span className="break-all">
                            Are you sure you want to remove the following user from this group? <br/><span className="font-semibold">{member.userName}</span> ({member.userEmail})
                          </span>
                        }
                        onConfirm={() => removeMember({ groupId, userId: member.userId })}
                        confirmText="Remove"
                        variant="destructive"
                      />
                    )}
                    {member.owner && (
                      <Badge variant="outline">Owner</Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No members yet
              </div>
            )}
          </TabsContent>

          {/* Invitations Tab */}
          <TabsContent value="invitations" className="space-y-4">
            {loadingInvitations ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : invitations && invitations.length > 0 ? (
              <div className="space-y-2" key="invitations-list">
                {invitations
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((invitation) => (
                    <div
                      key={invitation.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium break-all">{invitation.invitedEmail}</p>
                        <p className="text-sm text-muted-foreground">
                          Invited by {invitation.invitedByEmail}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(invitation.status)}
                        {invitation.status === 'PENDING' && (
                          <ConfirmDialog
                            trigger={<Button variant="ghost" size="sm">Revoke</Button>}
                            title="Revoke Invitation"
                            description={
                              <span className="break-all">
                                Revoke the invitation for <br/><span className="font-semibold">{invitation.invitedEmail}</span>?
                              </span>
                            }
                            onConfirm={() => revokeInvitation(invitation.id)}
                            confirmText="Revoke"
                            variant="destructive"
                          />
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No invitations yet
              </div>
            )}
          </TabsContent>

          {/* Add Member Tab */}
          <TabsContent value="add" className="space-y-6">
            {/* Email Invitation Section */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Send Email Invitation</h3>
                <p className="text-sm text-muted-foreground">
                  Send a direct invitation to a specific email address
                </p>
              </div>
              <form onSubmit={handleSubmit(onSubmitInvite)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="invitedEmail">
                    Email Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="invitedEmail"
                    type="email"
                    placeholder="friend@example.com"
                    autoComplete="off"
                    {...register('invitedEmail')}
                    disabled={sendingInvite}
                  />
                  {errors.invitedEmail && (
                    <p className="text-sm text-destructive">{errors.invitedEmail.message}</p>
                  )}
                </div>

                <Button type="submit" disabled={sendingInvite} className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  {sendingInvite ? 'Sending...' : 'Send Invitation'}
                </Button>
              </form>
            </div>

            <Separator />

            {/* Invitation Link Section */}
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">Share Invitation Link</h3>
                <p className="text-sm text-muted-foreground">
                  Anyone with this link can join the group
                </p>
              </div>

              {loadingLink ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : invitationLink ? (
                <div className="space-y-3">
                  {/* Link Display with Copy Button */}
                  <div className="flex gap-2">
                    <Input
                      value={invitationLink.link}
                      readOnly
                      className="flex-1 font-mono text-sm"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={copyLinkToClipboard}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Link Info */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                    <div className="space-y-1">
                      <p>
                        Uses: {invitationLink.currentUses} / {invitationLink.maxUses}
                      </p>
                      <p>
                        Expires: {new Date(invitationLink.expiresAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Regenerate Button */}
                  <ConfirmDialog
                    trigger={
                      <Button
                        variant="destructive"
                        className="w-full"
                        disabled={regeneratingLink}
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${regeneratingLink ? 'animate-spin' : ''}`} />
                        {regeneratingLink ? 'Regenerating...' : 'Regenerate Link'}
                      </Button>
                    }
                    title="Regenerate Invitation Link"
                    description={
                      <span className="break-words">
                        This will invalidate the current link and create a new one. Anyone with the old link won't be able to use it anymore.
                        <br /><br />
                        You are only allowed to create <b>3 invitation links per group in a month.</b>
                      </span>
                    }
                    onConfirm={() => regenerateLink()}
                    confirmText="Regenerate"
                    variant="destructive"
                  />
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <Link2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>Failed to load invitation link</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

export default ManageMembersModal;