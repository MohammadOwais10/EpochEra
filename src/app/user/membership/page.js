'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppKit, useAppKitAccount, useDisconnect } from '@reown/appkit/react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseUnits, erc20Abi, createWalletClient, custom } from 'viem'
import { bscTestnet as bscTestnetViem } from 'viem/chains'
import { motion } from 'framer-motion'
import { getMyMembership, getMembershipHistory, purchaseMembership, verifyDeposit } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Copy, Check, Crown, Clock, Wallet, CreditCard, History, Shield, X, LogOut, CheckCircle } from 'lucide-react'
import Card from '@/components/ui/Card'

export default function MembershipPage() {
  const router = useRouter()
  const { open } = useAppKit()
  const { address, isConnected } = useAppKitAccount()
  const { disconnect } = useDisconnect()
  const { data: txHash, writeContract, isPending: isWriting, isError: isWriteError, error: writeError } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash })

  const [membership, setMembership] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [isPaying, setIsPaying] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [purchaseData, setPurchaseData] = useState(null)
  const [txHashManual, setTxHashManual] = useState('')
  const [senderAddressManual, setSenderAddressManual] = useState('')
  const [copied, setCopied] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)

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
      setShowSuccessModal(true)
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
    setMsg('')
    if (!isConnected) {
      console.log('[handlePay] opening AppKit modal, open fn:', typeof open)
      try {
        open()
        setTimeout(() => {
          const modalEl = document.querySelector('w3m-modal')
          console.log('[handlePay] w3m-modal element:', modalEl)
          if (modalEl) {
            console.log('[handlePay] modal open attr:', modalEl.open)
            console.log('[handlePay] modal classList:', modalEl.classList.toString())
            console.log('[handlePay] modal shadowRoot:', !!modalEl.shadowRoot)
          }
        }, 500)
      } catch (err) {
        console.error('Failed to open AppKit modal:', err)
        setError('Wallet modal could not be opened. Please use manual deposit.')
      }
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

  const handlePayDirect = async () => {
    setError('')
    setMsg('')
    setIsPaying(true)
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        throw new Error('MetaMask or an injected wallet is not installed')
      }
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const account = accounts?.[0]
      if (!account) throw new Error('No account selected')

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x61' }],
        })
      } catch (switchErr) {
        if (switchErr?.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x61',
              chainName: 'BSC Testnet',
              nativeCurrency: { name: 'BNB', symbol: 'tBNB', decimals: 18 },
              rpcUrls: ['https://bsc-testnet-rpc.publicnode.com'],
              blockExplorerUrls: ['https://testnet.bscscan.com'],
            }],
          })
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x61' }],
          })
        } else {
          throw switchErr
        }
      }

      if (!purchaseData?.usdtContract || !purchaseData?.depositWallet) {
        setError('Payment details not loaded')
        setIsPaying(false)
        return
      }

      const client = createWalletClient({
        chain: bscTestnetViem,
        transport: custom(window.ethereum),
      })

      const hash = await client.writeContract({
        address: purchaseData.usdtContract,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [purchaseData.depositWallet, parseUnits(String(purchaseData.amountUsd), 18)],
        account,
      })

      setMsg('Transaction sent. Verifying...')
      await handleVerifyAuto(hash, account)
    } catch (err) {
      const message = err?.message || 'Transaction failed or rejected'
      if (err?.code === 4902 || message?.includes('wallet_addEthereumChain')) {
        setError('Please add BSC testnet network to MetaMask')
      } else {
        setError(message)
      }
    } finally {
      setIsPaying(false)
    }
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
      setShowSuccessModal(true)
      await fetchData()
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Verification failed')
    } finally {
      setVerifying(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-[#B48811]/30 border-t-[#EBD197] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm sm:text-base">Loading membership details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Professional Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-125 h-125 sm:w-[500px] sm:h-[500px] bg-[#B48811]/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-125 h-125 sm:w-[500px] sm:h-[500px] bg-[#B48811]/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 sm:w-[800px] sm:h-[800px] bg-[#B48811]/2 rounded-full blur-3xl"></div>
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
              className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Membership</h1>
                <p className="text-slate-400 text-xs sm:text-sm">Manage your premium membership</p>
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

          {/* Current Membership Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 sm:mb-8"
          >
            <Card className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 sm:mb-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10 shrink-0">
                    <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Current Membership</h2>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">Your active membership status</p>
                  </div>
                </div>
              </div>

              {membership?.active ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center shrink-0">
                      <Shield className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-green-400 font-semibold text-base sm:text-lg">Active Membership</p>
                      <p className="text-slate-400 text-xs sm:text-sm">Enjoy all premium benefits</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
                    <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-700/50">
                      <p className="text-slate-400 text-xs sm:text-sm mb-1">Investment Amount</p>
                      <p className="text-xl sm:text-2xl font-bold text-white">{membership.active.amountUsd} USDT</p>
                    </div>
                    {membership.active.createdAt && (
                      <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-700/50">
                        <p className="text-slate-400 text-xs sm:text-sm mb-1">Purchased Date</p>
                        <p className="text-xl sm:text-2xl font-bold text-white">{new Date(membership.active.createdAt).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-700/50 rounded-full flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-slate-300 font-semibold text-base sm:text-lg">No Active Membership</p>
                      <p className="text-slate-400 text-xs sm:text-sm">Purchase Standard Membership to unlock premium features</p>
                    </div>
                  </div>
                  {!purchaseData && (
                    <Button
                      onClick={handlePurchase}
                      disabled={purchasing}
                      variant="primary"
                      size="lg"
                      className="rounded-full w-full sm:w-auto min-h-[44px]"
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
              className="mb-6 sm:mb-8"
            >
              <Card className="p-4 sm:p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4 sm:mb-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10 shrink-0">
                      <Wallet className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white">Complete Your Purchase</h2>
                      <p className="text-slate-400 text-xs sm:text-sm mt-1">Follow the steps below to activate your membership</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-700/50">
                    <p className="text-slate-400 text-xs sm:text-sm mb-2">Payment Details</p>
                    <p className="text-white text-sm sm:text-base">
                      Send <strong className="text-[#EBD197]">{purchaseData.amountUsd} USDT</strong> to the deposit wallet on <strong className="text-[#EBD197]">{purchaseData.network?.toUpperCase()}</strong>
                    </p>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-3 sm:p-4">
                      <p className="text-slate-400 text-xs sm:text-sm mb-2">Deposit Wallet Address</p>
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-mono text-xs sm:text-sm text-white break-all">{purchaseData.depositWallet}</p>
                        <button
                          onClick={() => handleCopy(purchaseData.depositWallet, 'wallet')}
                          className="text-[#EBD197] hover:text-white shrink-0 transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
                        >
                          {copied === 'wallet' ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : <Copy className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-3 sm:p-4">
                      <p className="text-slate-400 text-xs sm:text-sm mb-2">Amount to Send</p>
                      <p className="font-mono text-base sm:text-lg text-white">{purchaseData.amountUsd} USDT</p>
                    </div>

                    <Button
                      onClick={handlePay}
                      disabled={isWriting || isConfirming || verifying}
                      variant="primary"
                      size="lg"
                      className="w-full rounded-full min-h-[44px]"
                    >
                      {isWriting ? 'Confirm in wallet...' : isConfirming ? 'Confirming...' : verifying ? 'Verifying...' : isConnected ? `Pay ${purchaseData.amountUsd} USDT` : 'Connect Wallet & Pay'}
                    </Button>

                    {/* {!isConnected && (
                      <Button
                        onClick={handlePayDirect}
                        disabled={isPaying}
                        variant="outline"
                        size="lg"
                        className="w-full rounded-full mt-3"
                      >
                        {isPaying ? 'Processing...' : 'Pay with MetaMask'}
                      </Button>
                    )} */}

                    {isConnected && address && (
                      <div className="mt-3 sm:mt-4 flex items-center justify-between gap-2 sm:gap-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] flex items-center justify-center shrink-0">
                            <Wallet className="w-4 h-4 text-white" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-slate-400">Connected Wallet</p>
                            <p className="font-mono text-xs sm:text-sm text-white truncate">
                              {address.slice(0, 6)}...{address.slice(-4)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => disconnect()}
                          className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors shrink-0 min-h-[36px]"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Disconnect</span>
                        </button>
                      </div>
                    )}

                    {/* <div className="mt-6 pt-6 border-t border-slate-700/50">
                      <p className="text-slate-400 text-sm mb-4">Or send manually from your wallet, then verify below:</p>
                      <form onSubmit={handleVerifyManual} className="space-y-4">
                        <div>
                          <label className="block text-slate-400 text-sm mb-2">Transaction Hash</label>
                          <input
                            type="text"
                            value={txHashManual}
                            onChange={(e) => setTxHashManual(e.target.value)}
                            placeholder="0x..."
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#B48811]"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-slate-400 text-sm mb-2">Your BSC Wallet Address (sender)</label>
                          <input
                            type="text"
                            value={senderAddressManual}
                            onChange={(e) => setSenderAddressManual(e.target.value)}
                            placeholder="0x..."
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#B48811]"
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          disabled={verifying || !txHashManual || !senderAddressManual}
                          variant="outline"
                          size="lg"
                          className="w-full rounded-full"
                        >
                          {verifying ? 'Verifying...' : 'Verify Manual Deposit'}
                        </Button>
                      </form>
                    </div> */}
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
              className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10 shrink-0">
                <History className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Membership History</h2>
                <p className="text-slate-400 text-xs sm:text-sm">Your past membership purchases</p>
              </div>
            </motion.div>

            <Card className="overflow-hidden">
              {history.length === 0 ? (
                <div className="p-6 sm:p-8 text-center">
                  <History className="w-10 h-10 sm:w-12 sm:h-12 text-slate-600 mx-auto mb-3 sm:mb-4" />
                  <p className="text-slate-500 text-sm sm:text-base">No membership history found</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-700/50">
                  {history.map((item, index) => (
                    <div key={index} className="p-3 sm:p-4 hover:bg-slate-800/30 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
                            <Crown className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-white text-sm sm:text-base">{item.amountUsd} USDT Membership</p>
                            <p className="text-slate-400 text-xs sm:text-sm">{new Date(item.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium w-fit ${
                          item.status === 'COMPLETED'
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                            : 'bg-slate-700/50 text-slate-400 border border-slate-600/50'
                        }`}>
                          {item.status}
                        </div>
                      </div>

                      {item.payment?.transactionHash && (
                        <div className="mt-2 sm:mt-3 ml-0 sm:ml-13 space-y-1.5 sm:space-y-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs">
                            <span className="text-slate-500">Tx Hash:</span>
                            <span className="text-slate-300 font-mono break-all">{item.payment.transactionHash.substring(0, 20)}...{item.payment.transactionHash.substring(item.payment.transactionHash.length - 8)}</span>
                            <button
                              onClick={() => handleCopy(item.payment.transactionHash, `tx-${index}`)}
                              className="text-[#EBD197] hover:text-[#BB9B49] flex items-center gap-1 shrink-0 min-h-[24px]"
                            >
                              {copied === `tx-${index}` ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                            </button>
                          </div>
                          {item.payment?.senderAddress && (
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs">
                              <span className="text-slate-500">From:</span>
                              <span className="text-slate-300 font-mono">{item.payment.senderAddress.substring(0, 10)}...{item.payment.senderAddress.substring(item.payment.senderAddress.length - 6)}</span>
                              <button
                                onClick={() => handleCopy(item.payment.senderAddress, `addr-${index}`)}
                                className="text-[#EBD197] hover:text-[#BB9B49] flex items-center gap-1 shrink-0 min-h-[24px]"
                              >
                                {copied === `addr-${index}` ? <><Check className="w-3 h-3" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                              </button>
                            </div>
                          )}
                          {item.payment?.transactionHash && (
                            <a
                              href={`https://testnet.bscscan.com/tx/${item.payment.transactionHash}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-[#EBD197] hover:text-[#BB9B49] mt-1"
                            >
                              <CreditCard className="w-3 h-3" /> View on BscScan
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Membership Purchase Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm" onClick={() => setShowSuccessModal(false)}>
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 sm:p-8 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Membership Purchased Successfully!</h3>
              <p className="text-slate-400 text-sm sm:text-base mb-4 sm:mb-6">
                Your membership has been activated. You now have access to mining, MLM rewards, and all platform features.
              </p>
              <div className="flex justify-center">
                <Button onClick={() => setShowSuccessModal(false)} variant="primary" className="rounded-full min-h-[44px]">
                  <CheckCircle className="w-4 h-4 mr-2" /> Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
