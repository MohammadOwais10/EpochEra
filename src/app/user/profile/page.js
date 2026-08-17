'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { getUserById, getDashboard } from '@/lib/api'
import { clearAuthTokens } from '@/lib/utils'
import {
  User,
  Mail,
  Shield,
  Clock,
  Copy,
  Check,
  Calendar,
  Link as LinkIcon,
  Lock,
  X,
} from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
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

export default function UserProfile() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      router.push('/user/signin')
      return
    }
    Promise.all([getUserById(), getDashboard()])
      .then(([u, d]) => {
        console.log('User profile API responses:', { user: u, dashboard: d })
        if (u.success) {
          const userData = u.data || u.user || u
          setUser(userData)
        }
        if (d.success) {
          setStats(d.data)
        }
      })
      .catch((err) => {
        console.error('User profile error:', err)
        setError('Failed to load profile data')
        clearAuthTokens()
        router.push('/user/signin')
      })
      .finally(() => setLoading(false))
  }, [router])

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center text-white px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4 sm:gap-6"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-[#B48811]/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 border-4 border-[#B48811]/20 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20 border-4 border-[#B48811] rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20 border-4 border-[#EBD197] rounded-full border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="text-center">
            <p className="text-white font-semibold text-base sm:text-lg mb-1">Loading Profile</p>
            <p className="text-slate-400 text-xs sm:text-sm">Preparing your profile information...</p>
          </div>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center text-white px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md w-full"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-7 h-7 sm:w-8 sm:h-8 text-red-400" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-slate-400 text-sm sm:text-base mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="primary" className="w-full sm:w-auto min-h-[44px]">
            Try Again
          </Button>
        </motion.div>
      </div>
    )
  }

  const referralUrl = typeof window !== 'undefined' && user?.referralCode 
    ? `${window.location.origin}/signup?sponsor=${user.referralCode}` 
    : ''

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Professional Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-125 h-125 sm:w-150 sm:h-150 bg-[#B48811]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-125 h-125 sm:w-150 sm:h-150 bg-[#B48811]/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 sm:w-250 sm:h-250 bg-[#B48811]/2 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10 shrink-0">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">My Profile</h1>
                <p className="text-slate-400 text-xs sm:text-sm">Manage your account information</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {/* Profile Information Card */}
          <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-2">
            <Card className="p-4 sm:p-6 md:p-8 bg-linear-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-[#B48811]/40 transition-all duration-300">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-[#EBD197]" />
                  Personal Information
                </h2>
              </div>

              <div className="space-y-4 sm:space-y-6">
                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] rounded-full flex items-center justify-center text-2xl sm:text-3xl font-bold text-white shadow-lg shrink-0">
                    {user?.firstName?.[0] || user?.username?.[0] || 'U'}
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                      {user?.firstName && user?.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user?.username || 'User'}
                    </h3>
                    <p className="text-slate-400 text-sm">@{user?.username || 'username'}</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">First Name</label>
                    <div className="px-3 sm:px-4 py-3 rounded-xl bg-slate-800/30 border border-slate-700/50 text-white text-sm sm:text-base">
                      {user?.firstName || 'Not set'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">Last Name</label>
                    <div className="px-3 sm:px-4 py-3 rounded-xl bg-slate-800/30 border border-slate-700/50 text-white text-sm sm:text-base">
                      {user?.lastName || 'Not set'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">Username</label>
                    <div className="px-3 sm:px-4 py-3 rounded-xl bg-slate-800/30 border border-slate-700/50 text-white text-sm sm:text-base">
                      @{user?.username || 'Not set'}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">Email</label>
                    <div className="px-3 sm:px-4 py-3 rounded-xl bg-slate-800/30 border border-slate-700/50 text-white flex items-center justify-between text-sm sm:text-base">
                      <span className="truncate">{user?.email || 'Not set'}</span>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium shrink-0 ml-2 ${
                        user?.emailVerified
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {user?.emailVerified ? (
                          <>
                            <Shield className="w-3 h-3" />
                            <span className="hidden sm:inline">Verified</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            <span className="hidden sm:inline">Pending</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Account Status Card */}
          <motion.div variants={itemVariants}>
            <Card className="p-4 sm:p-6 bg-linear-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-[#B48811]/40 transition-all duration-300">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[#EBD197]" />
                Account Status
              </h2>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700/50">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
                    <span className="text-slate-300 text-sm">Email Verification</span>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium shrink-0 ${
                    user?.emailVerified
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-yellow-500/10 text-yellow-400'
                  }`}>
                    {user?.emailVerified ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span className="hidden sm:inline">Verified</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3" />
                        <span className="hidden sm:inline">Pending</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700/50">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
                    <span className="text-slate-300 text-sm">Member Since</span>
                  </div>
                  <span className="text-white font-medium text-sm">
                    {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                  </span>
                </div>

                {stats?.membership?.active && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-linear-to-r from-[#B48811]/10 to-[#BB9B49]/10 border border-[#B48811]/20">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-[#EBD197] shrink-0" />
                      <span className="text-[#EBD197] text-sm">Premium Member</span>
                    </div>
                    <div className="w-2 h-2 bg-[#EBD197] rounded-full animate-pulse shrink-0"></div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Referral Information Card */}
          <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-2">
            <Card className="p-4 sm:p-6 md:p-8 bg-linear-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-[#B48811]/40 transition-all duration-300">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                <LinkIcon className="w-4 h-4 sm:w-5 sm:h-5 text-[#EBD197]" />
                Referral Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">Your Referral Code</label>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="flex-1 px-3 sm:px-4 py-3 rounded-xl bg-slate-800/30 border border-slate-700/50 text-white font-mono text-sm sm:text-base">
                      {user?.referralCode || 'Not available'}
                    </div>
                    {user?.referralCode && (
                      <Button
                        onClick={() => handleCopy(user.referralCode)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 min-h-[44px] px-4"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span className="hidden sm:inline">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span className="hidden sm:inline">Copy</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {referralUrl && (
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-300 mb-2">Your Referral Link</label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <div className="flex-1 px-3 sm:px-4 py-3 rounded-xl bg-slate-800/30 border border-slate-700/50 text-white text-xs sm:text-sm truncate">
                        {referralUrl}
                      </div>
                      <Button
                        onClick={() => handleCopy(referralUrl)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 min-h-[44px] px-4"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span className="hidden sm:inline">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span className="hidden sm:inline">Copy</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="p-3 sm:p-4 rounded-xl bg-linear-to-r from-[#B48811]/10 to-[#BB9B49]/10 border border-[#B48811]/20">
                  <p className="text-slate-300 text-xs sm:text-sm">
                    Share your referral code or link with friends and earn rewards when they sign up and make purchases.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Security Card */}
          <motion.div variants={itemVariants}>
            <Card className="p-4 sm:p-6 bg-linear-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 hover:border-[#B48811]/40 transition-all duration-300">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
                <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-[#EBD197]" />
                Security
              </h2>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start min-h-[44px]"
                  onClick={() => router.push('/forgot-password')}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}