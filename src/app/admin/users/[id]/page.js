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
    <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-5 h-5 text-[#EBD197]" />
        <p className="text-zinc-400 text-sm">{label}</p>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {sub && <p className="text-zinc-500 text-xs mt-1">{sub}</p>}
    </div>
  )

  if (loading) return <div className="p-8 text-white">Loading...</div>
  if (!data) return <div className="p-8 text-red-400">{error || 'User not found'}</div>

  const { user, wallets, membership, mlm, purchases, sells, miningHistory } = data

  return (
    <div className="p-8 text-white w-full">
      <div className="flex items-center gap-4 mb-6">
        <Button onClick={() => router.push('/admin/users')} variant="outline" className="rounded-full flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}
      {msg && <p className="text-green-400 mb-4">{msg}</p>}

      <h1 className="text-3xl font-bold mb-6">{user.firstName} {user.lastName}</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-[#EBD197]" /> Profile</h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-zinc-500">Email:</span> {user.email}</p>
            <p><span className="text-zinc-500">Username:</span> {user.username}</p>
            <p><span className="text-zinc-500">Role:</span> {user.role}</p>
            <p><span className="text-zinc-500">Status:</span> {user.status}</p>
            <p><span className="text-zinc-500">Email Verified:</span> {user.emailVerified ? 'Yes' : 'No'}</p>
            <p><span className="text-zinc-500">Referral Code:</span> {user.referralCode}</p>
            <p><span className="text-zinc-500">Sponsor:</span> {user.sponsor ? `${user.sponsor.username} (${user.sponsor.email})` : 'None'}</p>
            <p><span className="text-zinc-500">Joined:</span> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}</p>
          </div>
          <div className="flex gap-3 mt-6">
            {user.status !== 'ACTIVE' && (
              <Button onClick={() => handleStatus('ACTIVE')} variant="primary" size="sm" className="rounded-full">Activate</Button>
            )}
            {user.status !== 'BLOCKED' && (
              <Button onClick={() => handleStatus('BLOCKED')} variant="outline" size="sm" className="rounded-full">Block</Button>
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

      <h2 className="text-xl font-bold mb-4">Wallets</h2>
      <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl overflow-hidden mb-8">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-800 text-zinc-300">
            <tr>
              <th className="p-4">Type</th>
              <th className="p-4">Available</th>
              <th className="p-4">Locked</th>
              <th className="p-4">Total</th>
            </tr>
          </thead>
          <tbody>
            {(wallets || []).length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-zinc-500">No wallets found.</td></tr>
            ) : (
              wallets.map((w, i) => (
                <tr key={i} className="border-t border-zinc-800">
                  <td className="p-4">{w.walletType}</td>
                  <td className="p-4">{w.availableBalance}</td>
                  <td className="p-4">{w.lockedBalance}</td>
                  <td className="p-4 font-semibold">{w.availableBalance + w.lockedBalance}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold mb-4">Membership</h2>
      <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6 mb-8">
        {membership?.active ? (
          <p className="text-emerald-400 font-semibold">Active — {membership.active.amountUsd} USD</p>
        ) : (
          <p className="text-zinc-500">No active membership.</p>
        )}
        {membership?.history?.length > 0 && (
          <ul className="divide-y divide-zinc-800 mt-4">
            {membership.history.map((h, i) => (
              <li key={i} className="py-2 flex justify-between text-sm">
                <span>{h.amountUsd} USD — {h.status}</span>
                <span className="text-zinc-500">{h.createdAt ? new Date(h.createdAt).toLocaleDateString() : '-'}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <h2 className="text-xl font-bold mb-4">Widget B Purchases</h2>
      <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl overflow-hidden mb-8">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-800 text-zinc-300">
            <tr><th className="p-4">USD</th><th className="p-4">Coins</th><th className="p-4">Status</th><th className="p-4">Date</th></tr>
          </thead>
          <tbody>
            {(purchases?.data || []).length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-zinc-500">No purchases found.</td></tr>
            ) : (
              purchases.data.map((p, i) => (
                <tr key={i} className="border-t border-zinc-800">
                  <td className="p-4">{p.usdAmount}</td>
                  <td className="p-4">{p.coinAmount}</td>
                  <td className="p-4">{p.status}</td>
                  <td className="p-4">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold mb-4">Sell Requests</h2>
      <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl overflow-hidden mb-8">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-800 text-zinc-300">
            <tr><th className="p-4">Coins</th><th className="p-4">Payout (USDT)</th><th className="p-4">Status</th><th className="p-4">Date</th></tr>
          </thead>
          <tbody>
            {(sells?.data || []).length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-zinc-500">No sell requests found.</td></tr>
            ) : (
              sells.data.map((s, i) => (
                <tr key={i} className="border-t border-zinc-800">
                  <td className="p-4">{s.coinAmount}</td>
                  <td className="p-4">{s.payoutUsdValue}</td>
                  <td className="p-4">{s.status}</td>
                  <td className="p-4">{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold mb-4">Mining History</h2>
      <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-800 text-zinc-300">
            <tr><th className="p-4">Content</th><th className="p-4">Reward</th><th className="p-4">Date</th></tr>
          </thead>
          <tbody>
            {(miningHistory?.data || []).length === 0 ? (
              <tr><td colSpan={3} className="p-4 text-zinc-500">No mining history found.</td></tr>
            ) : (
              miningHistory.data.map((m, i) => (
                <tr key={i} className="border-t border-zinc-800">
                  <td className="p-4">{m.contentTitle || m.content?.title || '-'}</td>
                  <td className="p-4">{m.rewardCoins}</td>
                  <td className="p-4">{m.minedAt ? new Date(m.minedAt).toLocaleDateString() : '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
