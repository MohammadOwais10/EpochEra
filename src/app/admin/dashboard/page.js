'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import StatCard from '@/components/ui/StatCard'
import { getUserById, getAdminDashboard } from '@/lib/api'
import { Coins, Wallet, Repeat, Users, TrendingUp, Package, ScrollText, CreditCard, Shield } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      router.push('/signin')
      return
    }
    Promise.all([getUserById(), getAdminDashboard()])
      .then(([u, d]) => {
        if (u.success) setUser(u.data)
        if (u.data?.role !== 'ADMIN') {
          router.push('/user/dashboard')
          return
        }
        if (d.success) setStats(d.data)
      })
      .catch(() => {
        localStorage.removeItem('token')
        router.push('/signin')
      })
      .finally(() => setLoading(false))
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-white">
        Loading...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-10">
          <div className="flex items-center gap-3">
            <Shield className="w-7 h-7 text-[#EBD197]" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-zinc-400 mt-1">{user?.email}</p>
            </div>
          </div>
          <Button onClick={() => { localStorage.removeItem('token'); router.push('/signin') }} variant="outline" className="rounded-full w-fit">Logout</Button>
        </div>

        <h2 className="text-lg font-semibold text-zinc-300 mb-4">Coin Supply</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            icon={<Coins className="w-6 h-6" />}
            label="Widget A Total"
            value={stats?.widgetA?.totalCoins ?? '0'}
          />
          <StatCard
            icon={<Wallet className="w-6 h-6" />}
            label="Widget B Total"
            value={stats?.widgetB?.totalCoins ?? '0'}
          />
          <StatCard
            icon={<Package className="w-6 h-6" />}
            label="Direct Purchases"
            value={stats?.widgetB?.totalDirectCoinPurchases ?? '0'}
          />
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Sponsor Rewards"
            value={stats?.widgetB?.totalDirectSponsorRewards ?? '0'}
          />
        </div>

        <h2 className="text-lg font-semibold text-zinc-300 mb-4">Sell Requests</h2>
        <Card className="p-6 mb-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-zinc-400 text-sm">Pending</p>
              <p className="text-3xl font-bold text-amber-400 mt-1">{stats?.sellRequests?.pending ?? 0}</p>
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Approved</p>
              <p className="text-3xl font-bold text-blue-400 mt-1">{stats?.sellRequests?.approved ?? 0}</p>
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Completed</p>
              <p className="text-3xl font-bold text-emerald-400 mt-1">{stats?.sellRequests?.completed ?? 0}</p>
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Rejected</p>
              <p className="text-3xl font-bold text-red-400 mt-1">{stats?.sellRequests?.rejected ?? 0}</p>
            </div>
          </div>
        </Card>

        <h2 className="text-lg font-semibold text-zinc-300 mb-4">Payouts & Configuration</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Total USDT Payout"
            value={stats?.sellRequests?.totalUsdtPayout ?? '0'}
          />
          <StatCard
            icon={<Repeat className="w-6 h-6" />}
            label="Coins Bought Back"
            value={stats?.sellRequests?.totalCoinsBoughtBack ?? '0'}
          />
          <StatCard
            icon={<CreditCard className="w-6 h-6" />}
            label="Coins per USD"
            value={stats?.coinConfig?.coinsPerUsd ?? '0'}
          />
          <StatCard
            icon={<ScrollText className="w-6 h-6" />}
            label="Allowed Network"
            value={stats?.coinConfig?.allowedUsdtNetwork ?? 'TRC20'}
          />
        </div>
      </div>
    </div>
  )
}
