'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { getUsdWallet, getWalletWidgetA, getWalletWidgetB, getWalletTransactions } from '@/lib/api'
import { Wallet, Coins, DollarSign, ArrowUp, ArrowDown, History, CircleDollarSign, Box } from 'lucide-react'
import Card from '@/components/ui/Card'

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

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '$0.00'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#B48811]/30 border-t-[#EBD197] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your wallet...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Error Loading Wallet</h2>
          <p className="text-slate-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-xl text-white font-medium hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Professional Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#B48811]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#B48811]/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#B48811]/2 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItaC0ydjJoLTJvLTJoLTJvLTJoLTJ2MmgydjJoMnYtMmgydi0yaDJ2LTJoLTJ2LTJoLTJvLTJoLTJ2MmgydjJoLTJ2LTJoLTJvLTJoLTJ2MmgydjJoMnYtMmgydi0yaDJ2LTJoLTJ6bTAgMmgydjJoLTJ2LTJoLTJ6bTAgMmgydjJoLTJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Professional Wallet Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">My Wallets</h1>
                <p className="text-slate-400 text-sm">Manage your digital assets</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Professional Wallet Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 mb-8"
          >
            {/* USD Wallet Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
              className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-[#B48811]/40 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#B48811]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-black/10 group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-[#EBD197] text-sm font-medium">
                    <ArrowUp className="w-4 h-4" />
                    <span>Active</span>
                  </div>
                </div>
                <p className="text-slate-400 text-sm font-medium mb-1">USD Wallet</p>
                <p className="text-3xl font-bold text-white tracking-tight">{formatCurrency(wallets.usd?.available)}</p>
                <p className="text-slate-500 text-xs mt-2">Total: {formatCurrency(wallets.usd?.total)}</p>
              </div>
            </motion.div>

            {/* Widget A Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
              className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-[#B48811]/40 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#B48811]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-black/10 group-hover:scale-110 transition-transform duration-300">
                    <Box className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-[#EBD197] text-sm font-medium">
                    <ArrowUp className="w-4 h-4" />
                    <span>Active</span>
                  </div>
                </div>
                <p className="text-slate-400 text-sm font-medium mb-1">Widget A</p>
                <p className="text-3xl font-bold text-white tracking-tight">{formatCurrency(wallets.widgetA?.available)}</p>
                <p className="text-slate-500 text-xs mt-2">Total: {formatCurrency(wallets.widgetA?.total)}</p>
              </div>
            </motion.div>

            {/* Widget B Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
              className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-[#B48811]/40 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#B48811]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-black/10 group-hover:scale-110 transition-transform duration-300">
                    <Coins className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-[#EBD197] text-sm font-medium">
                    <ArrowUp className="w-4 h-4" />
                    <span>Active</span>
                  </div>
                </div>
                <p className="text-slate-400 text-sm font-medium mb-1">Widget B</p>
                <p className="text-3xl font-bold text-white tracking-tight">{formatCurrency(wallets.widgetB?.available)}</p>
                <p className="text-slate-500 text-xs mt-2">Total: {formatCurrency(wallets.widgetB?.total)}</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Professional Transactions Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10">
                <History className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Recent Transactions</h2>
                <p className="text-slate-400 text-sm">Your latest wallet activities</p>
              </div>
            </motion.div>

            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-800/50 text-slate-300">
                    <tr>
                      <th className="p-4 font-medium">Wallet</th>
                      <th className="p-4 font-medium">Type</th>
                      <th className="p-4 font-medium">Amount</th>
                      <th className="p-4 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-500">
                          <div className="flex flex-col items-center gap-2">
                            <History className="w-8 h-8 text-slate-600" />
                            <p>No transactions found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      transactions.map((tx, i) => (
                        <tr key={i} className="border-t border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                                <CircleDollarSign className="w-4 h-4 text-white" />
                              </div>
                              <span className="font-medium text-white">{tx.walletType}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              tx.transactionType === 'credit' 
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {tx.transactionType}
                            </span>
                          </td>
                          <td className="p-4 font-semibold text-white">{formatCurrency(tx.amount)}</td>
                          <td className="p-4 text-slate-400">
                            {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
