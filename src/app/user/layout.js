'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { UserSidebar } from '@/components/UserSidebar'
import { isTokenExpired, clearAuthTokens, isUser } from '@/lib/utils'

const PUBLIC_USER_PATHS = ['/user/signin']

export default function UserLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)

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
    <div className="min-h-screen bg-background flex">
      <UserSidebar />
      <main className="flex-1 overflow-y-auto ml-64">{children}</main>
    </div>
  )
}
