'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, erc20Abi } from 'viem'
import { getMyMembership, getMembershipHistory, purchaseMembership, verifyDeposit } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Copy, Check } from 'lucide-react'

export default function MembershipPage() {
  const router = useRouter()
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount()
  const { data: txHash, writeContract, isPending: isWriting, isError: isWriteError, error: writeError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash })

  const [membership, setMembership] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [purchaseData, setPurchaseData] = useState(null)
  const [txHashManual, setTxHashManual] = useState('')
  const [senderAddressManual, setSenderAddressManual] = useState('')
  const [copied, setCopied] = useState('')

  const fetchData = async () => {
    try {
      const [m, h] = await Promise.all([getMyMembership(), getMembershipHistory()])
      setMembership(m.success ? m.data : null)
      const allHistory = h.success ? (h.data?.data || h.data || []) : []
      setHistory(allHistory.filter((item) => item.status !== 'PENDING' && item.status !== 'FAILED'))
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to load membership')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      router.push('/signin')
      return
    }
    fetchData()
  }, [router])

  useEffect(() => {
    if (isWriteError && writeError) {
      setError(writeError?.message || 'Transaction failed')
    }
  }, [isWriteError, writeError])

  useEffect(() => {
    if (isConfirmed && txHash && purchaseData && !verifying) {
      handleVerifyAuto(txHash, address)
    }
  }, [isConfirmed, txHash, purchaseData, address, verifying])

  const handleVerifyAuto = async (hash, sender) => {
    setVerifying(true)
    setError('')
    setMsg('')
    try {
      const result = await verifyDeposit({
        paymentId: purchaseData.paymentId,
        transactionHash: hash,
        senderAddress: sender,
      })
      if (!result.success) throw new Error(result.error?.message || 'Verification failed')
      setMsg(result.data.message || 'Deposit verified. Your membership will be activated shortly.')
      setPurchaseData(null)
      await fetchData()
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Verification failed')
    } finally {
      setVerifying(false)
    }
  }

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  const handlePurchase = async () => {
    setPurchasing(true)
    setError('')
    setMsg('')
    try {
      const result = await purchaseMembership({ paymentProvider: 'blockchain' })
      if (!result.success) throw new Error(result.error?.message || 'Purchase failed')
      setPurchaseData(result.data)
      setMsg('Purchase initiated. Send the exact amount, or pay with your connected wallet.')
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Purchase failed')
    } finally {
      setPurchasing(false)
    }
  }

  const handlePay = () => {
    setError('')
    if (!isConnected) {
      open()
      return
    }
    if (!purchaseData?.usdtContract || !purchaseData?.depositWallet) {
      setError('Payment details not loaded')
      return
    }
    writeContract({
      address: purchaseData.usdtContract,
      abi: erc20Abi,
      functionName: 'transfer',
      args: [purchaseData.depositWallet, parseUnits(String(purchaseData.amountUsd), 18)],
    })
  }

  const handleVerifyManual = async (e) => {
    e.preventDefault()
    setVerifying(true)
    setError('')
    setMsg('')
    try {
      const result = await verifyDeposit({
        paymentId: purchaseData.paymentId,
        transactionHash: txHashManual,
        senderAddress: senderAddressManual,
      })
      if (!result.success) throw new Error(result.error?.message || 'Verification failed')
      setMsg(result.data.message || 'Deposit verified. Your membership will be activated shortly.')
      setPurchaseData(null)
      setTxHashManual('')
      setSenderAddressManual('')
      await fetchData()
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Verification failed')
    } finally {
      setVerifying(false)
    }
  }

  if (loading) return <div className="p-8 text-white">Loading...</div>

  return (
    <div className="p-8 text-white max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Membership</h1>
      {error && <p className="text-red-400 mb-4">{error}</p>}
      {msg && <p className="text-green-400 mb-4">{msg}</p>}

      <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Current Membership</h2>
        {membership?.active ? (
          <div>
            <p className="text-emerald-400 font-semibold text-lg">Active</p>
            <p className="text-zinc-300 mt-2">Amount: {membership.active.amountUsd} USD</p>
            {membership.active.createdAt && <p className="text-zinc-500 text-sm">Purchased: {new Date(membership.active.createdAt).toLocaleDateString()}</p>}
          </div>
        ) : (
          <>
            <p className="text-zinc-400 mb-4">No active membership. Purchase the Standard Membership to start.</p>
            {!purchaseData && (
              <Button onClick={handlePurchase} disabled={purchasing} variant="primary" size="lg" className="rounded-full">
                {purchasing ? 'Processing...' : 'Purchase Standard Membership'}
              </Button>
            )}
          </>
        )}
      </div>

      {purchaseData && !membership?.active && (
        <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Complete Your Purchase</h2>
          <p className="text-zinc-400 mb-6">Send <strong>{purchaseData.amountUsd} USD</strong> in USDT to the deposit wallet on <strong>{purchaseData.network?.toUpperCase()}</strong>.</p>

          <div className="space-y-4 mb-6">
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
              <p className="text-zinc-500 text-sm">Deposit Wallet</p>
              <div className="flex items-center justify-between gap-2 mt-1">
                <p className="font-mono text-sm break-all">{purchaseData.depositWallet}</p>
                <button onClick={() => handleCopy(purchaseData.depositWallet, 'wallet')} className="text-[#EBD197] hover:text-white shrink-0">
                  {copied === 'wallet' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
              <p className="text-zinc-500 text-sm">Amount</p>
              <p className="font-mono text-sm mt-1">{purchaseData.amountUsd} USD</p>
            </div>

            <Button onClick={handlePay} disabled={isWriting || isConfirming || verifying} variant="primary" size="lg" className="w-full rounded-full">
              {isWriting ? 'Confirm in wallet...' : isConfirming ? 'Confirming...' : verifying ? 'Verifying...' : isConnected ? `Pay ${purchaseData.amountUsd} USDT` : 'Connect Wallet & Pay'}
            </Button>
          </div>

          <p className="text-zinc-500 text-sm mb-2">Or verify manually:</p>
          <form onSubmit={handleVerifyManual} className="space-y-4">
            <div>
              <label className="block text-sm text-zinc-300 mb-1">Transaction Hash</label>
              <input
                type="text"
                placeholder="0x..."
                value={txHashManual}
                onChange={(e) => setTxHashManual(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-[#B48811] focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-300 mb-1">Your Sender Address</label>
              <input
                type="text"
                placeholder="0x..."
                value={senderAddressManual}
                onChange={(e) => setSenderAddressManual(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-[#B48811] focus:outline-none"
                required
              />
            </div>
            <Button type="submit" disabled={verifying} variant="outline" size="lg" className="w-full rounded-full">
              {verifying ? 'Verifying...' : 'Verify Deposit'}
            </Button>
          </form>
        </div>
      )}

      <h2 className="text-xl font-bold mb-4">History</h2>
      <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl overflow-hidden">
        {history.length === 0 ? (
          <p className="p-6 text-zinc-500">No history found.</p>
        ) : (
          <ul className="divide-y divide-zinc-800">
            {history.map((h, i) => (
              <li key={i} className="p-4 flex justify-between">
                <span className="text-zinc-300">{h.amountUsd} USD — {h.status}</span>
                <span className="text-zinc-500 text-sm">{h.createdAt ? new Date(h.createdAt).toLocaleDateString() : '-'}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
