'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { AdminSidebar } from '@/components/AdminSidebar'
import { isTokenExpired, clearAuthTokens, isAdmin } from '@/lib/utils'
import { getUserById } from '@/lib/api'
import { Shield, Menu, X, LogOut } from 'lucide-react'

const PUBLIC_ADMIN_PATHS = ['/admin/signin']

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)
  const [user, setUser] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (PUBLIC_ADMIN_PATHS.includes(pathname)) {
      setChecking(false)
      return
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token || isTokenExpired() || !isAdmin()) {
      clearAuthTokens()
      router.push('/admin/signin')
    } else {
      setChecking(false)
      // Fetch user data for header
      getUserById().then(res => {
        if (res.success) {
          setUser(res.data || res.user || res)
        }
      })
    }
  }, [router, pathname])

  if (checking) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center text-white">
        Loading...
      </div>
    )
  }

  if (PUBLIC_ADMIN_PATHS.includes(pathname)) {
    return <>{children}</>
  }

  return (
    <div className="h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex overflow-hidden">
      {/* Professional Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#B48811]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#B48811]/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#B48811]/2 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItaC0ydjJoLTJvLTJoLTJvLTJoLTJ2MmgydjJoMnYtMmgydi0yaDJ2LTJoLTJ2LTJoLTJvLTJoLTJ2MmgydjJoLTJ2LTJoLTJvLTJoLTJ2MmgydjJoMnYtMmgydi0yaDJ2LTJoLTJ6bTAgMmgydjJoLTJ2LTJoLTJ6bTAgMmgydjJoLTJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      </div>
      
      <AdminSidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      
      <div className="flex-1 flex flex-col relative z-10 min-w-0">
        {/* Professional Header Bar */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-xl shrink-0 sticky top-0 z-30"
        >
          <div className="w-full px-3 sm:px-4 lg:px-6">
            <div className="flex items-center justify-between gap-2 py-2 sm:py-3">
              
              {/* Left Section - Menu Toggle & Title */}
              <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-slate-800/50 transition-colors shrink-0"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
                </button>
                
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-black/10 shrink-0">
                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="hidden sm:block min-w-0">
                    <p className="text-white font-semibold text-sm sm:text-base truncate">Admin Dashboard</p>
                    <p className="text-slate-400 text-xs truncate">{user?.email || 'admin@epochera.com'}</p>
                  </div>
                  <div className="sm:hidden min-w-0">
                    <p className="text-white font-semibold text-sm truncate">Admin</p>
                  </div>
                </div>
              </div>

              {/* Right Section - Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/30 border border-slate-700/50">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-slate-400 text-xs">Online</span>
                </div>
                
                <button
                  onClick={() => { clearAuthTokens(); router.push('/signin') }}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-linear-to-r from-[#EBD197] to-[#B48811] text-slate-950 font-medium rounded-lg hover:shadow-lg hover:shadow-[#B48811]/20 transition-all duration-300 text-xs sm:text-sm"
                  aria-label="Logout"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>

            </div>
          </div>
        </motion.header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
