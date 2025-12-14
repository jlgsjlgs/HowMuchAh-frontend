import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, X, Users } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { invitationMutations } from "@/services/invitations/mutations"
import { type Invitation } from "@/services/invitations/types"
import { toast } from "sonner"
import { ConfirmDialog } from "../common/ConfirmDialog"

interface PendingInvitationsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invitations: Invitation[]
}

export function PendingInvitationsModal({ 
  open, 
  onOpenChange, 
  invitations 
}: PendingInvitationsModalProps) {
  const queryClient = useQueryClient()
  
  const acceptMutation = useMutation({
    mutationFn: invitationMutations.accept,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-invitations'] })
      queryClient.invalidateQueries({ queryKey: ['groups'] })
      toast.success('Invitation accepted!')
    },
    onError: () => {
      toast.error('Failed to accept invitation')
    }
  })
  
  const declineMutation = useMutation({
    mutationFn: invitationMutations.decline,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-invitations'] })
      toast.success('Invitation declined')
    },
    onError: () => {
      toast.error('Failed to decline invitation')
    }
  })
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle>Pending Invitations</DialogTitle>
          <DialogDescription>
            {invitations.length === 0 
              ? "You have no pending group invitations"
              : `You have ${invitations.length} pending invitation${invitations.length > 1 ? 's' : ''}`
            }
          </DialogDescription>
        </DialogHeader>
        
        {invitations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground max-w-full overflow-hidden">
            <Users className="h-12 w-12 mb-2" />
            <p className="text-sm text-center px-4">No pending invitations</p>
          </div>
        ) : (
          <div className="space-y-3 max-w-full overflow-hidden">
            {invitations.map((invitation) => (
              <Card key={invitation.id} className="p-3 sm:p-4">
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <h3 className="font-semibold break-words text-sm sm:text-base">{invitation.groupName}</h3>
                    <p className="text-xs text-muted-foreground mt-1 break-all">
                      Invited by {invitation.invitedByEmail}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 w-full">
                    <Button
                      size="sm"
                      onClick={() => acceptMutation.mutate(invitation.id)}
                      disabled={acceptMutation.isPending || declineMutation.isPending}
                      className="flex-1 text-xs sm:text-sm px-2 sm:px-3"
                    >
                      <Check className="h-4 w-4 sm:h-4 sm:w-4 mr-1" />
                      Accept
                    </Button>

                    <ConfirmDialog
                      trigger={
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={acceptMutation.isPending || declineMutation.isPending}
                          className="flex-1 text-xs sm:text-sm px-2 sm:px-3"
                        >
                          <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          Decline
                        </Button>
                      }
                      title="Decline invitation?"
                      description={
                        <>
                          Are you sure you want to decline the invitation to{" "}
                          <br/>
                          <span className="font-semibold break-all">{invitation.groupName}</span>?
                          <br/>
                          You will not be able to receive any new invitations from the group.
                        </>
                      }
                      confirmText="Decline"
                      variant="destructive"
                      onConfirm={() => declineMutation.mutate(invitation.id)}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}