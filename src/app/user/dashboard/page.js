'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
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
} from 'lucide-react'

const Icon3D = ({ icon: Icon, color = 'emerald', animation = 'tilt' }) => {
  const gradients = {
    emerald: 'from-emerald-400/50 to-emerald-700/20',
    gold: 'from-[#EBD197]/50 to-[#B48811]/20',
  }
  const shadows = {
    emerald: 'shadow-[0_12px_24px_rgba(16,185,129,0.45)]',
    gold: 'shadow-[0_12px_24px_rgba(180,136,17,0.45)]',
  }
  const anims = {
    tilt: { rotateY: [0, 18, -18, 0], rotateX: [0, 10, -10, 0], y: [0, -5, 0], transition: { repeat: Infinity, duration: 5, ease: 'easeInOut' } },
    spin: { rotateY: [0, 360], transition: { repeat: Infinity, duration: 6, ease: 'linear' } },
    float: { y: [0, -6, 0], rotateX: [0, 12, 0], transition: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' } },
    swing: { rotateZ: [-18, 18, -18], transition: { repeat: Infinity, duration: 1.4, ease: 'easeInOut' } },
    pulse: { scale: [1, 1.15, 1], rotateY: [0, 25, 0], transition: { repeat: Infinity, duration: 1.8, ease: 'easeInOut' } },
    wiggle: { rotate: [-8, 8, -8], transition: { repeat: Infinity, duration: 1.2, ease: 'easeInOut' } },
  }
  return (
    <motion.div
      className={`w-full h-full rounded-xl flex items-center justify-center bg-gradient-to-br ${gradients[color]} ${shadows[color]} border border-white/15`}
      style={{ perspective: 120 }}
      animate={anims[animation]}
    >
      <Icon className="w-6 h-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" />
    </motion.div>
  )
}

export default function UserDashboard() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

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
      .catch(() => {
        localStorage.removeItem('token')
        router.push('/signin')
      })
      .finally(() => setLoading(false))
  }, [router])

  const handleCopy = () => {
    if (!user?.referralCode) return
    navigator.clipboard.writeText(`${window.location.origin}/signup?sponsor=${user.referralCode}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">
        Loading...
      </div>
    )
  }

  const referralUrl = typeof window !== 'undefined' && user?.referralCode ? `${window.location.origin}/signup?sponsor=${user.referralCode}` : ''

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {user?.firstName || 'User'}</h1>
            <p className="text-zinc-400 mt-1">{user?.email}</p>
          </div>
          <Button onClick={() => { localStorage.removeItem('token'); router.push('/signin') }} variant="outline" className="rounded-full w-fit">Logout</Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 md:col-span-2">
            <h2 className="font-semibold text-lg mb-2">Your Referral Link</h2>
            <p className="text-zinc-400 text-sm mb-4">Invite friends and earn rewards on every purchase they make.</p>
            <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl p-3">
              <input
                readOnly
                value={referralUrl}
                className="bg-transparent flex-1 text-sm font-mono text-zinc-300 outline-none"
              />
              <Button onClick={handleCopy} variant="outline" size="sm" className="rounded-full flex items-center gap-2">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Icon3D icon={Mail} color="emerald" animation="wiggle" />
              </div>
              <div>
                <h2 className="font-semibold text-lg mb-2">Email Status</h2>
                <p className={`text-2xl font-bold ${user?.emailVerified ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {user?.emailVerified ? 'Verified' : 'Pending'}
                </p>
                <p className="text-zinc-500 text-sm mt-1">
                  {user?.emailVerified ? 'Full access enabled.' : 'Verify to unlock all features.'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <h2 className="text-lg font-semibold text-zinc-300 mb-4">Wallet Balances</h2>
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <StatCard
            icon={<Icon3D icon={CircleDollarSign} color="emerald" animation="pulse" />}
            label="USD Commission"
            value={stats?.wallets?.usdCommission ?? '0'}
          />
          <StatCard
            icon={<Icon3D icon={Box} color="emerald" animation="float" />}
            label="Widget A"
            value={stats?.wallets?.widgetA ?? '0'}
          />
          <StatCard
            icon={<Icon3D icon={Coins} color="emerald" animation="tilt" />}
            label="Widget B"
            value={stats?.wallets?.widgetB ?? '0'}
          />
        </div>

        <h2 className="text-lg font-semibold text-zinc-300 mb-4">Network & Mining</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            icon={<Icon3D icon={Users} color="emerald" animation="pulse" />}
            label="Direct Referrals"
            value={stats?.mlm?.directReferrals ?? '0'}
          />
          <StatCard
            icon={<Icon3D icon={Network} color="emerald" animation="tilt" />}
            label="Team Count"
            value={stats?.mlm?.teamCount ?? '0'}
          />
          <StatCard
            icon={<Icon3D icon={Pickaxe} color="emerald" animation="swing" />}
            label="Mining"
            value={stats?.mining?.canMine ? 'Ready' : 'Cooldown'}
          />
          <StatCard
            icon={<Icon3D icon={Crown} color="emerald" animation="float" />}
            label="Membership"
            value={stats?.membership?.active ? 'Active' : 'Inactive'}
          />
        </div>

        <h2 className="text-lg font-semibold text-zinc-300 mb-4">Widget B</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#B48811]/10 text-[#B48811] border border-[#B48811]/20">
                <Icon3D icon={TrendingUp} color="gold" animation="float" />
              </div>
              <div>
                <p className="text-zinc-400 text-sm">Coins per USD</p>
                <p className="text-2xl font-bold mt-1">{stats?.widgetB?.coinsPerUsd ?? '0'}</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#B48811]/10 text-[#B48811] border border-[#B48811]/20">
                <Icon3D icon={Percent} color="gold" animation="pulse" />
              </div>
              <div>
                <p className="text-zinc-400 text-sm">Sell Percent</p>
                <p className="text-2xl font-bold mt-1">{stats?.widgetB?.sellPercent ?? '0'}%</p>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#B48811]/10 text-[#B48811] border border-[#B48811]/20">
                <Icon3D icon={Clock} color="gold" animation="spin" />
              </div>
              <div>
                <p className="text-zinc-400 text-sm">Next Mining At</p>
                <p className="text-2xl font-bold mt-1">
                  {stats?.mining?.nextMiningAt ? new Date(stats.mining.nextMiningAt).toLocaleString() : 'Now'}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
