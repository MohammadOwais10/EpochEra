'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { getAdminDepositWallet, setAdminDepositWallet } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Wallet, CheckCircle, AlertCircle, Copy } from 'lucide-react'

export default function AdminDepositWalletPage() {
  const router = useRouter()
  const [wallet, setWallet] = useState(null)
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      router.push('/signin')
      return
    }
    const fetchData = async () => {
      try {
        const result = await getAdminDepositWallet()
        setWallet(result.success ? result.data : null)
      } catch (err) {
        setError(err.response?.data?.error?.message || err.message || 'Failed to load deposit wallet')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [router])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMsg('')
    try {
      const result = await setAdminDepositWallet({ address })
      if (!result.success) throw new Error(result.error?.message || 'Save failed')
      setMsg('Deposit wallet updated')
      const r = await getAdminDepositWallet()
      setWallet(r.success ? r.data : null)
      setAddress('')
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleCopy = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
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
        <p className="text-white font-semibold text-lg mb-1">Loading Deposit Wallet</p>
        <p className="text-slate-400 text-sm">Please wait...</p>
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
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">Deposit Wallet</h1>
          <p className="text-slate-400 text-sm">Manage deposit wallet configuration</p>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5" />
          {error}
        </motion.div>
      )}

      {msg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 flex items-center gap-3"
        >
          <CheckCircle className="w-5 h-5" />
          {msg}
        </motion.div>
      )}

      {/* Current Address */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <Card className="p-6 border-[#B48811]/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Current Deposit Address</h3>
            {wallet?.address && (
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                {copied ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5 text-[#EBD197]" />}
              </button>
            )}
          </div>
          <p className="text-xl font-mono text-[#EBD197] mt-2 break-all">{wallet?.address || 'Not set'}</p>
          {wallet?.updatedAt && (
            <p className="text-slate-500 text-sm mt-2">Updated: {new Date(wallet.updatedAt).toLocaleString()}</p>
          )}
        </Card>
      </motion.div>

      {/* Update Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-6 border-[#B48811]/30">
          <h3 className="text-white font-semibold mb-4">Update Deposit Address</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <input
              type="text"
              placeholder="0x... BSC/EVM address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:border-[#B48811]/50 focus:ring-1 focus:ring-[#B48811]/50 focus:outline-none transition-all"
              required
            />
            <Button 
              type="submit" 
              disabled={saving} 
              variant="primary" 
              className="rounded-full bg-gradient-to-r from-[#EBD197] to-[#B48811] text-slate-950 border-0"
            >
              {saving ? 'Saving...' : 'Update Address'}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
