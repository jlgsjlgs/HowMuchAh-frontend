import { Menu, LogOut } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "../common/ConfirmDialog"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

function AuthenticatedNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { logout } = useAuth()
  
  const logoutButton = (
    <Button variant="outline">
      <LogOut className="h-4 w-4 mr-2" />
      Log out
    </Button>
  )
  
  const navContent = (
    <ConfirmDialog
      trigger={logoutButton}
      title="Are you sure?"
      description="You will be logged out of your account."
      confirmText="Log out"
      onConfirm={logout}
    />
  )
  
  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between py-4">
        <Link to="/dashboard" className="flex items-center">
          <img src="/svg/icon.svg" alt="HowMuchAh?" className="h-14" />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex">
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
          <nav className="flex flex-col px-4 py-2">
            {navContent}
          </nav>
        </div>
      )}
    </header>
  )
}

export default AuthenticatedNavbar