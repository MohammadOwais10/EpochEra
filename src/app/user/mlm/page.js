'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getMySponsor, getMyDirectReferrals, getMlmStatistics } from '@/lib/api'

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

  if (loading) return <div className="p-8 text-white">Loading...</div>
  if (error) return <div className="p-8 text-red-400">{error}</div>

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">MLM / Referrals</h1>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm">Direct Referrals</p>
          <p className="text-2xl font-bold mt-2">{stats?.directReferralsCount ?? direct.length}</p>
        </div>
        <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm">Total Team</p>
          <p className="text-2xl font-bold mt-2">{stats?.totalTeamCount ?? '0'}</p>
        </div>
        <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm">Total Earnings</p>
          <p className="text-2xl font-bold mt-2">{stats?.totalEarnings ?? '0'}</p>
        </div>
      </div>

      <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-2">Sponsor</h2>
        {sponsor ? (
          <p className="text-zinc-300">{sponsor.email}</p>
        ) : (
          <p className="text-zinc-500">No sponsor found.</p>
        )}
      </div>

      <h2 className="text-xl font-bold mb-4">Direct Referrals</h2>
      <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl overflow-hidden">
        {direct.length === 0 ? (
          <p className="p-6 text-zinc-500">No direct referrals yet.</p>
        ) : (
          <ul className="divide-y divide-zinc-800">
            {direct.map((r, i) => (
              <li key={i} className="p-4 flex justify-between">
                <span className="text-zinc-300">{r.email}</span>
                <span className="text-zinc-500 text-sm">{r.username}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
