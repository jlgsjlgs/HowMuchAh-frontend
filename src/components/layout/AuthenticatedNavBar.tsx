import { Menu, LogOut, MailWarning, Mail } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "../common/ConfirmDialog"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { invitationQueries } from "@/services/invitations/queries"
import { PendingInvitationsModal } from "../invitations/PendingInvitationsModal"
import { useWebSocket } from "@/contexts/WebSocketContext"
import { toast } from "sonner"

function AuthenticatedNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [invitationsModalOpen, setInvitationsModalOpen] = useState(false)
  const { logout } = useAuth()
  const { subscribeToInvitations } = useWebSocket()
  const queryClient = useQueryClient()

  const { data: pendingInvitations = [] } = useQuery({
    queryKey: ['pending-invitations'],
    queryFn: invitationQueries.getPending,
  });

  useEffect(() => {
    const unsubscribe = subscribeToInvitations(() => {
      // Invalidate and refetch pending invitations
      queryClient.invalidateQueries({ queryKey: ['pending-invitations'] })
      
      // Show toast notification
      toast.info('New Group Invitation', {
        action: {
          label: 'View',
          onClick: () => setInvitationsModalOpen(true)
        }
      })
    })

    // Cleanup subscription on unmount
    return unsubscribe
  }, [subscribeToInvitations, queryClient])

  const hasPendingInvitations = pendingInvitations.length > 0

    const invitationsButton = (
    <Button 
      variant={hasPendingInvitations ? "destructive" : "outline"}
      onClick={() => setInvitationsModalOpen(true)}
      className="relative"
    >
      {hasPendingInvitations ? (
        <>
          <MailWarning className="h-4 w-4 mr-2" />
          Invitations ({pendingInvitations.length})
        </>
      ) : (
        <>
          <Mail className="h-4 w-4 mr-2" />
          Invitations
        </>
      )}
    </Button>
  )
  
  const logoutButton = (
    <Button variant="outline">
      <LogOut className="h-4 w-4 mr-2" />
      Log out
    </Button>
  )
  
  const navContent = (
    <>
      {invitationsButton}
      <ConfirmDialog
        trigger={logoutButton}
        title="Are you sure?"
        description="You will be logged out of your account."
        confirmText="Log out"
        onConfirm={logout}
      />
    </>
  )
  
    return (
    <>
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between py-4">
          <Link to="/dashboard" className="flex items-center">
            <img src="/svg/icon.svg" alt="HowMuchAh?" className="h-14" />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-2">
            {navContent}
          </nav>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t">
            <nav className="flex flex-col gap-2 px-4 py-2">
              {navContent}
            </nav>
          </div>
        )}
      </header>
      
      <PendingInvitationsModal 
        open={invitationsModalOpen}
        onOpenChange={setInvitationsModalOpen}
        invitations={pendingInvitations}
      />
    </>
  )
}


export default AuthenticatedNavbar