"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetPortal } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  useAppKit,
  useAppKitAccount,
  useAppKitNetwork,
} from "@reown/appkit/react";
import { useRouter } from "next/navigation";
import Image from "next/image"
import { isValidUserToken, isTokenExpired, clearAuthTokens, decodeToken } from "@/lib/utils"

// Navigation links config
const navigation = [
  { name: "Home", href: "/", isSection: true },
  { name: "Tokenomics", href: "/tokenomics", isSection: false },
  { name: "FAQ", href: "/faq", isSection: false },
  { name: "Terms", href: "/terms", isSection: false },
]

// NavLink component
const NavLink = ({ item, pathname, handleClick }) => {
  const isActive = pathname === item.href

  return (
    <Link
      key={item.name}
      href={item.href}
      onClick={(e) => {
        if (item.isSection && pathname === '/') {
          e.preventDefault()
          handleClick(item.href)
        }
      }}
      className={cn(
        "text-base font-medium transition-all duration-300 hover:text-[#EBD197] hover:drop-shadow-sm relative group",
        !item.isSection && isActive ? "text-[#EBD197] drop-shadow-sm" : "text-white/90"
      )}
    >
      {item.name}
      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#EBD197]/50 to-[#BB9B49]/50 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </Link>
  )
}


export function Navigation() {
  const router = useRouter()
  const { open, close } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const [isOpen, setIsOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const pathname = usePathname()

  // Check authentication status and user role
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isValidUserToken() && !isTokenExpired()
      setIsAuthenticated(authenticated)
      
      if (authenticated) {
        const token = localStorage.getItem('token')
        if (token) {
          const payload = decodeToken(token)
          setUserRole(payload?.role || 'USER')
        }
      } else {
        setUserRole(null)
      }
    }
    
    checkAuth()
    
    // Listen for storage changes (in case user logs out in another tab)
    const handleStorageChange = () => {
      checkAuth()
    }
    
    // Listen for custom auth state changes (same tab)
    const handleAuthChange = () => {
      checkAuth()
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('auth-state-changed', handleAuthChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('auth-state-changed', handleAuthChange)
    }
  }, [])

  // Dashboard layouts already have their own sidebars, so don't double-header them
  if (pathname && (pathname.startsWith('/user') || pathname.startsWith('/admin') || pathname.startsWith('/dashboard-offline'))) {
    return null
  }

  const marketingPages = ['/', '/tokenomics', '/terms', '/faq', '/disclaimer']
  const topOffset = marketingPages.includes(pathname) ? 'top-8 md:top-11' : 'top-0'

  const handleNavClick = (href, isSection) => {
    const sectionId = href.split('#')[1]
    if (sectionId) {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
    setIsOpen(false)
  }

  const handleAuthClick = () => {
    if (isAuthenticated) {
      // If authenticated, redirect to appropriate dashboard
      if (userRole === 'ADMIN') {
        router.push('/admin/dashboard')
      } else {
        router.push('/user/dashboard')
      }
    } else {
      // If not authenticated, go to login
      router.push('/signin')
    }
  }

  return (
    <nav className={`fixed ${topOffset} w-full z-50`}>
      <div className="bg-[#392236] shadow-2xl shadow-black/20">

        <div className="relative flex justify-between items-center h-16 px-2 xl:px-auto md:max-w-7xl mx-auto">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 z-10">
          <img src="/logo.png" className="h-18 py-2 w-auto" alt="EpochEra Logo" />
            <span className="text-xl font-bold text-gold drop-shadow-sm">EpochEra</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 z-10">
            {navigation.map((item) => (
              <NavLink key={item.name} item={item} pathname={pathname} handleClick={handleNavClick} />
            ))}
            <Button variant="primary" size="lg" className="rounded-full" onClick={handleAuthClick}>
              {isAuthenticated ? 'Dashboard' : 'Get Started'}
            </Button>
           
          </div>

          {/* Mobile Navigation - Enhanced */}
          <div className="md:hidden z-50">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 rounded-full bg-white/5 hover:bg-white/10 transition-all duration-200"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5 text-white" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-full max-w-xs p-0 bg-[#392236] shadow-2xl border-l border-[#B48811]/30"
                overlayClassName="backdrop-blur-sm"
              >
                <div className="h-full flex flex-col">
                  <div className="p-4 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                        <img 
                        src="/logo.png" 
                        className="h-10 w-auto" 
                        alt="EpochEra Logo" 
                      />
                      <span className="text-xl font-bold text-gold">EpochEra</span>
                    </div>
                  </div>
                  
                  <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navigation.map((item) => (
                      <SheetClose asChild key={item.name}>
                        <Link
                          href={item.href}
                          onClick={(e) => {
                            if (item.isSection && pathname === '/') {
                              e.preventDefault()
                              handleNavClick(item.href)
                            }
                          }}
                          className={`
                            flex items-center px-4 py-3 rounded-2xl text-base font-medium transition-all duration-200
                            ${pathname === item.href 
                              ? 'bg-zinc-950/40 text-[#EBD197]' 
                              : 'text-white/80'
                            }
                          `}
                        >
                          {item.name}
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>

                  <div className="p-4 border-t border-white/10 space-y-3">
                    <Button 
                      variant="primary" 
                      size="lg" 
                      className="w-full rounded-full"
                      onClick={() => {
                        setIsOpen(false)
                        handleAuthClick()
                      }}
                    >
                      {isAuthenticated ? 'Dashboard' : 'Get Started'}
                    </Button>
                  
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}