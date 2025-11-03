import { Menu } from "lucide-react"
import { useState } from "react"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Link } from "react-router-dom"

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/svg/icon.svg" alt="HowMuchAh?" className="h-14" />
        </Link>

        {/* Desktop Navigation - hidden on mobile */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/about">
                <NavigationMenuLink>About</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>            
            <NavigationMenuItem>
              <Link to="/login">
                <NavigationMenuLink className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
                  Login
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile menu button */}
        <button 
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Navigation - shown when menu open */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="flex flex-col px-4 py-2">
            <Link to="/about" className="py-2 hover:bg-accent rounded-md px-2">
              About
            </Link>
            <Link to="/login" className="py-2 hover:bg-accent rounded-md px-2">
              Login
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar