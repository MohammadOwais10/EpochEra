'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getMiningContent, getMiningStatus, mine, getMiningHistory } from '@/lib/api'
import { Button } from '@/components/ui/Button'

export default function MiningPage() {
  const router = useRouter()
  const [content, setContent] = useState([])
  const [status, setStatus] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [mining, setMining] = useState(false)
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
        const [c, s, h] = await Promise.all([getMiningContent(), getMiningStatus(), getMiningHistory()])
        setContent(c.success ? (c.data?.data || c.data || []) : [])
        setStatus(s.success ? s.data : null)
        setHistory(h.success ? (h.data?.data || h.data || []) : [])
      } catch (err) {
        setError(err.response?.data?.error?.message || err.message || 'Failed to load mining')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [router])

  const handleMine = async (contentId) => {
    setMining(true)
    setError('')
    setMsg('')
    try {
      const result = await mine({ contentId, confirmation: true })
      if (!result.success) throw new Error(result.error?.message || 'Mining failed')
      setMsg(result.data.message || 'Mined successfully')
      const s = await getMiningStatus()
      setStatus(s.success ? s.data : null)
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Mining failed')
    } finally {
      setMining(false)
    }
  }

  if (loading) return <div className="p-8 text-white">Loading...</div>

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Mining</h1>
      {error && <p className="text-red-400 mb-4">{error}</p>}
      {msg && <p className="text-green-400 mb-4">{msg}</p>}

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm">Can Mine</p>
          <p className="text-2xl font-bold mt-2">{status?.canMine ? 'Yes' : 'No'}</p>
        </div>
        <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm">Next Mining</p>
          <p className="text-2xl font-bold mt-2">{status?.nextMiningAt ? new Date(status.nextMiningAt).toLocaleString() : 'Now'}</p>
        </div>
        <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm">Reward Coins</p>
          <p className="text-2xl font-bold mt-2">{status?.rewardCoins ?? '0'}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Mining Content</h2>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {content.length === 0 ? (
          <p className="text-zinc-500">No content available.</p>
        ) : (
          content.map((c) => (
            <div key={c.id} className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6">
              <h3 className="font-bold text-lg">{c.title}</h3>
              <p className="text-zinc-400 text-sm mt-2 mb-4">{c.content?.substring(0, 120)}...</p>
              <p className="text-zinc-500 text-sm mb-4">Reward: {c.rewardCoins}</p>
              <Button onClick={() => handleMine(c.id)} disabled={mining || !status?.canMine} variant="primary" className="rounded-full" size="sm">
                {mining ? 'Mining...' : 'Mine'}
              </Button>
            </div>
          ))
        )}
      </div>

      <h2 className="text-xl font-bold mb-4">History</h2>
      <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl overflow-hidden">
        {history.length === 0 ? (
          <p className="p-6 text-zinc-500">No mining history.</p>
        ) : (
          <ul className="divide-y divide-zinc-800">
            {history.map((h, i) => (
              <li key={i} className="p-4 flex justify-between">
                <span className="text-zinc-300">Reward: {h.rewardCoins}</span>
                <span className="text-zinc-500 text-sm">{h.createdAt ? new Date(h.createdAt).toLocaleDateString() : '-'}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
