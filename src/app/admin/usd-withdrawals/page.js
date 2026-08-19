'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, erc20Abi } from 'viem'
import { motion } from 'framer-motion'
import { listAdminUsdWithdrawals, completeAdminUsdWithdrawal, rejectAdminUsdWithdrawal, getAdminDepositWallet } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Download, Copy, Check, X, Clock, CheckCircle, AlertCircle, Wallet, LogOut } from 'lucide-react'

export default function AdminUsdWithdrawalsPage() {
  const router = useRouter()
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount()
  const { disconnect } = useDisconnect()
  const { data: txHash, writeContract, isPending: isWriting, isError: isWriteError, error: writeError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash })

  const [requests, setRequests] = useState([])
  const [usdtContract, setUsdtContract] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [actionId, setActionId] = useState(null)
  const [actionType, setActionType] = useState('')
  const [manualTx, setManualTx] = useState('')
  const [reason, setReason] = useState('')
  const [payingId, setPayingId] = useState(null)
  const [finalizing, setFinalizing] = useState(false)
  const [copied, setCopied] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const q = statusFilter ? `?status=${statusFilter}` : ''
      const [result, deposit] = await Promise.all([
        listAdminUsdWithdrawals(q),
        getAdminDepositWallet(),
      ])
      setRequests(result.success ? (result.data?.data || result.data || []) : [])
      setUsdtContract(deposit.success ? deposit.data?.usdtContract : '')
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to load withdrawals')
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      router.push('/signin')
      return
    }
    loadData()
  }, [router, loadData])

  useEffect(() => {
    if (isWriteError && writeError) {
      setError(writeError?.message || 'Transaction failed')
      setPayingId(null)
    }
  }, [isWriteError, writeError])

  useEffect(() => {
    if (isConfirmed && txHash && payingId && !finalizing) {
      finalizePayment(payingId, txHash)
    }
  }, [isConfirmed, txHash, payingId, finalizing])

  const finalizePayment = async (id, hash) => {
    setFinalizing(true)
    setError('')
    setMsg('')
    try {
      const result = await completeAdminUsdWithdrawal(id, { payoutTxHash: hash })
      if (!result.success) throw new Error(result.error?.message || 'Complete failed')
      setMsg(`Withdrawal completed with tx ${hash.substring(0, 20)}...`)
      setPayingId(null)
      setActionId(null)
      await loadData()
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Completion failed')
    } finally {
      setFinalizing(false)
    }
  }

  const handlePay = (r) => {
    setError('')
    setMsg('')
    setPayingId(r.id)
    if (!isConnected) {
      open()
      return
    }
    if (!usdtContract) {
      setError('USDT contract not loaded')
      return
    }
    if (r.usdtNetwork !== 'BSC') {
      setError('Auto pay is only available for BSC network. Use manual for BEP20.')
      setPayingId(null)
      return
    }
    writeContract({
      address: usdtContract,
      abi: erc20Abi,
      functionName: 'transfer',
      args: [r.usdtWalletAddress, parseUnits(String(r.amount), 18)],
    })
  }

  const handleManualComplete = async (id) => {
    setError('')
    setMsg('')
    if (manualTx.trim().length < 8) {
      setError('Payout tx hash must be at least 8 characters')
      return
    }
    try {
      const result = await completeAdminUsdWithdrawal(id, { payoutTxHash: manualTx })
      if (!result.success) throw new Error(result.error?.message || 'Complete failed')
      setMsg(`Withdrawal completed manually`)
      setActionId(null)
      setManualTx('')
      await loadData()
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Complete failed')
    }
  }

  const handleReject = async (id) => {
    setError('')
    setMsg('')
    if (!reason.trim()) {
      setError('Rejection reason is required')
      return
    }
    try {
      const result = await rejectAdminUsdWithdrawal(id, { rejectionReason: reason })
      if (!result.success) throw new Error(result.error?.message || 'Reject failed')
      setMsg(`Withdrawal rejected`)
      setActionId(null)
      setReason('')
      await loadData()
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Reject failed')
    }
  }

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  const isBusy = isWriting || isConfirming || finalizing

  const PayButton = ({ r }) => {
    if (payingId === r.id) {
      if (isBusy) return <span className="text-slate-400 text-sm">Processing...</span>
      if (!isConnected) return <Button onClick={() => open()} variant="primary" size="sm" className="rounded-full">Connect Wallet</Button>
      return <Button onClick={() => handlePay(r)} disabled={!usdtContract} variant="primary" size="sm" className="rounded-full">Pay {r.amount} USDT</Button>
    }
    if (!isConnected) {
      return <Button onClick={() => handlePay(r)} variant="primary" size="sm" className="rounded-full mr-2">Connect Wallet</Button>
    }
    return <Button onClick={() => handlePay(r)} variant="primary" size="sm" className="rounded-full mr-2">Approve & Pay</Button>
  }

  const statusBadge = (status) => {
    const map = {
      PENDING: { icon: Clock, cls: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
      COMPLETED: { icon: CheckCircle, cls: 'bg-green-500/10 text-green-400 border-green-500/20' },
      REJECTED: { icon: X, cls: 'bg-red-500/10 text-red-400 border-red-500/20' },
    }
    const cfg = map[status] || { icon: AlertCircle, cls: 'bg-slate-700/50 text-slate-400 border-slate-600/50' }
    const Icon = cfg.icon
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 border ${cfg.cls}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#B48811]/30 border-t-[#EBD197] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading USD withdrawals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4 mb-8"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10">
          <Download className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">USD Commission Withdrawals</h1>
          <p className="text-slate-400 text-sm">Process user USDT commission withdrawal requests</p>
        </div>
      </motion.div>

      {/* Wallet connection */}
      <div className="mb-6 flex items-center justify-end gap-3">
        {isConnected ? (
          <>
            <span className="text-slate-400 text-sm">Connected:</span>
            <span className="text-white font-mono text-sm">
              {address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : ''}
            </span>
            <Button onClick={() => disconnect()} variant="outline" size="sm" className="rounded-full text-red-400 border-red-400/30 hover:bg-red-400/10">
              <LogOut className="w-4 h-4 mr-2" /> Disconnect
            </Button>
          </>
        ) : (
          <Button onClick={() => open()} variant="outline" size="sm" className="rounded-full">
            <Wallet className="w-4 h-4 mr-2" /> Connect Wallet
          </Button>
        )}
      </div>

      {/* Filter */}
      <div className="mb-6 flex items-center gap-3">
        <label className="text-slate-400 text-sm">Filter:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-[#B48811]"
        >
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <Button onClick={loadData} variant="outline" size="sm" className="rounded-full">
          Refresh
        </Button>
      </div>

      {msg && (
        <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
          {msg}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* List */}
      {requests.length === 0 ? (
        <Card className="p-8 text-center">
          <Download className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-500">No withdrawal requests found</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((r, i) => (
            <motion.div
              key={r.id || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card className="p-5">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  {/* Left: User + amount */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 rounded-xl flex items-center justify-center">
                        <Download className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">
                          {r.user?.username || r.user?.email || 'User'}
                        </p>
                        <p className="text-slate-500 text-xs font-mono">{r.userId?.substring(0, 18)}...</p>
                      </div>
                      <div className="ml-auto">{statusBadge(r.status)}</div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-slate-500 text-xs">Amount</p>
                        <p className="text-white font-semibold">{r.amount} USDT</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs">Network</p>
                        <p className="text-white font-semibold">{r.usdtNetwork}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs">Requested</p>
                        <p className="text-white">{new Date(r.createdAt).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="mt-3 bg-slate-900/50 border border-slate-700/50 rounded-xl p-3">
                      <p className="text-slate-500 text-xs mb-1">USDT Wallet Address</p>
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-mono text-sm text-white break-all">{r.usdtWalletAddress}</p>
                        <button
                          onClick={() => handleCopy(r.usdtWalletAddress, `addr-${r.id}`)}
                          className="text-[#EBD197] hover:text-white shrink-0"
                        >
                          {copied === `addr-${r.id}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {r.payoutTxHash && (
                      <div className="mt-2 bg-slate-900/50 border border-slate-700/50 rounded-xl p-3">
                        <p className="text-slate-500 text-xs mb-1">Payout Tx Hash</p>
                        <p className="font-mono text-sm text-green-400 break-all">{r.payoutTxHash}</p>
                      </div>
                    )}
                    {r.rejectionReason && (
                      <div className="mt-2 bg-red-500/5 border border-red-500/20 rounded-xl p-3">
                        <p className="text-slate-500 text-xs mb-1">Rejection Reason</p>
                        <p className="text-red-400 text-sm">{r.rejectionReason}</p>
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  {r.status === 'PENDING' && (
                    <div className="md:w-72 space-y-3">
                      {/* Auto pay / manual tabs */}
                      <div className="flex items-center gap-2 mb-2">
                        <PayButton r={r} />
                        <Button
                          onClick={() => { setActionId(actionId === r.id ? null : r.id); setActionType('complete'); setManualTx(''); }}
                          variant={actionId === r.id && actionType === 'complete' ? 'primary' : 'outline'}
                          size="sm"
                          className="rounded-full"
                        >
                          Manual
                        </Button>
                        <Button
                          onClick={() => { setActionId(actionId === r.id && actionType === 'reject' ? null : r.id); setActionType('reject'); setReason(''); }}
                          variant="outline"
                          size="sm"
                          className="rounded-full text-red-400 border-red-400/30 hover:bg-red-400/10"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      {actionId === r.id && actionType === 'complete' && (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={manualTx}
                            onChange={(e) => setManualTx(e.target.value)}
                            placeholder="Payout transaction hash"
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#B48811]"
                          />
                          <Button
                            onClick={() => handleManualComplete(r.id)}
                            variant="primary"
                            size="sm"
                            className="w-full rounded-full"
                          >
                            Confirm Manual
                          </Button>
                        </div>
                      )}

                      {actionId === r.id && actionType === 'reject' && (
                        <div className="space-y-2">
                          <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Rejection reason"
                            rows={2}
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-[#B48811]"
                          />
                          <Button
                            onClick={() => handleReject(r.id)}
                            variant="primary"
                            size="sm"
                            className="w-full rounded-full bg-red-500/80 hover:bg-red-500"
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
