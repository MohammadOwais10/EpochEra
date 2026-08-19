'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react'
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
import { Copy, Check, Coins, Wallet, ArrowUp, ArrowDown, History, X, Shield, Send, DollarSign, Package, Clock, AlertCircle, Percent, TrendingUp, Minus, Plus, LogOut } from 'lucide-react'
import Card from '@/components/ui/Card'

export default function WidgetBPage() {
  const router = useRouter()
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount()
  const { disconnect } = useDisconnect()
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
  const [sellNetwork, setSellNetwork] = useState('BSC')
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

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-[#B48811]/30 border-t-[#EBD197] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm sm:text-base">Loading Widget B...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Professional Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-[#B48811]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-[#B48811]/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[800px] sm:h-[800px] bg-[#B48811]/2 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItaC0ydjJoLTJvLTJoLTJvLTJoLTJ2MmgydjJoMnYtMmgydi0yaDJ2LTJoLTJ2LTJoLTJvLTJoLTJ2MmgydjJoLTJ2LTJoLTJvLTJoLTJ2MmgydjJoMnYtMmgydi0yaDJ2LTJoLTJ6bTAgMmgydjJoLTJ2LTJoLTJ6bTAgMmgydjJoLTJ2LTJoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      </div>

      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Professional Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 sm:mb-8"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10">
                  <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-white">Widget B</h1>
                  <p className="text-slate-400 text-xs sm:text-sm">Trade coins with Widget B</p>
                </div>
              </div>
              {/* Wallet Connection Status */}
              <div className="flex items-center justify-end gap-2 sm:gap-3">
                {isConnected ? (
                  <>
                    <span className="text-slate-400 text-xs sm:text-sm hidden sm:inline">Connected:</span>
                    <span className="text-white font-mono text-xs sm:text-sm">
                      {address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : ''}
                    </span>
                    <Button onClick={() => disconnect()} variant="outline" size="sm" className="rounded-full text-red-400 border-red-400/30 hover:bg-red-400/10 text-xs sm:text-sm px-3 sm:px-4 py-2">
                      <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> <span className="hidden sm:inline">Disconnect</span>
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => open()} variant="outline" size="sm" className="rounded-full text-xs sm:text-sm px-3 sm:px-4 py-2">
                    <Wallet className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> Connect Wallet
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Error/Success Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 sm:mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          {msg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 sm:mb-6 bg-green-500/10 border border-green-500/20 rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3"
            >
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 shrink-0" />
              <p className="text-green-400 text-sm">{msg}</p>
            </motion.div>
          )}

          {/* Balance Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
              className="group relative bg-linear-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 sm:p-6 hover:border-[#B48811]/40 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-[#B48811]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-black/10 group-hover:scale-110 transition-transform duration-300">
                    <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-[#EBD197] text-xs sm:text-sm font-medium">
                    <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Balance</span>
                  </div>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm font-medium mb-1">Available Balance</p>
                <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{balance?.available ?? '0'}</p>
                <p className="text-slate-500 text-xs mt-2">Your Widget B coins</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
              className="group relative bg-linear-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 sm:p-6 hover:border-[#B48811]/40 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-[#B48811]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-black/10 group-hover:scale-110 transition-transform duration-300">
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-[#EBD197] text-xs sm:text-sm font-medium">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Rate</span>
                  </div>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm font-medium mb-1">Coins per USDT</p>
                <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{config?.coinsPerUsd ?? '0'}</p>
                <p className="text-slate-500 text-xs mt-2">Exchange rate</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
              className="group relative bg-linear-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 sm:p-6 hover:border-[#B48811]/40 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-[#B48811]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-black/10 group-hover:scale-110 transition-transform duration-300">
                    <Percent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-[#EBD197] text-xs sm:text-sm font-medium">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Sell</span>
                  </div>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm font-medium mb-1">Sell Percentage</p>
                <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{config?.sellPercent ?? '0'}%</p>
                <p className="text-slate-500 text-xs mt-2">Sell back rate</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Buy/Sell Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8"
          >
            {/* Buy Card */}
            <Card className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Buy Coins</h2>
                  <p className="text-slate-400 text-xs sm:text-sm">Purchase Widget B coins</p>
                </div>
              </div>
              {/* Calculator - always visible */}
              <div className="mb-4 p-3 sm:p-4 rounded-xl bg-linear-to-br from-[#B48811]/10 to-transparent border border-[#B48811]/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-xs sm:text-sm">Rate:</span>
                  <span className="text-slate-300 text-xs sm:text-sm">1 USDT = {config?.coinsPerUsd ?? 0} coins</span>
                </div>
                {buyAmount && parseFloat(buyAmount) > 0 ? (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-xs sm:text-sm">You pay:</span>
                      <span className="text-white font-bold text-sm sm:text-base">${parseFloat(buyAmount).toFixed(2)} USDT</span>
                    </div>
                    <div className="border-t border-slate-700/50 pt-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[#EBD197] text-xs sm:text-sm font-medium">You receive:</span>
                        <span className="text-[#EBD197] font-bold text-base sm:text-lg flex items-center gap-1">
                          <Coins className="w-3 h-3 sm:w-4 sm:h-4" />
                          {(parseFloat(buyAmount) * parseFloat(config?.coinsPerUsd ?? 0)).toLocaleString(undefined, { maximumFractionDigits: 8 })}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-slate-500 text-xs mt-1">Enter USDT amount below to see how many coins you get</p>
                )}
              </div>

              {!pendingPayment ? (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={() => setBuyAmount(String(Math.max(100, (parseFloat(buyAmount) || 100) - 1)))}
                      className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-slate-800/50 border border-slate-700/50 text-[#EBD197] hover:bg-slate-700/50 hover:border-[#B48811]/50 transition-all flex items-center justify-center"
                    >
                      <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <input
                      type="number"
                      min="100"
                      step="1"
                      placeholder="Min 100 USDT"
                      value={buyAmount}
                      onChange={(e) => {
                        const val = e.target.value
                        setBuyAmount(val)
                        if (val && parseFloat(val) < 100) {
                          setError('Minimum purchase amount is $100 USDT')
                        } else {
                          setError('')
                        }
                      }}
                      className="w-full px-3 sm:px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-center text-base sm:text-lg font-bold focus:border-[#B48811] focus:outline-none transition-colors"
                    />
                    <button
                      onClick={() => setBuyAmount(String((parseFloat(buyAmount) || 100) + 1))}
                      className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-slate-800/50 border border-slate-700/50 text-[#EBD197] hover:bg-slate-700/50 hover:border-[#B48811]/50 transition-all flex items-center justify-center"
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                  <p className="text-slate-500 text-xs mb-4 text-center">Minimum purchase: $100 USDT</p>
                  {!isConnected ? (
                    <Button
                      onClick={() => open()}
                      disabled={processing}
                      variant="primary"
                      className="w-full rounded-full text-sm sm:text-base py-3"
                    >
                      <Wallet className="w-4 h-4 mr-2" /> Connect Wallet
                    </Button>
                  ) : (
                    <>
                      <div className="mb-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs">Connected:</span>
                          <span className="text-white font-mono text-xs sm:text-sm">{address?.substring(0, 8)}...{address?.substring(address.length - 6)}</span>
                        </div>
                        <button
                          onClick={() => disconnect()}
                          className="flex items-center gap-1 text-red-400 hover:text-red-300 text-xs"
                        >
                          <LogOut className="w-3 h-3" /> Disconnect
                        </button>
                      </div>
                      <Button
                        onClick={() => {
                          const amt = parseFloat(buyAmount) || 0
                          if (amt < 100) {
                            setError('Minimum purchase amount is $100 USDT')
                            return
                          }
                          setError('')
                          handleBuy()
                        }}
                        disabled={processing || !buyAmount || parseFloat(buyAmount) < 100}
                        variant="primary"
                        className="w-full rounded-full text-sm sm:text-base py-3"
                      >
                        {processing ? 'Processing...' : 'Buy Coins'}
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-700/50">
                    <p className="text-slate-400 text-xs sm:text-sm mb-2">Deposit Wallet</p>
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-mono text-xs sm:text-sm text-white break-all">{pendingPayment.depositWallet}</p>
                      <button onClick={() => handleCopy(pendingPayment.depositWallet, 'wallet')} className="text-[#EBD197] hover:text-white shrink-0">
                        {copied === 'wallet' ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <Copy className="w-4 h-4 sm:w-5 sm:h-5" />}
                      </button>
                    </div>
                  </div>
                  <Button onClick={handlePay} disabled={isWriting || isConfirming || verifying} variant="primary" className="w-full rounded-full text-sm sm:text-base py-3">
                    {isWriting ? 'Confirm in wallet...' : isConfirming ? 'Confirming...' : verifying ? 'Verifying...' : isConnected ? 'Pay with Wallet' : 'Connect Wallet & Pay'}
                  </Button>
                </div>
              )}
            </Card>

            {/* Sell Card */}
            <Card className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">Sell Coins</h2>
                  <p className="text-slate-400 text-xs sm:text-sm">Sell your Widget B coins</p>
                </div>
              </div>
              <div className="space-y-4">
                {/* Sell Calculator */}
                <div className="p-3 sm:p-4 rounded-xl bg-linear-to-br from-[#B48811]/10 to-transparent border border-[#B48811]/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-xs sm:text-sm">Sell Rate:</span>
                    <span className="text-slate-300 text-xs sm:text-sm">{config?.sellPercent ?? 0}% of coin value</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-xs sm:text-sm">Coin Price:</span>
                    <span className="text-slate-300 text-xs sm:text-sm">1 coin = ${(1 / parseFloat(config?.coinsPerUsd ?? 1)).toFixed(4)} USDT</span>
                  </div>
                  {sellAmount && parseFloat(sellAmount) > 0 ? (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-xs sm:text-sm">You sell:</span>
                        <span className="text-white font-bold text-sm sm:text-base flex items-center gap-1">
                          <Coins className="w-3 h-3 sm:w-4 sm:h-4" />
                          {parseFloat(sellAmount).toLocaleString()} coins
                        </span>
                      </div>
                      <div className="border-t border-slate-700/50 pt-2 mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[#EBD197] text-xs sm:text-sm font-medium">You receive:</span>
                          <span className="text-[#EBD197] font-bold text-base sm:text-lg">
                            ${((parseFloat(sellAmount) / parseFloat(config?.coinsPerUsd ?? 1)) * (parseFloat(config?.sellPercent ?? 0) / 100)).toFixed(2)} USDT
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-500 text-xs mt-2">
                        ({config?.sellPercent ?? 0}% of ${(parseFloat(sellAmount) / parseFloat(config?.coinsPerUsd ?? 1)).toFixed(2)} base value)
                      </p>
                    </>
                  ) : (
                    <p className="text-slate-500 text-xs mt-1">Enter coin amount below to see how much USDT you get</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSellAmount(String(Math.max(1, (parseFloat(sellAmount) || 1) - 1)))}
                    className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-slate-800/50 border border-slate-700/50 text-[#EBD197] hover:bg-slate-700/50 hover:border-[#B48811]/50 transition-all flex items-center justify-center"
                  >
                    <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Coin amount"
                    value={sellAmount}
                    onChange={(e) => setSellAmount(e.target.value)}
                    className="w-full px-3 sm:px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-center text-base sm:text-lg font-bold focus:border-[#B48811] focus:outline-none transition-colors"
                  />
                  <button
                    onClick={() => setSellAmount(String((parseFloat(sellAmount) || 0) + 1))}
                    className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-slate-800/50 border border-slate-700/50 text-[#EBD197] hover:bg-slate-700/50 hover:border-[#B48811]/50 transition-all flex items-center justify-center"
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>

                {balance && (
                  <p className="text-slate-500 text-xs text-center">
                    Available: {balance.availableBalance?.toLocaleString() ?? '0'} coins
                  </p>
                )}

                <input
                  type="text"
                  placeholder="Network (BSC)"
                  value={sellNetwork}
                  onChange={(e) => setSellNetwork(e.target.value)}
                  className="w-full px-3 sm:px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:border-[#B48811] focus:outline-none transition-colors"
                />
                <input
                  type="text"
                  placeholder="Your USDT wallet address"
                  value={sellAddress}
                  onChange={(e) => setSellAddress(e.target.value)}
                  className="w-full px-3 sm:px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:border-[#B48811] focus:outline-none transition-colors"
                />
                <Button
                  onClick={() => {
                    if (!sellAmount || parseFloat(sellAmount) <= 0) {
                      setError('Enter coin amount to sell')
                      return
                    }
                    if (balance && parseFloat(sellAmount) > parseFloat(balance.availableBalance)) {
                      setError('Insufficient coin balance')
                      return
                    }
                    setError('')
                    handleSell()
                  }}
                  disabled={processing || !sellAmount || parseFloat(sellAmount) <= 0}
                  variant="primary"
                  className="w-full rounded-full text-sm sm:text-base py-3"
                >
                  {processing ? 'Processing...' : 'Sell Coins'}
                </Button>
              </div>
            </Card>
          </motion.div>

          {/* Purchase History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-6 sm:mb-8"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10">
                <History className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Purchase History</h2>
                <p className="text-slate-400 text-xs sm:text-sm">Your Widget B coin purchases</p>
              </div>
            </motion.div>

            <Card className="overflow-hidden">
              {visiblePurchases.length === 0 ? (
                <div className="p-6 sm:p-8 text-center">
                  <History className="w-10 h-10 sm:w-12 sm:h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500 text-sm">No purchases found</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-700/50">
                  {visiblePurchases.map((p) => (
                    <div key={p.id} className="p-3 sm:p-4 hover:bg-slate-800/30 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
                            <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-white text-sm sm:text-base">{p.coinAmount} coins</p>
                            <p className="text-slate-400 text-xs sm:text-sm">{p.usdAmount ?? p.amountUsd} USDT</p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-slate-400 text-xs sm:text-sm flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Sell Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10">
                <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Sell Requests</h2>
                <p className="text-slate-400 text-xs sm:text-sm">Your pending sell requests</p>
              </div>
            </motion.div>

            <Card className="overflow-hidden">
              {sells.length === 0 ? (
                <div className="p-6 sm:p-8 text-center">
                  <ArrowDown className="w-10 h-10 sm:w-12 sm:h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500 text-sm">No sell requests found</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-700/50">
                  {sells.map((s) => (
                    <div key={s.id} className="p-3 sm:p-4 hover:bg-slate-800/30 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
                            <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-white text-sm sm:text-base">{s.coinAmount} coins</p>
                            <div className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${
                              s.status === 'COMPLETED'
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                : s.status === 'PENDING'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-slate-700/50 text-slate-400 border border-slate-600/50'
                            }`}>
                              {s.status}
                            </div>
                          </div>
                        </div>
                        {s.status === 'PENDING' && (
                          <Button onClick={() => handleCancel(s.id)} variant="outline" size="sm" className="rounded-full text-xs sm:text-sm px-3 sm:px-4 py-2 shrink-0">
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
