'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { getUserById } from '@/lib/api'
import Card from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { UserCircle, Mail, User, Shield, Clock, Key, CheckCircle, XCircle, Copy, Check } from 'lucide-react'
import { clearAuthTokens } from '@/lib/utils'

export default function AdminProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(text)
      setTimeout(() => setCopied(''), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
    }
  }

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      router.push('/signin')
      return
    }
    const fetchProfile = async () => {
      try {
        const result = await getUserById()
        setUser(result.success ? result.data : null)
      } catch (err) {
        setError(err.response?.data?.error?.message || err.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [router])

  const handleLogout = () => {
    clearAuthTokens()
    router.push('/signin')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#B48811]/30 border-t-[#EBD197] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="text-slate-400 mb-4">{error}</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-slate-400">No profile data found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4 mb-8"
      >
        <div className="w-14 h-14 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10">
          <UserCircle className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">My Profile</h1>
          <p className="text-slate-400 text-sm">Your admin account details</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Personal Info */}
        <Card className="p-6 border-[#B48811]/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#B48811]/10 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-[#EBD197]" />
            </div>
            <h2 className="text-lg font-bold text-white">Personal Information</h2>
          </div>
          <div className="space-y-4">
            <ProfileRow label="First Name" value={user.firstName} />
            <ProfileRow label="Last Name" value={user.lastName} />
            <ProfileRow label="Full Name" value={`${user.firstName || ''} ${user.lastName || ''}`.trim()} />
          </div>
        </Card>

        {/* Account Info */}
        <Card className="p-6 border-[#B48811]/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#B48811]/10 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-[#EBD197]" />
            </div>
            <h2 className="text-lg font-bold text-white">Account Details</h2>
          </div>
          <div className="space-y-4">
            <ProfileRow label="Email" value={user.email} />
            <ProfileRow label="Username" value={user.username} />
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
              <span className="text-slate-400 text-sm">Referral Code</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-medium text-sm font-mono break-all" title={user.referralCode}>{user.referralCode}</span>
                <button
                  onClick={() => handleCopy(user.referralCode)}
                  className="text-[#EBD197] hover:text-white transition-colors"
                  title="Copy referral code"
                >
                  {copied === user.referralCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <ProfileRow label="User ID" value={user.id} />
          </div>
        </Card>

        {/* Role & Status */}
        <Card className="p-6 border-[#B48811]/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#B48811]/10 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#EBD197]" />
            </div>
            <h2 className="text-lg font-bold text-white">Role & Status</h2>
          </div>
          <div className="space-y-4">
            <ProfileRow label="Role" value={user.role} />
            <ProfileRow label="Status" value={user.status} />
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Email Verified</span>
              <div className="flex items-center gap-2">
                {user.emailVerified ? (
                  <>
                    <span className="text-emerald-400 text-sm font-medium">Verified</span>
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  </>
                ) : (
                  <>
                    <span className="text-red-400 text-sm font-medium">Not Verified</span>
                    <XCircle className="w-4 h-4 text-red-400" />
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Timestamps */}
        <Card className="p-6 border-[#B48811]/30">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#B48811]/10 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#EBD197]" />
            </div>
            <h2 className="text-lg font-bold text-white">Timestamps</h2>
          </div>
          <div className="space-y-4">
            <ProfileRow label="Joined At" value={user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'} />
            <ProfileRow label="Last Updated" value={user.updatedAt ? new Date(user.updatedAt).toLocaleString() : '-'} />
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 flex flex-col sm:flex-row gap-4"
      >
        <Button onClick={handleLogout} variant="outline" className="rounded-full px-8">
          Logout
        </Button>
      </motion.div>
    </div>
  )
}

function ProfileRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className="text-white font-medium text-sm break-all" title={value}>{value ?? '-'}</span>
    </div>
  )
}
