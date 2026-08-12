'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import StatCard from '@/components/ui/StatCard'
import { getUserById, getDashboard } from '@/lib/api'
import {
  CircleDollarSign,
  Box,
  Coins,
  Users,
  Network,
  Pickaxe,
  Crown,
  TrendingUp,
  Percent,
  Clock,
  Mail,
  Copy,
  Check,
  Sparkles,
  ArrowUpRight,
  Wallet,
  Zap,
  Shield,
  ChevronRight,
  Star,
  LogOut,
  Gift,
  Target,
  Activity,
  Flame,
  Gem,
  Building2,
  Globe,
  LineChart,
  Calendar,
  CreditCard,
  Smartphone,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  Home,
  LayoutDashboard,
  DollarSign,
  History,
  HelpCircle,
  Link,
} from 'lucide-react'

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

export default function UserDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      router.push('/signin')
      return
    }
    Promise.all([getUserById(), getDashboard()])
      .then(([u, d]) => {
        if (u.success) setUser(u.data)
        if (d.success) setStats(d.data)
      })
      .catch((err) => {
        setError('Failed to load dashboard data')
        localStorage.removeItem('token')
        router.push('/signin')
      })
      .finally(() => setLoading(false))
  }, [router])

  const handleCopy = async () => {
    if (!user?.referralCode) return
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/signup?sponsor=${user.referralCode}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0'
    const number = parseFloat(num)
    if (isNaN(number)) return '0'
    return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const formatCurrency = (amount) => {
    return `$${formatNumber(amount)}`
  }

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
            <p className="text-white font-semibold text-lg mb-1">Loading Dashboard</p>
            <p className="text-slate-400 text-sm">Preparing your personalized experience...</p>
          </div>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-slate-400 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="primary">
            Try Again
          </Button>
        </motion.div>
      </div>
    )
  }

  const referralUrl = typeof window !== 'undefined' && user?.referralCode ? `${window.location.origin}/signup?sponsor=${user.referralCode}` : ''

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Professional Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#B48811]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#B48811]/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#B48811]/2 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItaC0ydjJoLTJvLTJoLTJvLTJoLTJ2MmgydjJoMnYtMmgydi0yaDJ2LTJoLTJ2LTJoLTJvLTJoLTJ2MmgydjJoLTJ2LTJoLTJvLTJoLTJ2MmgydjJoMnYtMmgydi0yaDJ2LTJoLTJ6bTAgMmgydjJoLTJ2LTJoLTJ6bTAgMmgydjJoLTJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      </div>

      <div className="relative z-10">
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-xl"
        >
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-4">
              
              <div className="flex items-center gap-4">
               
                <div className="flex-1">
                
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-slate-400 text-sm">Welcome, {user?.firstName || 'User'}</p>
                    <div className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 border ${
                      user?.emailVerified 
                        ? 'bg-[#B48811]/10 text-[#EBD197] border-[#B48811]/20' 
                        : 'bg-[#B48811]/10 text-[#BB9B49] border-[#B48811]/20'
                    }`}>
                      {user?.emailVerified ? <Shield className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {user?.emailVerified ? 'Verified' : 'Pending'}
                    </div>
                    {stats?.membership?.active && (
                      <div className="px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-[#B48811]/10 to-[#BB9B49]/10 text-[#EBD197] border border-[#B48811]/20 flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        Premium
                      </div>
                    )}
                  </div>
                </div>
              </div>

              

            
            </div>
          </div>

       
        </motion.nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Professional Quick Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Quick Stats Overview</h2>
                <p className="text-slate-400 text-sm">Your key performance metrics at a glance</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover="hover" 
              whileTap={{ scale: 0.98 }}
              className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-[#B48811]/40 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#B48811]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-black/10 group-hover:scale-110 transition-transform duration-300">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-[#EBD197] text-sm font-medium">
                    <ArrowUp className="w-4 h-4" />
                    <span>12.5%</span>
                  </div>
                </div>
                <p className="text-slate-400 text-sm font-medium mb-1">Total Balance</p>
                <p className="text-3xl font-bold text-white tracking-tight">{formatCurrency(stats?.wallets?.usdCommission)}</p>
                <p className="text-slate-500 text-xs mt-2">+${formatNumber(stats?.wallets?.usdCommission * 0.125)} this month</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover="hover" 
              whileTap={{ scale: 0.98 }}
              className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-[#B48811]/40 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#B48811]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-black/10 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-[#EBD197] text-sm font-medium">
                    <ArrowUp className="w-4 h-4" />
                    <span>8.3%</span>
                  </div>
                </div>
                <p className="text-slate-400 text-sm font-medium mb-1">Direct Referrals</p>
                <p className="text-3xl font-bold text-white tracking-tight">{stats?.mlm?.directReferrals ?? '0'}</p>
                <p className="text-slate-500 text-xs mt-2">+{Math.max(0, (stats?.mlm?.directReferrals || 0) - 1)} new this week</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover="hover" 
              whileTap={{ scale: 0.98 }}
              className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-[#B48811]/40 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#B48811]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-black/10 group-hover:scale-110 transition-transform duration-300">
                    <Network className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-[#EBD197] text-sm font-medium">
                    <ArrowUp className="w-4 h-4" />
                    <span>15.2%</span>
                  </div>
                </div>
                <p className="text-slate-400 text-sm font-medium mb-1">Team Size</p>
                <p className="text-3xl font-bold text-white tracking-tight">{stats?.mlm?.teamCount ?? '0'}</p>
                <p className="text-slate-500 text-xs mt-2">Growing steadily</p>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover="hover" 
              whileTap={{ scale: 0.98 }}
              className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-[#B48811]/40 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#B48811]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-black/10 group-hover:scale-110 transition-transform duration-300 ${
                    stats?.mining?.canMine 
                      ? 'bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm' 
                      : 'bg-gradient-to-br from-[#BB9B49] via-[#B48811] to-[#EBD197] border border-[#B48811]/20 backdrop-blur-sm'
                  }`}>
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    stats?.mining?.canMine 
                      ? 'bg-[#B48811]/10 text-[#EBD197] border border-[#B48811]/20' 
                      : 'bg-[#B48811]/10 text-[#EBD197] border border-[#B48811]/20'
                  }`}>
                    {stats?.mining?.canMine ? 'Active' : 'Paused'}
                  </div>
                </div>
                <p className="text-slate-400 text-sm font-medium mb-1">Mining Status</p>
                <p className={`text-3xl font-bold tracking-tight ${stats?.mining?.canMine ? 'text-[#EBD197]' : 'text-[#BB9B49]'}`}>
                  {stats?.mining?.canMine ? 'Ready' : 'Cooldown'}
                </p>
                <p className="text-slate-500 text-xs mt-2">
                  {stats?.mining?.nextMiningAt 
                    ? `Next: ${new Date(stats.mining.nextMiningAt).toLocaleTimeString()}` 
                    : 'Available now'}
                </p>
              </div>
            </motion.div>
            </div>
          </motion.div>

          {/* Professional Main Content Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid lg:grid-cols-3 gap-6 mb-8"
          >
            {/* Enhanced Referral Section */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-2">
              <Card className="p-6 md:p-8 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-[#B48811]/40 transition-all duration-300 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#B48811]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10">
                        <Gift className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">Your Referral Link</h2>
                        <p className="text-slate-400 text-sm mt-1">Earn rewards on every referral</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#EBD197] rounded-full animate-pulse"></div>
                      <span className="text-[#EBD197] text-sm font-medium">Active</span>
                    </div>
                  </div>
                  
                  <p className="text-slate-300 text-base mb-6 leading-relaxed">
                    Share your unique link with friends and earn commission on their purchases. 
                    The more you share, the more you earn!
                  </p>
                  
                  <div className="relative mb-6">
                    <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-700/50 rounded-2xl p-4 focus-within:border-[#B48811]/50 focus-within:ring-2 focus-within:ring-[#B48811]/20 transition-all duration-300">
                      <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
                        <Link className="w-5 h-5 text-slate-400" />
                      </div>
                      <input
                        readOnly
                        value={referralUrl}
                        className="bg-transparent flex-1 text-sm font-mono text-slate-300 outline-none"
                      />
                      <motion.div 
                        whileHover={{ scale: 1.05 }} 
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          onClick={handleCopy} 
                          variant="primary" 
                          size="md" 
                          className="rounded-xl flex items-center gap-2 px-6 shadow-black/10"
                        >
                          <AnimatePresence mode="wait">
                            {copied ? (
                              <motion.div
                                key="copied"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center gap-2"
                              >
                                <Check className="w-4 h-4" />
                                Copied
                              </motion.div>
                            ) : (
                              <motion.div
                                key="copy"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center gap-2"
                              >
                                <Copy className="w-4 h-4" />
                                Copy Link
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Button>
                      </motion.div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="text-center p-4 bg-slate-950/40 rounded-2xl border border-slate-700/30 hover:border-[#B48811]/30 transition-all"
                    >
                      <p className="text-3xl font-bold text-[#EBD197]">{stats?.mlm?.directReferrals ?? '0'}</p>
                      <p className="text-slate-400 text-sm mt-1">Direct Referrals</p>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="text-center p-4 bg-slate-950/40 rounded-2xl border border-slate-700/30 hover:border-[#B48811]/30 transition-all"
                    >
                      <p className="text-3xl font-bold text-[#EBD197]">{stats?.mlm?.teamCount ?? '0'}</p>
                      <p className="text-slate-400 text-sm mt-1">Team Members</p>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.02 }}
                      className="text-center p-4 bg-slate-950/40 rounded-2xl border border-slate-700/30 hover:border-[#B48811]/30 transition-all"
                    >
                      <p className="text-3xl font-bold text-[#EBD197]">{formatCurrency(stats?.wallets?.usdCommission)}</p>
                      <p className="text-slate-400 text-sm mt-1">Total Earnings</p>
                    </motion.div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Enhanced Account Status */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-[#B48811]/40 transition-all duration-300 h-full">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#B48811]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10">
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Account Status</h2>
                      <p className="text-slate-400 text-sm mt-1">Security & Verification</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center justify-between p-4 bg-slate-950/40 rounded-2xl border border-slate-700/30 hover:border-[#B48811]/30 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
                          <Mail className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Email Verification</p>
                          <p className="text-slate-400 text-xs">{user?.email}</p>
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${user?.emailVerified ? 'bg-[#EBD197] shadow-lg shadow-[#EBD197]/50' : 'bg-[#BB9B49] shadow-lg shadow-[#BB9B49]/50'}`}></div>
                    </motion.div>

                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center justify-between p-4 bg-slate-950/40 rounded-2xl border border-slate-700/30 hover:border-[#B48811]/30 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
                          <Crown className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Membership</p>
                          <p className="text-slate-400 text-xs">Premium access</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                        stats?.membership?.active 
                          ? 'bg-[#B48811]/10 text-[#EBD197] border border-[#B48811]/20' 
                          : 'bg-[#B48811]/10 text-[#BB9B49] border border-[#B48811]/20'
                      }`}>
                        {stats?.membership?.active ? 'Active' : 'Inactive'}
                      </div>
                    </motion.div>

                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center justify-between p-4 bg-slate-950/40 rounded-2xl border border-slate-700/30 hover:border-[#B48811]/30 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center">
                          <Activity className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium">Mining Status</p>
                          <p className="text-slate-400 text-xs">Current state</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                        stats?.mining?.canMine 
                          ? 'bg-[#B48811]/10 text-[#EBD197] border border-[#B48811]/20' 
                          : 'bg-[#B48811]/10 text-[#BB9B49] border border-[#B48811]/20'
                      }`}>
                        {stats?.mining?.canMine ? 'Ready' : 'Cooldown'}
                      </div>
                    </motion.div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>

          {/* Professional Wallet Balances Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-8"
          >
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Wallet Balances</h2>
                  <p className="text-slate-400 text-sm">Your digital asset portfolio</p>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="ghost" size="sm" className="rounded-full flex items-center gap-2 text-slate-400 hover:text-white">
                  View All
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover="hover" 
                whileTap={{ scale: 0.98 }}
              >
                <StatCard
                  icon={<div className="w-14 h-14 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10"><CircleDollarSign className="w-7 h-7 text-white" /></div>}
                  label="USD Commission"
                  value={formatCurrency(stats?.wallets?.usdCommission)}
                  className="hover:border-[#B48811]/40"
                />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                whileHover="hover" 
                whileTap={{ scale: 0.98 }}
              >
                <StatCard
                  icon={<div className="w-14 h-14 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10"><Box className="w-7 h-7 text-white" /></div>}
                  label="Widget A"
                  value={formatNumber(stats?.wallets?.widgetA)}
                  className="hover:border-[#B48811]/40"
                />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                whileHover="hover" 
                whileTap={{ scale: 0.98 }}
              >
                <StatCard
                  icon={<div className="w-14 h-14 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10"><Coins className="w-7 h-7 text-white" /></div>}
                  label="Widget B"
                  value={formatNumber(stats?.wallets?.widgetB)}
                  className="hover:border-[#B48811]/40"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Professional Network & Mining Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mb-8"
          >
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10">
                <Network className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Network & Mining</h2>
                <p className="text-slate-400 text-sm">Your network performance and mining status</p>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover="hover" 
                whileTap={{ scale: 0.98 }}
              >
                <StatCard
                  icon={<div className="w-14 h-14 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10"><Users className="w-7 h-7 text-white" /></div>}
                  label="Direct Referrals"
                  value={stats?.mlm?.directReferrals ?? '0'}
                  className="hover:border-[#B48811]/40"
                />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                whileHover="hover" 
                whileTap={{ scale: 0.98 }}
              >
                <StatCard
                  icon={<div className="w-14 h-14 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10"><Network className="w-7 h-7 text-white" /></div>}
                  label="Team Count"
                  value={stats?.mlm?.teamCount ?? '0'}
                  className="hover:border-[#B48811]/40"
                />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                whileHover="hover" 
                whileTap={{ scale: 0.98 }}
              >
                <StatCard
                  icon={<div className="w-14 h-14 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10"><Pickaxe className="w-7 h-7 text-white" /></div>}
                  label="Mining"
                  value={stats?.mining?.canMine ? 'Ready' : 'Cooldown'}
                  className="hover:border-[#B48811]/40"
                />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                whileHover="hover" 
                whileTap={{ scale: 0.98 }}
              >
                <StatCard
                  icon={<div className="w-14 h-14 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10"><Crown className="w-7 h-7 text-white" /></div>}
                  label="Membership"
                  value={stats?.membership?.active ? 'Active' : 'Inactive'}
                  className="hover:border-[#B48811]/40"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Professional Widget B Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Widget B Details</h2>
                <p className="text-slate-400 text-sm">Real-time trading metrics and information</p>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover="hover" 
                whileTap={{ scale: 0.98 }}
              >
                <Card className="p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-[#B48811]/40 transition-all duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#B48811]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="relative flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10">
                      <TrendingUp className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-400 text-sm mb-1">Coins per USD</p>
                      <p className="text-3xl font-bold text-white">{formatNumber(stats?.widgetB?.coinsPerUsd)}</p>
                      <div className="flex items-center gap-1 mt-3 text-[#EBD197] text-sm font-medium">
                        <ArrowUpRight className="w-4 h-4" />
                        <span>Live Rate</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                whileHover="hover" 
                whileTap={{ scale: 0.98 }}
              >
                <Card className="p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-[#B48811]/40 transition-all duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#B48811]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="relative flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10">
                      <Percent className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-400 text-sm mb-1">Sell Percent</p>
                      <p className="text-3xl font-bold text-white">{formatNumber(stats?.widgetB?.sellPercent)}%</p>
                      <div className="flex items-center gap-1 mt-3 text-slate-400 text-sm">
                        <span>Current Rate</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                whileHover="hover" 
                whileTap={{ scale: 0.98 }}
              >
                <Card className="p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-[#B48811]/40 transition-all duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#B48811]/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="relative flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10">
                      <Clock className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-400 text-sm mb-1">Next Mining At</p>
                      <p className="text-lg font-bold text-white">
                        {stats?.mining?.nextMiningAt ? new Date(stats.mining.nextMiningAt).toLocaleString() : 'Now'}
                      </p>
                      <div className={`flex items-center gap-1 mt-3 text-sm font-medium ${
                        stats?.mining?.canMine ? 'text-[#EBD197]' : 'text-[#BB9B49]'
                      }`}>
                        <span>{stats?.mining?.canMine ? 'Available Now' : 'In Cooldown'}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
