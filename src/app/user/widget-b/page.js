'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, erc20Abi } from 'viem'
import {
  getWidgetBConfig,
  getWidgetBBalance,
  getWidgetBPurchases,
  getWidgetBSellRequests,
  getDepositWallet,
  purchaseWidgetB,
  verifyDeposit,
  createWidgetBSell,
  cancelWidgetBSellRequest,
} from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Copy, Check } from 'lucide-react'

export default function WidgetBPage() {
  const router = useRouter()
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount()
  const { data: txHash, writeContract, isPending: isWriting, isError: isWriteError, error: writeError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash })

  const [config, setConfig] = useState(null)
  const [balance, setBalance] = useState(null)
  const [purchases, setPurchases] = useState([])
  const [sells, setSells] = useState([])
  const [deposit, setDeposit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [buyAmount, setBuyAmount] = useState('')
  const [purchaseData, setPurchaseData] = useState(null)
  const [manualTx, setManualTx] = useState('')
  const [manualSender, setManualSender] = useState('')
  const [sellAmount, setSellAmount] = useState('')
  const [sellNetwork, setSellNetwork] = useState('TRC20')
  const [sellAddress, setSellAddress] = useState('')
  const [copied, setCopied] = useState('')

  const fetchData = async () => {
    try {
      const [cfg, b, p, s, d] = await Promise.all([
        getWidgetBConfig(),
        getWidgetBBalance(),
        getWidgetBPurchases(),
        getWidgetBSellRequests(),
        getDepositWallet(),
      ])
      setConfig(cfg.success ? cfg.data : null)
      setBalance(b.success ? b.data : null)
      setPurchases(p.success ? (p.data?.data || p.data || []) : [])
      setSells(s.success ? (s.data?.data || s.data || []) : [])
      setDeposit(d.success ? d.data : null)
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to load Widget B')
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
    if (isConfirmed && txHash && pendingPayment && !verifying) {
      handleVerifyAuto(txHash, address)
    }
  }, [isConfirmed, txHash, address, verifying])

  const pendingPayment = useMemo(() => {
    if (purchaseData) return purchaseData
    const p = purchases.find((x) => x.status === 'PENDING' && x.paymentId)
    if (p && deposit?.address) {
      return {
        paymentId: p.paymentId,
        amountUsd: p.usdAmount ?? p.amountUsd,
        coinAmount: p.coinAmount,
        depositWallet: deposit.address,
        usdtContract: deposit.usdtContract,
        network: deposit.network,
      }
    }
    return null
  }, [purchaseData, purchases, deposit])

  const visiblePurchases = useMemo(() => purchases.filter((p) => p.status !== 'PENDING'), [purchases])

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  const handleBuy = async () => {
    setProcessing(true)
    setError('')
    setMsg('')
    try {
      const result = await purchaseWidgetB({ usdAmount: buyAmount, paymentProvider: 'blockchain' })
      if (!result.success) throw new Error(result.error?.message || 'Purchase failed')
      setPurchaseData(result.data)
      setMsg(`Purchase initiated for ${result.data.coinAmount || ''} coins. Pay with your wallet, or verify manually.`)
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Purchase failed')
    } finally {
      setProcessing(false)
    }
  }

  const handlePay = () => {
    setError('')
    if (!isConnected) {
      open()
      return
    }
    if (!pendingPayment?.usdtContract || !pendingPayment?.depositWallet) {
      setError('Payment details not loaded')
      return
    }
    const amount = pendingPayment.amountUsd ?? pendingPayment.usdAmount
    if (!amount) {
      setError('Payment amount not found')
      return
    }
    writeContract({
      address: pendingPayment.usdtContract,
      abi: erc20Abi,
      functionName: 'transfer',
      args: [pendingPayment.depositWallet, parseUnits(String(amount), 18)],
    })
  }

  const handleVerifyAuto = async (hash, sender) => {
    if (!pendingPayment) return
    setVerifying(true)
    setError('')
    setMsg('')
    try {
      const result = await verifyDeposit({
        paymentId: pendingPayment.paymentId,
        transactionHash: hash,
        senderAddress: sender,
      })
      if (!result.success) throw new Error(result.error?.message || 'Verification failed')
      setMsg(result.data.message || 'Deposit verified. Your coins will be credited shortly.')
      setPurchaseData(null)
      setBuyAmount('')
      await fetchData()
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Verification failed')
    } finally {
      setVerifying(false)
    }
  }

  const handleVerifyManual = async (e) => {
    e.preventDefault()
    if (!pendingPayment) return
    setVerifying(true)
    setError('')
    setMsg('')
    try {
      const result = await verifyDeposit({
        paymentId: pendingPayment.paymentId,
        transactionHash: manualTx,
        senderAddress: manualSender,
      })
      if (!result.success) throw new Error(result.error?.message || 'Verification failed')
      setMsg(result.data.message || 'Deposit verified. Your coins will be credited shortly.')
      setPurchaseData(null)
      setManualTx('')
      setManualSender('')
      setBuyAmount('')
      await fetchData()
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Verification failed')
    } finally {
      setVerifying(false)
    }
  }

  const handleSell = async () => {
    setProcessing(true)
    setError('')
    setMsg('')
    try {
      const result = await createWidgetBSell({
        coinAmount: sellAmount,
        usdtNetwork: sellNetwork,
        usdtWalletAddress: sellAddress,
      })
      if (!result.success) throw new Error(result.error?.message || 'Sell failed')
      setMsg(result.data.message || 'Sell request created')
      await fetchData()
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Sell failed')
    } finally {
      setProcessing(false)
    }
  }

  const handleCancel = async (id) => {
    try {
      await cancelWidgetBSellRequest(id)
      setSells((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'CANCELLED' } : s)))
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Cancel failed')
    }
  }

  if (loading) return <div className="p-8 text-white">Loading...</div>

  return (
    <div className="p-8 text-white w-full">
      <h1 className="text-3xl font-bold mb-6">Widget B</h1>
      {error && <p className="text-red-400 mb-4">{error}</p>}
      {msg && <p className="text-green-400 mb-4">{msg}</p>}

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm">Available Balance</p>
          <p className="text-2xl font-bold mt-2">{balance?.available ?? '0'}</p>
        </div>
        <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm">Coins per USD</p>
          <p className="text-2xl font-bold mt-2">{config?.coinsPerUsd ?? '0'}</p>
        </div>
        <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6">
          <p className="text-zinc-400 text-sm">Sell %</p>
          <p className="text-2xl font-bold mt-2">{config?.sellPercent ?? '0'}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Buy Coins</h2>
          {!pendingPayment ? (
            <>
              <input
                type="text"
                placeholder="USD amount"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white mb-4 focus:border-[#B48811] focus:outline-none"
              />
              <Button onClick={handleBuy} disabled={processing} variant="primary" className="w-full rounded-full">
                {processing ? 'Processing...' : 'Buy'}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-zinc-400 text-sm">Send <strong>{pendingPayment.amountUsd} USD</strong> in USDT to the deposit wallet on <strong>{(pendingPayment.network || 'BSC-TESTNET').toUpperCase()}</strong>.</p>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                <p className="text-zinc-500 text-sm">Deposit Wallet</p>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <p className="font-mono text-sm break-all">{pendingPayment.depositWallet}</p>
                  <button onClick={() => handleCopy(pendingPayment.depositWallet, 'wallet')} className="text-[#EBD197] hover:text-white shrink-0">
                    {copied === 'wallet' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                <p className="text-zinc-500 text-sm">Coins</p>
                <p className="font-mono text-sm mt-1">{pendingPayment.coinAmount}</p>
              </div>
              <Button onClick={handlePay} disabled={isWriting || isConfirming || verifying} variant="primary" className="w-full rounded-full">
                {isWriting ? 'Confirm in wallet...' : isConfirming ? 'Confirming...' : verifying ? 'Verifying...' : isConnected ? `Pay ${pendingPayment.amountUsd} USDT` : 'Connect Wallet & Pay'}
              </Button>

              <p className="text-zinc-500 text-sm mt-2">Or verify manually:</p>
              <form onSubmit={handleVerifyManual} className="space-y-3">
                <input
                  type="text"
                  placeholder="Transaction hash"
                  value={manualTx}
                  onChange={(e) => setManualTx(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-[#B48811] focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Your sender address"
                  value={manualSender}
                  onChange={(e) => setManualSender(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-[#B48811] focus:outline-none"
                  required
                />
                <Button type="submit" disabled={verifying} variant="outline" className="w-full rounded-full">
                  {verifying ? 'Verifying...' : 'Verify Deposit'}
                </Button>
              </form>
            </div>
          )}
        </div>

        <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Sell Coins</h2>
          <input
            type="text"
            placeholder="Coin amount"
            value={sellAmount}
            onChange={(e) => setSellAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white mb-4 focus:border-[#B48811] focus:outline-none"
          />
          <input
            type="text"
            placeholder="USDT Network (TRC20 / BSC)"
            value={sellNetwork}
            onChange={(e) => setSellNetwork(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white mb-4 focus:border-[#B48811] focus:outline-none"
          />
          <input
            type="text"
            placeholder="USDT wallet address"
            value={sellAddress}
            onChange={(e) => setSellAddress(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white mb-4 focus:border-[#B48811] focus:outline-none"
          />
          <Button onClick={handleSell} disabled={processing} variant="outline" className="w-full rounded-full">
            {processing ? 'Processing...' : 'Sell'}
          </Button>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Purchases</h2>
      <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl overflow-hidden mb-8">
        {visiblePurchases.length === 0 ? (
          <p className="p-6 text-zinc-500">No confirmed purchases found.</p>
        ) : (
          <ul className="divide-y divide-zinc-800">
            {visiblePurchases.map((p, i) => (
              <li key={i} className="p-4 flex justify-between">
                <span className="text-zinc-300">{p.coinAmount} coins</span>
                <span className="text-zinc-500 text-sm">{p.status} — {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-'}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <h2 className="text-xl font-bold mb-4">Sell Requests</h2>
      <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl overflow-hidden">
        {sells.length === 0 ? (
          <p className="p-6 text-zinc-500">No sell requests found.</p>
        ) : (
          <ul className="divide-y divide-zinc-800">
            {sells.map((s) => (
              <li key={s.id} className="p-4 flex justify-between items-center">
                <span className="text-zinc-300">{s.coinAmount} coins — {s.status}</span>
                {s.status === 'PENDING' && (
                  <Button onClick={() => handleCancel(s.id)} variant="outline" size="sm" className="rounded-full">Cancel</Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
