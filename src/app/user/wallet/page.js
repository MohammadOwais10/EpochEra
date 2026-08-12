'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUsdWallet, getWalletWidgetA, getWalletWidgetB, getWalletTransactions } from '@/lib/api'

export default function WalletPage() {
  const router = useRouter()
  const [wallets, setWallets] = useState({ usd: null, widgetA: null, widgetB: null })
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
        const [usd, a, b, tx] = await Promise.all([
          getUsdWallet(),
          getWalletWidgetA(),
          getWalletWidgetB(),
          getWalletTransactions(),
        ])
        setWallets({
          usd: usd.success ? usd.data : null,
          widgetA: a.success ? a.data : null,
          widgetB: b.success ? b.data : null,
        })
        setTransactions(tx.success ? (tx.data?.data || tx.data || []) : [])
      } catch (err) {
        setError(err.response?.data?.error?.message || err.message || 'Failed to load wallet')
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
      <h1 className="text-3xl font-bold mb-6">My Wallets</h1>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm">USD Wallet</p>
          <p className="text-2xl font-bold mt-2">{wallets.usd?.available ?? '0'}</p>
          <p className="text-zinc-500 text-xs mt-1">Total: {wallets.usd?.total ?? '0'}</p>
        </div>
        <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm">Widget A</p>
          <p className="text-2xl font-bold mt-2">{wallets.widgetA?.available ?? '0'}</p>
          <p className="text-zinc-500 text-xs mt-1">Total: {wallets.widgetA?.total ?? '0'}</p>
        </div>
        <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm">Widget B</p>
          <p className="text-2xl font-bold mt-2">{wallets.widgetB?.available ?? '0'}</p>
          <p className="text-zinc-500 text-xs mt-1">Total: {wallets.widgetB?.total ?? '0'}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
      <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-800 text-zinc-300">
            <tr>
              <th className="p-4">Wallet</th>
              <th className="p-4">Type</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-4 text-zinc-500">No transactions found.</td>
              </tr>
            ) : (
              transactions.map((tx, i) => (
                <tr key={i} className="border-t border-zinc-800">
                  <td className="p-4">{tx.walletType}</td>
                  <td className="p-4">{tx.transactionType}</td>
                  <td className="p-4">{tx.amount}</td>
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
