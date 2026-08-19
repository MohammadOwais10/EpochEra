'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { UserSidebar } from '@/components/UserSidebar'
import { isTokenExpired, clearAuthTokens, isUser } from '@/lib/utils'
import { Menu } from 'lucide-react'

const PUBLIC_USER_PATHS = ['/user/signin']

export default function UserLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (PUBLIC_USER_PATHS.includes(pathname)) {
      setChecking(false)
      return
    }

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token || isTokenExpired() || !isUser()) {
      clearAuthTokens()
      router.push('/user/signin')
    } else {
      setChecking(false)
    }
  }, [router, pathname])

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-white">
        Loading...
      </div>
    )
  }

  if (PUBLIC_USER_PATHS.includes(pathname)) {
    return <>{children}</>
  }

  return (
    <div className="h-screen overflow-hidden bg-background flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <UserSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col h-full min-w-0 md:ml-64">
        <header className="md:hidden flex-none flex items-center justify-between p-4 border-b border-zinc-800 bg-[#392236]/80 backdrop-blur-xl z-30">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="EpochEra" className="w-8 h-8" />
            <span className="text-white font-bold text-lg">EpochEra</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-zinc-300 hover:text-white"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
