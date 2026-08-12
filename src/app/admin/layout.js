'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AdminSidebar } from '@/components/AdminSidebar'

export default function AdminLayout({ children }) {
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
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
