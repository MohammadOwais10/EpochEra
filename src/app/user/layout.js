'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserSidebar } from '@/components/UserSidebar'

export default function UserLayout({ children }) {
  const router = useRouter()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      router.push('/signin')
    } else {
      setChecking(false)
    }
  }, [router])

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-white">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      <UserSidebar />
      <main className="flex-1 overflow-y-auto ml-64">{children}</main>
    </div>
  )
}
