'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, erc20Abi } from 'viem'
import { listAdminSellRequests, approveSellRequest, processingSellRequest, completeSellRequest, rejectSellRequest, getDepositWallet } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Copy, Check } from 'lucide-react'

export default function AdminSellRequestsPage() {
  const router = useRouter()
  const { open } = useAppKit()
  const { isConnected } = useAppKitAccount()
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
      if (isBusy) return <span className="text-zinc-400 text-sm">Processing...</span>
      if (!isConnected) return <Button onClick={() => open()} variant="primary" size="sm" className="rounded-full">Connect Wallet</Button>
      return <Button onClick={() => handlePay(r)} disabled={!usdtContract} variant="primary" size="sm" className="rounded-full">Pay {r.payoutUsdValue} USDT</Button>
    }
    return <Button onClick={() => handlePay(r)} variant="primary" size="sm" className="rounded-full mr-2">Approve & Pay</Button>
  }

  if (loading) return <div className="p-8 text-white">Loading...</div>

  return (
    <div className="p-8 text-white w-full">
      <h1 className="text-3xl font-bold mb-6">Widget B Sell Requests</h1>
      {error && <p className="text-red-400 mb-4">{error}</p>}
      <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-800 text-zinc-300">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Coins</th>
              <th className="p-4">Payout (USDT)</th>
              <th className="p-4">Network</th>
              <th className="p-4">Address</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-zinc-500">No sell requests found.</td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr key={r.id} className="border-t border-zinc-800">
                  <td className="p-4">
                    <p className="font-medium">{r.user?.firstName ? `${r.user.firstName} ${r.user.lastName || ''}` : r.user?.username || r.user?.email || 'Unknown'}</p>
                    <p className="text-zinc-500 text-xs">{r.user?.email || r.userId}</p>
                  </td>
                  <td className="p-4">{r.coinAmount}</td>
                  <td className="p-4 font-semibold text-emerald-400">{r.payoutUsdValue}</td>
                  <td className="p-4">{r.usdtNetwork}</td>
                  <td className="p-4 max-w-xs">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-mono text-xs">{r.usdtWalletAddress}</span>
                      <button onClick={() => handleCopy(r.usdtWalletAddress, r.id)} className="text-[#EBD197] hover:text-white shrink-0">
                        {copied === r.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </td>
                  <td className="p-4">{r.status}</td>
                  <td className="p-4">
                    {r.status === 'PENDING' && (
                      <PayButton r={r} />
                    )}
                    {r.status === 'APPROVED' && (
                      <Button onClick={() => handleManualAction(r.id, 'processing')} variant="primary" size="sm" className="rounded-full mr-2">Processing</Button>
                    )}
                    {r.status === 'PROCESSING' && (
                      <>
                        <input
                          type="text"
                          placeholder="Payout tx hash"
                          value={action === r.id ? manualTx : ''}
                          onChange={(e) => { setAction(r.id); setManualTx(e.target.value) }}
                          className="px-2 py-1 rounded bg-zinc-950 border border-zinc-700 text-white text-xs mr-2"
                        />
                        <Button onClick={() => handleManualAction(r.id, 'complete')} variant="primary" size="sm" className="rounded-full mr-2">Complete</Button>
                      </>
                    )}
                    {(r.status === 'PENDING' || r.status === 'APPROVED' || r.status === 'PROCESSING') && (
                      <>
                        <input
                          type="text"
                          placeholder="Reason"
                          value={action === r.id ? reason : ''}
                          onChange={(e) => { setAction(r.id); setReason(e.target.value) }}
                          className="px-2 py-1 rounded bg-zinc-950 border border-zinc-700 text-white text-xs mr-2"
                        />
                        <Button onClick={() => handleManualAction(r.id, 'reject')} variant="outline" size="sm" className="rounded-full">Reject</Button>
                      </>
                    )}
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
