'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { getMySponsor, getMyDirectReferrals, getMlmStatistics } from '@/lib/api'
import { Users, UserPlus, DollarSign, Coins, Mail, User, Building2, TrendingUp, X } from 'lucide-react'
import Card from '@/components/ui/Card'

export default function MlmPage() {
  const router = useRouter()
  const [sponsor, setSponsor] = useState(null)
  const [direct, setDirect] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      router.push('/signin')
      return
    }
    const fetchData = async () => {
      try {
        const [s, d, st] = await Promise.all([getMySponsor(), getMyDirectReferrals(), getMlmStatistics()])
        setSponsor(s.success ? s.data : null)
        setDirect(d.success ? (d.data?.data || d.data || []) : [])
        setStats(st.success ? st.data : null)
      } catch (err) {
        setError(err.response?.data?.error?.message || err.message || 'Failed to load MLM data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-[#B48811]/30 border-t-[#EBD197] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm sm:text-base">Loading MLM data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center p-4">
        <Card className="p-6 sm:p-8 max-w-md w-full text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 sm:w-8 sm:h-8 text-red-400" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">Error Loading Data</h2>
          <p className="text-slate-400 text-sm sm:text-base mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 sm:py-2 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-xl text-white font-medium hover:opacity-90 transition-opacity min-h-[44px]"
          >
            Try Again
          </button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Professional Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-125 h-125 sm:w-[500px] sm:h-[500px] bg-[#B48811]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-125 h-125 sm:w-[500px] sm:h-[500px] bg-[#B48811]/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 sm:w-[800px] sm:h-[800px] bg-[#B48811]/2 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItaC0ydjJoLTJvLTJoLTJvLTJoLTJ2MmgydjJoMnYtMmgydi0yaDJ2LTJoLTJ2LTJoLTJvLTJoLTJ2MmgydjJoLTJ2LTJoLTJvLTJoLTJ2MmgydjJoMnYtMmgydi0yaDJ2LTJoLTJ6bTAgMmgydjJoLTJ2LTJoLTJ6bTAgMmgydjJoLTJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Professional Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 sm:mb-8"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10 shrink-0">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">MLM / Referrals</h1>
                <p className="text-slate-400 text-xs sm:text-sm">Manage your referral network</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 sm:mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
              className="group relative bg-linear-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 sm:p-6 hover:border-[#B48811]/40 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-[#B48811]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-black/10 group-hover:scale-110 transition-transform duration-300 shrink-0">
                    <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-[#EBD197] text-xs sm:text-sm font-medium">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Growing</span>
                  </div>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm font-medium mb-1">Direct Referrals</p>
                <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{stats?.directReferralsCount ?? direct.length}</p>
                <p className="text-slate-500 text-xs mt-1 sm:mt-2">People you've referred</p>
              </div>
            </motion.div>

            {/* <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
              className="group relative bg-linear-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 sm:p-6 hover:border-[#B48811]/40 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-[#B48811]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-black/10 group-hover:scale-110 transition-transform duration-300 shrink-0">
                    <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-[#EBD197] text-xs sm:text-sm font-medium">
                    <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Team</span>
                  </div>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm font-medium mb-1">Total Team</p>
                <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{stats?.totalTeamCount ?? '0'}</p>
                <p className="text-slate-500 text-xs mt-1 sm:mt-2">Your entire network</p>
              </div>
            </motion.div> */}

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
              className="group relative bg-linear-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 sm:p-6 hover:border-[#B48811]/40 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-[#B48811]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-black/10 group-hover:scale-110 transition-transform duration-300 shrink-0">
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-[#EBD197] text-xs sm:text-sm font-medium">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>USDT</span>
                  </div>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm font-medium mb-1">USDT Earnings</p>
                <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{stats?.totalUsdEarnings ?? '0'}</p>
                <p className="text-slate-500 text-xs mt-1 sm:mt-2">From your network</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
              className="group relative bg-linear-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 sm:p-6 hover:border-[#B48811]/40 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-[#B48811]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-black/10 group-hover:scale-110 transition-transform duration-300 shrink-0">
                    <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-[#EBD197] text-xs sm:text-sm font-medium">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Widget A</span>
                  </div>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm font-medium mb-1">Epoch Coin Earnings</p>
                <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{stats?.totalWidgetAEarnings ?? '0'}</p>
                <p className="text-slate-500 text-xs mt-1 sm:mt-2">From your network</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
              className="group relative bg-linear-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 sm:p-6 hover:border-[#B48811]/40 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-[#B48811]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-black/10 group-hover:scale-110 transition-transform duration-300 shrink-0">
                    <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-[#EBD197] text-xs sm:text-sm font-medium">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Widget B</span>
                  </div>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm font-medium mb-1">Referral Coin Earnings</p>
                <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{stats?.totalWidgetBEarnings ?? '0'}</p>
                <p className="text-slate-500 text-xs mt-1 sm:mt-2">From direct referrals</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Sponsor Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-6 sm:mb-8"
          >
            <Card className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 sm:mb-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10 shrink-0">
                    <User className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Your Sponsor</h2>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">The person who referred you</p>
                  </div>
                </div>
              </div>

              {sponsor ? (
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-medium text-sm sm:text-base truncate">{sponsor.email}</p>
                    <p className="text-slate-400 text-xs sm:text-sm">Your upline sponsor</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-700/50 rounded-full flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-slate-300 font-medium text-sm sm:text-base">No sponsor found</p>
                    <p className="text-slate-500 text-xs sm:text-sm">You might be at the top level</p>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Direct Referrals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10 shrink-0">
                <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Direct Referrals</h2>
                <p className="text-slate-400 text-xs sm:text-sm">People you've directly referred</p>
              </div>
            </motion.div>

            <Card className="overflow-hidden">
              {direct.length === 0 ? (
                <div className="p-6 sm:p-8 text-center">
                  <UserPlus className="w-10 h-10 sm:w-12 sm:h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500 text-sm sm:text-base">No direct referrals yet</p>
                  <p className="text-slate-400 text-xs sm:text-sm mt-2">Start sharing your referral link to build your team</p>
                </div>
              ) : (
                <>
                  {/* Mobile Card Layout */}
                  <div className="sm:hidden divide-y divide-slate-700/50">
                    {direct.map((r, i) => (
                      <div key={i} className="p-4 hover:bg-slate-800/30 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-full flex items-center justify-center shrink-0">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-white text-sm truncate">{r.email}</p>
                            <p className="text-slate-400 text-xs">@{r.username}</p>
                            <div className="flex items-center gap-1 text-[#EBD197] text-xs font-medium mt-2">
                              <UserPlus className="w-3 h-3" />
                              <span>Direct</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Desktop Table Layout */}
                  <div className="hidden sm:block divide-y divide-slate-700/50">
                    {direct.map((r, i) => (
                      <div key={i} className="p-4 hover:bg-slate-800/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-full flex items-center justify-center shrink-0">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-white">{r.email}</p>
                              <p className="text-slate-400 text-sm">@{r.username}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-[#EBD197] text-sm font-medium">
                            <UserPlus className="w-4 h-4" />
                            <span>Direct</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Card>
          </motion.div>

          {/* Widget B Referral Rewards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mb-6 sm:mb-8"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10 shrink-0">
                <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Widget B Referral Coins</h2>
                <p className="text-slate-400 text-xs sm:text-sm">Coins earned from direct referral purchases</p>
              </div>
            </motion.div>

            <Card className="overflow-hidden">
              {(stats?.widgetBRewards || []).length === 0 ? (
                <div className="p-6 sm:p-8 text-center">
                  <Coins className="w-10 h-10 sm:w-12 sm:h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500 text-sm sm:text-base">No Widget B referral rewards yet</p>
                  <p className="text-slate-400 text-xs sm:text-sm mt-2">Your direct referrals' purchases will appear here</p>
                </div>
              ) : (
                <>
                  {/* Mobile Card Layout */}
                  <div className="sm:hidden divide-y divide-slate-700/50">
                    {stats.widgetBRewards.map((r, i) => (
                      <div key={i} className="p-4 hover:bg-slate-800/30 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-full flex items-center justify-center shrink-0">
                            <Coins className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-white text-sm truncate">
                              {r.fromUser ? (r.fromUser.firstName ? `${r.fromUser.firstName} ${r.fromUser.lastName || ''}` : r.fromUser.email) : 'Unknown'}
                            </p>
                            {r.fromUser?.username && <p className="text-slate-500 text-xs">@{r.fromUser.username}</p>}
                            <div className="mt-2 flex items-center justify-between">
                              <span className="font-semibold text-[#EBD197] text-sm">+{r.amount}</span>
                              <span className="text-slate-300 text-xs">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Desktop Table Layout */}
                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-800/50 border-b border-slate-700/50">
                        <tr>
                          <th className="p-4 text-slate-400 font-medium">From User</th>
                          <th className="p-4 text-slate-400 font-medium">Coins</th>
                          <th className="p-4 text-slate-400 font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.widgetBRewards.map((r, i) => (
                          <tr key={i} className="border-t border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                            <td className="p-4">
                              <p className="font-medium text-white">
                                {r.fromUser ? (r.fromUser.firstName ? `${r.fromUser.firstName} ${r.fromUser.lastName || ''}` : r.fromUser.email) : 'Unknown'}
                              </p>
                              {r.fromUser?.username && <p className="text-slate-500 text-xs">@{r.fromUser.username}</p>}
                            </td>
                            <td className="p-4 font-semibold text-[#EBD197]">+{r.amount}</td>
                            <td className="p-4 text-slate-300">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
