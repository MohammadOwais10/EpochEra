'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { listAdminBlockchainTransactions } from '@/lib/api'
import { blockExplorer } from '@/config'
import Card from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Link2, ArrowRightLeft, AlertCircle, Eye, X, User, ExternalLink } from 'lucide-react'

export default function AdminBlockchainTransactionsPage() {
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
        const result = await listAdminBlockchainTransactions(`page=${page}&limit=${limit}`)
        setTransactions(result.success ? (result.data?.data || result.data || []) : [])
        setTotal(result.success ? (result.data?.total || 0) : 0)
      } catch (err) {
        setError(err.response?.data?.error?.message || err.message || 'Failed to load blockchain transactions')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [page, limit, router])

  const handleCopy = (text) => {
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
        <p className="text-white font-semibold text-lg mb-1">Loading Blockchain Transactions</p>
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
          <Link2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">Blockchain Transactions</h1>
          <p className="text-slate-400 text-sm">All on-chain membership, coin purchases and withdrawals</p>
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
            <table className="w-full text-left text-sm min-w-[1000px]">
              <thead className="bg-slate-800/50 border-b border-slate-700/50">
                <tr>
                  <th className="p-4 text-slate-400 font-medium">Type</th>
                  <th className="p-4 text-slate-400 font-medium">User</th>
                  <th className="p-4 text-slate-400 font-medium">Amount</th>
                  <th className="p-4 text-slate-400 font-medium">Transaction Hash</th>
                  <th className="p-4 text-slate-400 font-medium">Network</th>
                  <th className="p-4 text-slate-400 font-medium">Status</th>
                  <th className="p-4 text-slate-400 font-medium">Date</th>
                  <th className="p-4 text-slate-400 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-slate-500 text-center">No blockchain transactions found.</td>
                  </tr>
                ) : (
                  transactions.map((tx, i) => (
                    <tr key={i} className="border-t border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 text-white whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tx.kind?.includes('Membership')
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : tx.kind?.includes('Withdrawal')
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : 'bg-[#EBD197]/10 text-[#EBD197] border border-[#B48811]/20'
                        }`}>
                          {tx.kind}
                        </span>
                      </td>
                      <td className="p-4 min-w-[180px]">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#B48811]/10 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-[#EBD197]" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-white text-sm truncate" title={tx.user?.email}>{tx.user?.email || '-'}</p>
                            {tx.user?.username && <p className="text-slate-500 text-xs truncate">@{tx.user.username}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-[#EBD197] font-medium whitespace-nowrap">
                        {tx.amount} {tx.currency}
                        {tx.coinAmount && <span className="block text-slate-500 text-xs font-normal">{tx.coinAmount} coins</span>}
                      </td>
                      <td className="p-4 text-slate-300 font-mono whitespace-nowrap">
                        {tx.transactionHash ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs">{tx.transactionHash.slice(0, 14)}...{tx.transactionHash.slice(-8)}</span>
                            <button
                              onClick={() => handleCopy(tx.transactionHash)}
                              className="text-[#EBD197] hover:text-white text-xs"
                            >
                              Copy
                            </button>
                          </div>
                        ) : '-'}
                      </td>
                      <td className="p-4 text-slate-300 whitespace-nowrap">{tx.network ? tx.network.toUpperCase() : '-'}</td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tx.status === 'PAID' || tx.status === 'COMPLETED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : tx.status === 'PENDING'
                            ? 'bg-[#EBD197]/10 text-[#EBD197] border border-[#B48811]/20'
                            : 'bg-slate-700/50 text-slate-300 border-slate-600/30'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300 whitespace-nowrap">
                        {tx.verifiedAt || tx.completedAt || tx.createdAt
                          ? new Date(tx.verifiedAt || tx.completedAt || tx.createdAt).toLocaleString()
                          : '-'}
                      </td>
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

      {/* Details Modal */}
      {selectedTx && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={() => setSelectedTx(null)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto border-[#B48811]/30 bg-slate-900">
              <div className="p-6 border-b border-slate-700/50 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
                <h2 className="text-xl font-bold text-white">Blockchain Transaction Details</h2>
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
                    <DetailRow label="Type" value={selectedTx.kind} />
                    <DetailRow label="Amount" value={`${selectedTx.amount} ${selectedTx.currency}`} />
                    {selectedTx.coinAmount && <DetailRow label="Coin Amount" value={selectedTx.coinAmount} />}
                    {selectedTx.packageName && <DetailRow label="Package" value={selectedTx.packageName} />}
                    <DetailRow label="Network" value={selectedTx.network ? selectedTx.network.toUpperCase() : '-'} />
                    <DetailRow label="Block Number" value={selectedTx.blockNumber} />
                    <DetailRow label="Confirmations" value={selectedTx.confirmations} />
                    <DetailRow label="Status" value={selectedTx.status} />
                    <DetailRow label="Reference Type" value={selectedTx.referenceType} />
                    <DetailRow label="Reference ID" value={selectedTx.referenceId} copyable />
                  </div>
                </div>

                {/* Blockchain Hash */}
                <div>
                  <h3 className="text-sm font-semibold text-[#EBD197] uppercase tracking-wider mb-3">On-Chain Hash</h3>
                  <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30 space-y-4">
                    {selectedTx.transactionHash ? (
                      <>
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-mono text-sm text-white break-all">{selectedTx.transactionHash}</p>
                          <div className="flex gap-2 shrink-0">
                            <button
                              onClick={() => handleCopy(selectedTx.transactionHash)}
                              className="text-[#EBD197] hover:text-white text-xs"
                            >
                              Copy
                            </button>
                            <a
                              href={`${blockExplorer}/tx/${selectedTx.transactionHash}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#EBD197] hover:text-white text-xs flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" /> View
                            </a>
                          </div>
                        </div>
                        <DetailRow label="From / Sender" value={selectedTx.senderAddress} />
                        <DetailRow label="To / Receiver" value={selectedTx.receiverAddress || selectedTx.toAddress} />
                        <DetailRow label="Token Contract" value={selectedTx.tokenContract} copyable />
                      </>
                    ) : (
                      <p className="text-slate-500">No on-chain hash available.</p>
                    )}
                  </div>
                </div>

                {/* Timestamps */}
                <div>
                  <h3 className="text-sm font-semibold text-[#EBD197] uppercase tracking-wider mb-3">Timestamps</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
                    <DetailRow label="Created At" value={selectedTx.createdAt ? new Date(selectedTx.createdAt).toLocaleString() : '-'} />
                    <DetailRow label="Verified At" value={selectedTx.verifiedAt ? new Date(selectedTx.verifiedAt).toLocaleString() : '-'} />
                    <DetailRow label="Completed At" value={selectedTx.completedAt ? new Date(selectedTx.completedAt).toLocaleString() : '-'} />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-700/50 flex justify-end sticky bottom-0 bg-slate-900 z-10">
                <Button
                  onClick={() => router.push(`/admin/users/${selectedTx.user?.id}`)}
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
