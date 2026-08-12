'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { listAdminWalletTransactions } from '@/lib/api'

export default function AdminWalletTransactionsPage() {
  const router = useRouter()
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
        const result = await listAdminWalletTransactions()
        setTransactions(result.success ? (result.data?.data || result.data || []) : [])
      } catch (err) {
        setError(err.response?.data?.error?.message || err.message || 'Failed to load transactions')
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
      <h1 className="text-3xl font-bold mb-6">Wallet Transactions</h1>
      <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-800 text-zinc-300">
            <tr>
              <th className="p-4">Wallet</th>
              <th className="p-4">Type</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-zinc-500">No transactions found.</td>
              </tr>
            ) : (
              transactions.map((tx, i) => (
                <tr key={i} className="border-t border-zinc-800">
                  <td className="p-4">{tx.walletType}</td>
                  <td className="p-4">{tx.transactionType}</td>
                  <td className="p-4">{tx.amount}</td>
                  <td className="p-4">{tx.status}</td>
                  <td className="p-4">{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
