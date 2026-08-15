'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, erc20Abi } from 'viem'
import { listAdminSellRequests, approveSellRequest, processingSellRequest, completeSellRequest, rejectSellRequest, getDepositWallet } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Copy, Check, Repeat, Wallet, LogOut } from 'lucide-react'

export default function AdminSellRequestsPage() {
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
  const [action, setAction] = useState('')
  const [manualTx, setManualTx] = useState('')
  const [reason, setReason] = useState('')
  const [payingId, setPayingId] = useState(null)
  const [finalizing, setFinalizing] = useState(false)
  const [copied, setCopied] = useState('')

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      router.push('/signin')
      return
    }
    const fetchData = async () => {
      try {
        const [result, deposit] = await Promise.all([listAdminSellRequests(), getDepositWallet()])
        setRequests(result.success ? (result.data?.data || result.data || []) : [])
        setUsdtContract(deposit.success ? deposit.data?.usdtContract : '')
      } catch (err) {
        setError(err.response?.data?.error?.message || err.message || 'Failed to load sell requests')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [router])

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
    try {
      let result = await approveSellRequest(id)
      if (!result.success) throw new Error(result.error?.message || 'Approve failed')
      result = await processingSellRequest(id)
      if (!result.success) throw new Error(result.error?.message || 'Processing failed')
      result = await completeSellRequest(id, { payoutTxHash: hash })
      if (!result.success) throw new Error(result.error?.message || 'Complete failed')
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'COMPLETED', payoutTxHash: hash } : r)))
      setPayingId(null)
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Payment finalization failed')
    } finally {
      setFinalizing(false)
    }
  }

  const handlePay = (r) => {
    setError('')
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
      setError('Auto pay is only available for BSC network. Use manual for TRC20.')
      setPayingId(null)
      return
    }
    writeContract({
      address: usdtContract,
      abi: erc20Abi,
      functionName: 'transfer',
      args: [r.usdtWalletAddress, parseUnits(String(r.payoutUsdValue), 18)],
    })
  }

  const handleManualAction = async (id, type) => {
    setError('')
    if (type === 'complete' && manualTx.trim().length < 8) {
      setError('Payout tx hash must be at least 8 characters')
      return
    }
    if (type === 'reject' && !reason.trim()) {
      setError('Rejection reason is required')
      return
    }
    try {
      let result
      if (type === 'approve') result = await approveSellRequest(id)
      else if (type === 'processing') result = await processingSellRequest(id)
      else if (type === 'complete') result = await completeSellRequest(id, { payoutTxHash: manualTx })
      else if (type === 'reject') result = await rejectSellRequest(id, { rejectionReason: reason })
      if (result.success) {
        setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: type === 'complete' ? 'COMPLETED' : type === 'reject' ? 'REJECTED' : type.toUpperCase() } : r)))
        setAction('')
        setManualTx('')
        setReason('')
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Action failed')
    }
  }

  const isBusy = isWriting || isConfirming || finalizing

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  const PayButton = ({ r }) => {
    if (payingId === r.id) {
      if (isBusy) return <span className="text-slate-400 text-sm">Processing...</span>
      if (!isConnected) return <Button onClick={() => open()} variant="primary" size="sm" className="rounded-full">Connect Wallet</Button>
      return <Button onClick={() => handlePay(r)} disabled={!usdtContract} variant="primary" size="sm" className="rounded-full">Pay {r.payoutUsdValue} USDT</Button>
    }
    if (!isConnected) {
      return <Button onClick={() => handlePay(r)} variant="primary" size="sm" className="rounded-full mr-2">Connect Wallet</Button>
    }
    return <Button onClick={() => handlePay(r)} variant="primary" size="sm" className="rounded-full mr-2">Approve & Pay</Button>
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
        <p className="text-white font-semibold text-lg mb-1">Loading Sell Requests</p>
        <p className="text-slate-400 text-sm">Please wait...</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10">
          <Repeat className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">Sell Requests</h1>
          <p className="text-slate-400 text-sm">Manage widget B sell requests and payouts</p>
        </div>
      </div>

      {/* Wallet Connection Status */}
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

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
          {error}
        </div>
      )}

      <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-800/50 border-b border-slate-700/50">
            <tr>
              <th className="p-4 text-slate-400 font-medium">User</th>
              <th className="p-4 text-slate-400 font-medium">Coins</th>
              <th className="p-4 text-slate-400 font-medium">Payout (USDT)</th>
              <th className="p-4 text-slate-400 font-medium">Network</th>
              <th className="p-4 text-slate-400 font-medium">Address</th>
              <th className="p-4 text-slate-400 font-medium">Status</th>
              <th className="p-4 text-slate-400 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-slate-500 text-center">No sell requests found.</td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr key={r.id} className="border-t border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">
                    <p className="font-medium text-white">{r.user?.firstName ? `${r.user.firstName} ${r.user.lastName || ''}` : r.user?.username || r.user?.email || 'Unknown'}</p>
                    <p className="text-slate-500 text-xs">{r.user?.email || r.userId}</p>
                  </td>
                  <td className="p-4 text-slate-300">{r.coinAmount}</td>
                  <td className="p-4 font-semibold text-[#EBD197]">{r.payoutUsdValue}</td>
                  <td className="p-4 text-slate-300">{r.usdtNetwork}</td>
                  <td className="p-4 max-w-xs">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-mono text-xs text-slate-400">{r.usdtWalletAddress}</span>
                      <button onClick={() => handleCopy(r.usdtWalletAddress, r.id)} className="text-[#EBD197] hover:text-white shrink-0">
                        {copied === r.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      r.status === 'PENDING' ? 'bg-[#EBD197]/10 text-[#EBD197] border-[#B48811]/20' :
                      r.status === 'APPROVED' ? 'bg-[#B48811]/10 text-[#B48811] border-[#B48811]/20' :
                      r.status === 'PROCESSING' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      r.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      {r.status === 'PENDING' && (
                        <>
                          <PayButton r={r} />
                          <input
                            type="text"
                            placeholder="Reason"
                            value={action === r.id ? reason : ''}
                            onChange={(e) => { setAction(r.id); setReason(e.target.value) }}
                            className="px-2 py-1 rounded bg-slate-800/50 border border-slate-700/50 text-white text-xs focus:outline-none focus:border-[#B48811]/50"
                          />
                          <Button onClick={() => handleManualAction(r.id, 'reject')} variant="outline" size="sm" className="rounded-full hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400">Reject</Button>
                        </>
                      )}
                      {r.status === 'APPROVED' && (
                        <>
                          <Button onClick={() => handleManualAction(r.id, 'processing')} variant="primary" size="sm" className="rounded-full bg-gradient-to-r from-[#EBD197] to-[#B48811] text-slate-950 border-0">Processing</Button>
                          <input
                            type="text"
                            placeholder="Reason"
                            value={action === r.id ? reason : ''}
                            onChange={(e) => { setAction(r.id); setReason(e.target.value) }}
                            className="px-2 py-1 rounded bg-slate-800/50 border border-slate-700/50 text-white text-xs focus:outline-none focus:border-[#B48811]/50"
                          />
                          <Button onClick={() => handleManualAction(r.id, 'reject')} variant="outline" size="sm" className="rounded-full hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400">Reject</Button>
                        </>
                      )}
                      {r.status === 'PROCESSING' && (
                        <>
                          <input
                            type="text"
                            placeholder="Payout tx hash"
                            value={action === r.id ? manualTx : ''}
                            onChange={(e) => { setAction(r.id); setManualTx(e.target.value) }}
                            className="px-2 py-1 rounded bg-slate-800/50 border border-slate-700/50 text-white text-xs focus:outline-none focus:border-[#B48811]/50"
                          />
                          <Button onClick={() => handleManualAction(r.id, 'complete')} variant="primary" size="sm" className="rounded-full bg-gradient-to-r from-[#EBD197] to-[#B48811] text-slate-950 border-0">Complete</Button>
                          <input
                            type="text"
                            placeholder="Reason"
                            value={action === r.id ? reason : ''}
                            onChange={(e) => { setAction(r.id); setReason(e.target.value) }}
                            className="px-2 py-1 rounded bg-slate-800/50 border border-slate-700/50 text-white text-xs focus:outline-none focus:border-[#B48811]/50"
                          />
                          <Button onClick={() => handleManualAction(r.id, 'reject')} variant="outline" size="sm" className="rounded-full hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400">Reject</Button>
                        </>
                      )}
                      {(r.status === 'COMPLETED' || r.status === 'REJECTED') && (
                        <span className="text-slate-500 text-sm">No actions</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}