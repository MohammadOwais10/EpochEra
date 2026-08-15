'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, useReducedMotion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import StatCard from '@/components/ui/StatCard'
import { getUserById, getAdminDashboard } from '@/lib/api'
import { Coins, Wallet, Repeat, Users, TrendingUp, Package, ScrollText, CreditCard, Shield, X, Clock, CheckCircle, XCircle, DollarSign } from 'lucide-react'
import { clearAuthTokens, isAdmin } from '@/lib/utils'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 14,
      mass: 0.8,
    },
  },
}

const statCardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 16,
      mass: 0.5,
    },
  },
  hover: {
    scale: 1.03,
    y: -4,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 20,
      mass: 0.5,
    },
  },
}

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token || !isAdmin()) {
      router.push('/signin')
      return
    }
    Promise.all([getUserById(), getAdminDashboard()])
      .then(([u, d]) => {
        console.log('Admin dashboard API responses:', { user: u, dashboard: d })
        if (u.success) {
          const userData = u.data || u.user || u
          setUser(userData)
        }
        if (d.success) {
          setStats(d.data)
        }
      })
      .catch((err) => {
        console.error('Admin dashboard error:', err)
        clearAuthTokens()
        router.push('/signin')
      })
      .finally(() => setLoading(false))
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-[#B48811]/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative w-20 h-20 border-4 border-[#B48811]/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-[#B48811] rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-[#EBD197] rounded-full border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="text-center">
            <p className="text-white font-semibold text-lg mb-1">Loading Admin Dashboard</p>
            <p className="text-slate-400 text-sm">Preparing your admin experience...</p>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Overview Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-10"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">Dashboard Overview</h2>
            <p className="text-slate-400 text-sm">Key metrics and system performance</p>
          </div>
        </div>
        
        {/* <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            icon={<Coins className="w-6 h-6" />}
            label="Total Coins in Circulation"
            value={((stats?.widgetA?.totalCoins || 0)).toLocaleString()}
          />
          <StatCard
            icon={<Package className="w-6 h-6" />}
            label="Direct Purchases"
            value={stats?.widgetB?.totalDirectCoinPurchases?.toLocaleString() || '0'}
          />
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="Sponsor Rewards"
            value={stats?.widgetB?.totalDirectSponsorRewards?.toLocaleString() || '0'}
          />
          <StatCard
            icon={<Repeat className="w-6 h-6" />}
            label="Pending Requests"
            value={stats?.sellRequests?.pending || 0}
          /> */}
        {/* </div> */}
      </motion.div>

      {/* Coin Supply Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10">
              <Coins className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">Coin Supply Distribution</h2>
              <p className="text-slate-400 text-sm">Overview of coin distribution across widgets</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Live Data</span>
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {/* USD Commission Card */}
          <Card className="p-6 group relative overflow-hidden border-[#B48811]/30 hover:border-[#B48811]/50">
            <div className="absolute inset-0 bg-gradient-to-br from-[#B48811]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-black/10 group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">USDT Commission</h3>
                    <p className="text-slate-400 text-xs">MLM Rewards</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#EBD197]">${(parseFloat(stats?.usdCommission?.total || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p className="text-slate-400 text-xs">Total USDT</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-700/50">
                <div className="p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                  <p className="text-slate-400 text-xs mb-1">Source</p>
                  <p className="text-lg font-semibold text-white">Level 1-12</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                  <p className="text-slate-400 text-xs mb-1">Status</p>
                  <p className="text-lg font-semibold text-white">Non-Withdrawable</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 group relative overflow-hidden border-[#B48811]/30 hover:border-[#B48811]/50">
            <div className="absolute inset-0 bg-gradient-to-br from-[#B48811]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-black/10 group-hover:scale-110 transition-transform duration-300">
                    <Coins className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Widget A</h3>
                    <p className="text-slate-400 text-xs">Primary Token</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#EBD197]">{stats?.widgetA?.totalCoins?.toLocaleString() || '0'}</p>
                  <p className="text-slate-400 text-xs">Total Coins</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-700/50">
                <div className="p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                  <p className="text-slate-400 text-xs mb-1">Membership Buyers</p>
                  <p className="text-lg font-semibold text-white">{stats?.widgetA?.totalMembershipBuyers?.toLocaleString() || '0'}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                  <p className="text-slate-400 text-xs mb-1">Mining Users</p>
                  <p className="text-lg font-semibold text-white">{stats?.widgetA?.totalMiningUsers?.toLocaleString() || '0'}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 group relative overflow-hidden border-[#B48811]/30 hover:border-[#B48811]/50">
            <div className="absolute inset-0 bg-gradient-to-br from-[#B48811]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-black/10 group-hover:scale-110 transition-transform duration-300">
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Widget B</h3>
                    <p className="text-slate-400 text-xs">Secondary Token</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#B48811]">{stats?.widgetB?.totalCoins?.toLocaleString() || '0'}</p>
                  <p className="text-slate-400 text-xs">Total Coins</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-700/50">
                <div className="p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                  <p className="text-slate-400 text-xs mb-1">Direct Purchases</p>
                  <p className="text-lg font-semibold text-white">{stats?.widgetB?.totalDirectCoinPurchases?.toLocaleString() || '0'}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                  <p className="text-slate-400 text-xs mb-1">Sponsor Rewards</p>
                  <p className="text-lg font-semibold text-white">{stats?.widgetB?.totalDirectSponsorRewards?.toLocaleString() || '0'}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>

      {/* Sell Requests Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10">
              <Repeat className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">Sell Requests Overview</h2>
              <p className="text-slate-400 text-sm">Track and manage sell request statuses</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Real-time</span>
            <span className="w-2 h-2 bg-[#EBD197] rounded-full animate-pulse"></span>
          </div>
        </div>
        
        <Card className="p-6 group relative overflow-hidden border-[#B48811]/30 hover:border-[#B48811]/50">
          <div className="absolute inset-0 bg-gradient-to-br from-[#B48811]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-all duration-300 border border-slate-700/50 hover:border-[#EBD197]/30 hover:shadow-lg hover:shadow-[#EBD197]/10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-400 text-sm font-medium">Pending</p>
                <div className="w-8 h-8 bg-[#EBD197]/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-4 h-4 text-[#EBD197]" />
                </div>
              </div>
              <p className="text-3xl font-bold text-[#EBD197] group-hover:scale-105 transition-transform duration-300">{stats?.sellRequests?.pending ?? 0}</p>
              <p className="text-slate-500 text-xs mt-2">Awaiting review</p>
            </div>
            <div className="p-6 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-all duration-300 border border-slate-700/50 hover:border-[#B48811]/30 hover:shadow-lg hover:shadow-[#B48811]/10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-400 text-sm font-medium">Approved</p>
                <div className="w-8 h-8 bg-[#B48811]/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-4 h-4 text-[#B48811]" />
                </div>
              </div>
              <p className="text-3xl font-bold text-[#B48811] group-hover:scale-105 transition-transform duration-300">{stats?.sellRequests?.approved ?? 0}</p>
              <p className="text-slate-500 text-xs mt-2">Ready for processing</p>
            </div>
            <div className="p-6 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-all duration-300 border border-slate-700/50 hover:border-emerald-400/30 hover:shadow-lg hover:shadow-emerald-400/10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-400 text-sm font-medium">Completed</p>
                <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-emerald-400 group-hover:scale-105 transition-transform duration-300">{stats?.sellRequests?.completed ?? 0}</p>
              <p className="text-slate-500 text-xs mt-2">Successfully processed</p>
            </div>
            <div className="p-6 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-all duration-300 border border-slate-700/50 hover:border-red-400/30 hover:shadow-lg hover:shadow-red-400/10">
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-400 text-sm font-medium">Rejected</p>
                <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <XCircle className="w-4 h-4 text-red-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-red-400 group-hover:scale-105 transition-transform duration-300">{stats?.sellRequests?.rejected ?? 0}</p>
              <p className="text-slate-500 text-xs mt-2">Declined requests</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* System Configuration */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">Financial Overview</h2>
              <p className="text-slate-400 text-sm">System payouts and configuration settings</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">System</span>
            <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="Total USDT Payout"
            value={stats?.sellRequests?.totalUsdtPayout?.toLocaleString() || '0'}
          />
          <StatCard
            icon={<Repeat className="w-6 h-6" />}
            label="Coins Bought Back"
            value={stats?.sellRequests?.totalCoinsBoughtBack?.toLocaleString() || '0'}
          />
          <StatCard
            icon={<CreditCard className="w-6 h-6" />}
            label="Coins per USDT"
            value={stats?.coinConfig?.coinsPerUsd || '0'}
          />
          <StatCard
            icon={<ScrollText className="w-6 h-6" />}
            label="Allowed Network"
            value={stats?.coinConfig?.allowedUsdtNetwork || 'TRC20'}
          />
        </div>
      </motion.div>

      {/* Transaction Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="p-6 border-[#B48811]/30">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Transaction Statistics</h3>
              <p className="text-slate-400 text-sm">Overview of sell request performance</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-800/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Total Transactions</span>
              </div>
              <p className="text-xl font-bold text-white">{((stats?.sellRequests?.pending || 0) + (stats?.sellRequests?.approved || 0) + (stats?.sellRequests?.completed || 0) + (stats?.sellRequests?.rejected || 0)).toLocaleString()}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Success Rate</span>
              </div>
              <p className="text-xl font-bold text-white">{stats?.sellRequests?.completed ? Math.round((stats.sellRequests.completed / ((stats.sellRequests.pending || 0) + (stats.sellRequests.approved || 0) + (stats.sellRequests.completed || 0) + (stats.sellRequests.rejected || 0))) * 100) : 0}%</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Pending Actions</span>
              </div>
              <p className="text-xl font-bold text-[#EBD197]">{stats?.sellRequests?.pending || 0}</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}