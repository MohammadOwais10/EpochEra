'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { listAdminWalletTransactions } from '@/lib/api'
import Card from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Wallet, ArrowRightLeft, AlertCircle, Eye, X, User } from 'lucide-react'

export default function AdminWalletTransactionsPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [total, setTotal] = useState(0)
  const [selectedTx, setSelectedTx] = useState(null)

  const totalPages = Math.ceil(total / limit) || 1

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      router.push('/signin')
      return
    }
    const fetchData = async () => {
      try {
        const result = await listAdminWalletTransactions(`page=${page}&limit=${limit}`)
        setTransactions(result.success ? (result.data?.data || result.data || []) : [])
        setTotal(result.success ? (result.data?.total || 0) : 0)
      } catch (err) {
        setError(err.response?.data?.error?.message || err.message || 'Failed to load transactions')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [page, limit, router])

  const formatValue = (value) => {
    if (value === null || value === undefined) return '-'
    if (typeof value === 'object') return JSON.stringify(value, null, 2)
    return String(value)
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center text-white">
      <div className="relative">
        <div className="absolute inset-0 bg-[#B48811]/20 rounded-full blur-xl animate-pulse"></div>
        <div className="relative w-20 h-20 border-4 border-[#B48811]/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-[#B48811] rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-[#EBD197] rounded-full border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      <div className="text-center mt-6">
        <p className="text-white font-semibold text-lg mb-1">Loading Wallet Transactions</p>
        <p className="text-slate-400 text-sm">Please wait...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center text-white">
      <div className="text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p className="text-slate-400 mb-4">{error}</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4 mb-8"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10">
          <Wallet className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">Wallet Transactions</h1>
          <p className="text-slate-400 text-sm">View all wallet transactions across the platform</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total: {total}</span>
        </div>
      </motion.div>

      {/* Transactions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border-[#B48811]/30 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[1100px]">
              <thead className="bg-slate-800/50 border-b border-slate-700/50">
                <tr>
                  <th className="p-4 text-slate-400 font-medium">User</th>
                  <th className="p-4 text-slate-400 font-medium">Wallet</th>
                  <th className="p-4 text-slate-400 font-medium">Type</th>
                  <th className="p-4 text-slate-400 font-medium">Amount</th>
                  <th className="p-4 text-slate-400 font-medium">Reference</th>
                  <th className="p-4 text-slate-400 font-medium">Description</th>
                  <th className="p-4 text-slate-400 font-medium">Date</th>
                  <th className="p-4 text-slate-400 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-slate-500 text-center">No transactions found.</td>
                  </tr>
                ) : (
                  transactions.map((tx, i) => (
                    <tr key={i} className="border-t border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 min-w-[180px]">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#B48811]/10 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-[#EBD197]" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-white text-sm truncate" title={tx.user?.email}>
                              {tx.user?.email || '-'}
                            </p>
                            {tx.user?.username && (
                              <p className="text-slate-500 text-xs truncate">@{tx.user.username}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-white whitespace-nowrap">{tx.walletType}</td>
                      <td className="p-4 text-slate-300 whitespace-nowrap">{tx.transactionType}</td>
                      <td className="p-4 text-[#EBD197] font-medium whitespace-nowrap">{tx.amount}</td>
                      <td className="p-4 text-slate-300 whitespace-nowrap">
                        {tx.referenceType ? (
                          <span className="text-xs">
                            <span className="text-[#EBD197]">{tx.referenceType}</span>
                            {tx.referenceId && (
                              <span className="text-slate-500 ml-1">• {tx.referenceId.slice(0, 8)}...</span>
                            )}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="p-4 text-slate-300 max-w-[200px] truncate" title={tx.description}>
                        {tx.description || '-'}
                      </td>
                      <td className="p-4 text-slate-300 whitespace-nowrap">{tx.createdAt ? new Date(tx.createdAt).toLocaleString() : '-'}</td>
                      <td className="p-4 whitespace-nowrap">
                        <Button
                          onClick={() => setSelectedTx(tx)}
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              Previous
            </Button>
            <span className="text-slate-400 text-sm">Page {page} of {totalPages}</span>
            <Button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              variant="outline"
              size="sm"
              className="rounded-full"
            >
              Next
            </Button>
          </div>
        )}
      </motion.div>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedTx(null)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-[#B48811]/30 bg-slate-900">
            <div className="p-6 border-b border-slate-700/50 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
              <h2 className="text-xl font-bold text-white">Transaction Details</h2>
              <button
                onClick={() => setSelectedTx(null)}
                className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* User */}
              <div>
                <h3 className="text-sm font-semibold text-[#EBD197] uppercase tracking-wider mb-3">User</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
                  <DetailRow label="Email" value={selectedTx.user?.email} />
                  <DetailRow label="Username" value={selectedTx.user?.username} />
                  <DetailRow label="User ID" value={selectedTx.user?.id} />
                </div>
              </div>

              {/* Transaction */}
              <div>
                <h3 className="text-sm font-semibold text-[#EBD197] uppercase tracking-wider mb-3">Transaction</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
                  <DetailRow label="Transaction ID" value={selectedTx.id} copyable />
                  <DetailRow label="Wallet Type" value={selectedTx.walletType} />
                  <DetailRow label="Transaction Type" value={selectedTx.transactionType} />
                  <DetailRow label="Amount" value={selectedTx.amount} />
                  <DetailRow label="Description" value={selectedTx.description} />
                  <DetailRow label="Created At" value={selectedTx.createdAt ? new Date(selectedTx.createdAt).toLocaleString() : '-'} />
                  <DetailRow label="Idempotency Key" value={selectedTx.idempotencyKey} copyable />
                </div>
              </div>

              {/* Reference */}
              <div>
                <h3 className="text-sm font-semibold text-[#EBD197] uppercase tracking-wider mb-3">Reference</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
                  <DetailRow label="Reference Type" value={selectedTx.referenceType} />
                  <DetailRow label="Reference ID" value={selectedTx.referenceId} copyable />
                </div>
              </div>

              {/* Balances */}
              <div>
                <h3 className="text-sm font-semibold text-[#EBD197] uppercase tracking-wider mb-3">Balance Impact</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
                  <DetailRow label="Balance Before" value={selectedTx.balanceBefore} />
                  <DetailRow label="Balance After" value={selectedTx.balanceAfter} />
                  <DetailRow label="Available Before" value={selectedTx.availableBefore} />
                  <DetailRow label="Available After" value={selectedTx.availableAfter} />
                  <DetailRow label="Locked Before" value={selectedTx.lockedBefore} />
                  <DetailRow label="Locked After" value={selectedTx.lockedAfter} />
                </div>
              </div>

              {/* Metadata */}
              {selectedTx.metadata && (
                <div>
                  <h3 className="text-sm font-semibold text-[#EBD197] uppercase tracking-wider mb-3">Metadata</h3>
                  <pre className="bg-slate-950 rounded-xl p-4 border border-slate-700/30 text-slate-300 text-xs overflow-x-auto">
                    {JSON.stringify(selectedTx.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-700/50 flex justify-end sticky bottom-0 bg-slate-900 z-10">
              <Button
                onClick={() => router.push(`/admin/users/${selectedTx.userId}`)}
                variant="outline"
                size="sm"
                className="rounded-full mr-2"
              >
                View User
              </Button>
              <Button
                onClick={() => setSelectedTx(null)}
                variant="primary"
                size="sm"
                className="rounded-full"
              >
                Close
              </Button>
            </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

function DetailRow({ label, value, copyable }) {
  const display = value === null || value === undefined ? '-' : String(value)
  return (
    <div>
      <p className="text-slate-500 text-xs mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <p className="text-white text-sm break-all font-mono" title={display}>{display}</p>
        {copyable && value && (
          <button
            onClick={() => navigator.clipboard.writeText(String(value))}
            className="text-[#EBD197] hover:text-white text-xs"
          >
            Copy
          </button>
        )}
      </div>
    </div>
  )
}
