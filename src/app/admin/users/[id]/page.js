'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getAdminUserDetails, updateUserStatus } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { ArrowLeft, Users, Wallet, Package, Pickaxe, CreditCard, Coins } from 'lucide-react'

export default function UserDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      router.push('/signin')
      return
    }
    const fetchData = async () => {
      try {
        const result = await getAdminUserDetails(id)
        setData(result.success ? result.data : null)
      } catch (err) {
        setError(err.response?.data?.error?.message || err.message || 'Failed to load user details')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, router])

  const handleStatus = async (status) => {
    setError('')
    setMsg('')
    try {
      const result = await updateUserStatus(id, { status })
      if (!result.success) throw new Error(result.error?.message || 'Update failed')
      setMsg(`User status updated to ${status}`)
      setData((prev) => prev ? { ...prev, user: { ...prev.user, status } } : null)
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Update failed')
    }
  }

  const StatCard = ({ icon: Icon, label, value, sub }) => (
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 hover:border-[#B48811]/30 transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-gradient-to-br from-[#EBD197]/10 to-[#B48811]/10 border border-[#B48811]/20 rounded-lg flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#EBD197]" />
        </div>
        <p className="text-slate-400 text-sm">{label}</p>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
    </div>
  )

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center text-white">
      <div className="relative">
        <div className="absolute inset-0 bg-[#B48811]/20 rounded-full blur-xl animate-pulse"></div>
        <div className="relative w-20 h-20 border-4 border-[#B48811]/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-[#B48811] rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-[#EBD197] rounded-full border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      <div className="text-center mt-6">
        <p className="text-white font-semibold text-lg mb-1">Loading User Details</p>
        <p className="text-slate-400 text-sm">Please wait...</p>
      </div>
    </div>
  )

  if (!data) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center text-white">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p className="text-slate-400 mb-4">{error || 'User not found'}</p>
        <Button onClick={() => router.push('/admin/users')} variant="primary">Back to Users</Button>
      </div>
    </div>
  )

  const { user, wallets, membership, mlm, purchases, sells, miningHistory } = data

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button onClick={() => router.push('/admin/users')} variant="outline" className="rounded-full flex items-center gap-2 hover:bg-slate-700/50">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">{user.firstName} {user.lastName}</h1>
            <p className="text-slate-400 text-sm">{user.email}</p>
          </div>
        </div>
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}
      {msg && <p className="text-emerald-400 mb-4">{msg}</p>}

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white"><Users className="w-5 h-5 text-[#EBD197]" /> Profile</h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-slate-500">Email:</span> <span className="text-slate-300">{user.email}</span></p>
            <p><span className="text-slate-500">Username:</span> <span className="text-slate-300">{user.username}</span></p>
            <p><span className="text-slate-500">Role:</span> <span className="text-slate-300">{user.role}</span></p>
            <p><span className="text-slate-500">Status:</span> <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              user.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
              user.status === 'BLOCKED' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
              'bg-slate-700/50 text-slate-300 border-slate-600/30'
            }`}>{user.status}</span></p>
            <p><span className="text-slate-500">Email Verified:</span> <span className="text-slate-300">{user.emailVerified ? 'Yes' : 'No'}</span></p>
            <p><span className="text-slate-500">Referral Code:</span> <span className="text-slate-300">{user.referralCode}</span></p>
            <p><span className="text-slate-500">Sponsor:</span> <span className="text-slate-300">{user.sponsor ? `${user.sponsor.username} (${user.sponsor.email})` : 'None'}</span></p>
            <p><span className="text-slate-500">Joined:</span> <span className="text-slate-300">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</span></p>
          </div>
          <div className="flex gap-3 mt-6">
            {user.status !== 'ACTIVE' && (
              <Button onClick={() => handleStatus('ACTIVE')} variant="primary" size="sm" className="rounded-full bg-gradient-to-r from-[#EBD197] to-[#B48811] text-slate-950 border-0">Activate</Button>
            )}
            {user.status !== 'BLOCKED' && (
              <Button onClick={() => handleStatus('BLOCKED')} variant="outline" size="sm" className="rounded-full hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400">Block</Button>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <StatCard icon={Users} label="Direct Referrals" value={mlm?.directReferrals ?? '0'} />
          <StatCard icon={Package} label="Team Count" value={mlm?.teamCount ?? '0'} />
          <StatCard icon={Wallet} label="USD Wallet" value={wallets?.find(w => w.walletType === 'USD_COMMISSION')?.availableBalance?.toString() ?? '0'} sub="available" />
          <StatCard icon={CreditCard} label="Widget A" value={wallets?.find(w => w.walletType === 'WIDGET_A')?.availableBalance?.toString() ?? '0'} sub="available" />
          <StatCard icon={Coins} label="Widget B" value={wallets?.find(w => w.walletType === 'WIDGET_B')?.availableBalance?.toString() ?? '0'} sub="available" />
          <StatCard icon={Pickaxe} label="Mining" value={miningHistory?.data?.length ?? '0'} sub="recent records" />
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4 text-white">Wallets</h2>
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden mb-8">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/50 border-b border-slate-700/50">
            <tr>
              <th className="p-4 text-slate-400 font-medium">Type</th>
              <th className="p-4 text-slate-400 font-medium">Available</th>
              <th className="p-4 text-slate-400 font-medium">Locked</th>
              <th className="p-4 text-slate-400 font-medium">Total</th>
            </tr>
          </thead>
          <tbody>
            {(wallets || []).length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-slate-500 text-center">No wallets found.</td></tr>
            ) : (
              wallets.map((w, i) => (
                <tr key={i} className="border-t border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 text-white">{w.walletType}</td>
                  <td className="p-4 text-slate-300">{w.availableBalance}</td>
                  <td className="p-4 text-slate-300">{w.lockedBalance}</td>
                  <td className="p-4 font-semibold text-[#EBD197]">{w.availableBalance + w.lockedBalance}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold mb-4 text-white">Membership</h2>
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 mb-8">
        {membership?.active ? (
          <p className="text-emerald-400 font-semibold">Active — {membership.active.amountUsd} USD</p>
        ) : (
          <p className="text-slate-500">No active membership.</p>
        )}
        {membership?.history?.length > 0 && (
          <ul className="divide-y divide-slate-700/30 mt-4">
            {membership.history.map((h, i) => (
              <li key={i} className="py-2 flex justify-between text-sm">
                <span className="text-slate-300">{h.amountUsd} USD — {h.status}</span>
                <span className="text-slate-500">{h.createdAt ? new Date(h.createdAt).toLocaleDateString() : '-'}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <h2 className="text-xl font-bold mb-4 text-white">Widget B Purchases</h2>
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden mb-8">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/50 border-b border-slate-700/50">
            <tr><th className="p-4 text-slate-400 font-medium">USD</th><th className="p-4 text-slate-400 font-medium">Coins</th><th className="p-4 text-slate-400 font-medium">Status</th><th className="p-4 text-slate-400 font-medium">Date</th></tr>
          </thead>
          <tbody>
            {(purchases?.data || []).length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-slate-500 text-center">No purchases found.</td></tr>
            ) : (
              purchases.data.map((p, i) => (
                <tr key={i} className="border-t border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 text-slate-300">{p.usdAmount}</td>
                  <td className="p-4 text-slate-300">{p.coinAmount}</td>
                  <td className="p-4 text-slate-300">{p.status}</td>
                  <td className="p-4 text-slate-300">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold mb-4 text-white">Sell Requests</h2>
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden mb-8">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/50 border-b border-slate-700/50">
            <tr><th className="p-4 text-slate-400 font-medium">Coins</th><th className="p-4 text-slate-400 font-medium">Payout (USDT)</th><th className="p-4 text-slate-400 font-medium">Status</th><th className="p-4 text-slate-400 font-medium">Date</th></tr>
          </thead>
          <tbody>
            {(sells?.data || []).length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-slate-500 text-center">No sell requests found.</td></tr>
            ) : (
              sells.data.map((s, i) => (
                <tr key={i} className="border-t border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 text-slate-300">{s.coinAmount}</td>
                  <td className="p-4 text-slate-300">{s.payoutUsdValue}</td>
                  <td className="p-4 text-slate-300">{s.status}</td>
                  <td className="p-4 text-slate-300">{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold mb-4 text-white">Mining History</h2>
      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/50 border-b border-slate-700/50">
            <tr><th className="p-4 text-slate-400 font-medium">Content</th><th className="p-4 text-slate-400 font-medium">Reward</th><th className="p-4 text-slate-400 font-medium">Date</th></tr>
          </thead>
          <tbody>
            {(miningHistory?.data || []).length === 0 ? (
              <tr><td colSpan={3} className="p-4 text-slate-500 text-center">No mining history found.</td></tr>
            ) : (
              miningHistory.data.map((m, i) => (
                <tr key={i} className="border-t border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 text-slate-300">{m.contentTitle || m.content?.title || '-'}</td>
                  <td className="p-4 text-slate-300">{m.rewardCoins}</td>
                  <td className="p-4 text-slate-300">{m.minedAt ? new Date(m.minedAt).toLocaleDateString() : '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
