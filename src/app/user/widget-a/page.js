'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getWidgetABalance, getWidgetATransactions } from '@/lib/api'

export default function WidgetAPage() {
  const router = useRouter()
  const [balance, setBalance] = useState(null)
  const [transactions, setTransactions] = useState([])
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
        const [b, t] = await Promise.all([getWidgetABalance(), getWidgetATransactions()])
        setBalance(b.success ? b.data : null)
        setTransactions(t.success ? (t.data?.data || t.data || []) : [])
      } catch (err) {
        setError(err.response?.data?.error?.message || err.message || 'Failed to load Widget A')
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
      <h1 className="text-3xl font-bold mb-6">Widget A</h1>
      <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6 mb-8">
        <p className="text-zinc-400 text-sm">Available Balance</p>
        <p className="text-3xl font-bold mt-2">{balance?.availableBalance ?? '0'}</p>
      </div>

      <h2 className="text-xl font-bold mb-4">Transactions</h2>
      <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl overflow-hidden">
        {transactions.length === 0 ? (
          <p className="p-6 text-zinc-500">No transactions found.</p>
        ) : (
          <ul className="divide-y divide-zinc-800">
            {transactions.map((tx, i) => (
              <li key={i} className="p-4 flex justify-between">
                <span className="text-zinc-300">{tx.type} — {tx.amount}</span>
                <span className="text-zinc-500 text-sm">{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : '-'}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
