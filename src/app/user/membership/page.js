'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppKit, useAppKitAccount } from '@reown/appkit/react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, erc20Abi } from 'viem'
import { motion } from 'framer-motion'
import { getMyMembership, getMembershipHistory, purchaseMembership, verifyDeposit } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Copy, Check, Crown, Clock, Wallet, CreditCard, History, Shield, X } from 'lucide-react'
import Card from '@/components/ui/Card'

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#B48811]/30 border-t-[#EBD197] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading membership details...</p>
        </div>
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
          {/* Professional Header */}
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
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Membership</h1>
                <p className="text-slate-400 text-sm">Manage your premium membership</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Error/Success Messages */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3"
            >
              <X className="w-5 h-5 text-red-400" />
              <p className="text-red-400">{error}</p>
            </motion.div>
          )}

          {msg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3"
            >
              <Shield className="w-5 h-5 text-green-400" />
              <p className="text-green-400">{msg}</p>
            </motion.div>
          )}

          {/* Current Membership Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8"
          >
            <Card className="p-6 md:p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10">
                    <CreditCard className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Current Membership</h2>
                    <p className="text-slate-400 text-sm mt-1">Your active membership status</p>
                  </div>
                </div>
              </div>

              {membership?.active ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-green-400 font-semibold text-lg">Active Membership</p>
                      <p className="text-slate-400 text-sm">Enjoy all premium benefits</p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                      <p className="text-slate-400 text-sm mb-1">Investment Amount</p>
                      <p className="text-2xl font-bold text-white">{membership.active.amountUsd} USD</p>
                    </div>
                    {membership.active.createdAt && (
                      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                        <p className="text-slate-400 text-sm mb-1">Purchased Date</p>
                        <p className="text-2xl font-bold text-white">{new Date(membership.active.createdAt).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-700/50 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-slate-300 font-semibold text-lg">No Active Membership</p>
                      <p className="text-slate-400 text-sm">Purchase Standard Membership to unlock premium features</p>
                    </div>
                  </div>
                  {!purchaseData && (
                    <Button
                      onClick={handlePurchase}
                      disabled={purchasing}
                      variant="primary"
                      size="lg"
                      className="rounded-full w-full md:w-auto"
                    >
                      {purchasing ? 'Processing...' : 'Purchase Standard Membership'}
                    </Button>
                  )}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Purchase Flow */}
          {purchaseData && !membership?.active && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-8"
            >
              <Card className="p-6 md:p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10">
                      <Wallet className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Complete Your Purchase</h2>
                      <p className="text-slate-400 text-sm mt-1">Follow the steps below to activate your membership</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                    <p className="text-slate-400 text-sm mb-2">Payment Details</p>
                    <p className="text-white">
                      Send <strong className="text-[#EBD197]">{purchaseData.amountUsd} USD</strong> in USDT to the deposit wallet on <strong className="text-[#EBD197]">{purchaseData.network?.toUpperCase()}</strong>
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4">
                      <p className="text-slate-400 text-sm mb-2">Deposit Wallet Address</p>
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-mono text-sm text-white break-all">{purchaseData.depositWallet}</p>
                        <button
                          onClick={() => handleCopy(purchaseData.depositWallet, 'wallet')}
                          className="text-[#EBD197] hover:text-white shrink-0 transition-colors"
                        >
                          {copied === 'wallet' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-4">
                      <p className="text-slate-400 text-sm mb-2">Amount to Send</p>
                      <p className="font-mono text-lg text-white">{purchaseData.amountUsd} USD</p>
                    </div>

                    <Button
                      onClick={handlePay}
                      disabled={isWriting || isConfirming || verifying}
                      variant="primary"
                      size="lg"
                      className="w-full rounded-full"
                    >
                      {isWriting ? 'Confirm in wallet...' : isConfirming ? 'Confirming...' : verifying ? 'Verifying...' : isConnected ? `Pay ${purchaseData.amountUsd} USDT` : 'Connect Wallet & Pay'}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Membership History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10">
                <History className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Membership History</h2>
                <p className="text-slate-400 text-sm">Your past membership purchases</p>
              </div>
            </motion.div>

            <Card className="overflow-hidden">
              {history.length === 0 ? (
                <div className="p-8 text-center">
                  <History className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500">No membership history found</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-700/50">
                  {history.map((item, index) => (
                    <div key={index} className="p-4 hover:bg-slate-800/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            <Crown className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-white">{item.amountUsd} USD Membership</p>
                            <p className="text-slate-400 text-sm">{new Date(item.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === 'COMPLETED' 
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                            : 'bg-slate-700/50 text-slate-400 border border-slate-600/50'
                        }`}>
                          {item.status}
                        </div>
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
