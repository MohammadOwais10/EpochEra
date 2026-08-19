'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { getAdminWidgetBConfig, updateAdminWidgetBConfig } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Coins, Save, AlertCircle, CheckCircle, TrendingUp, Percent, Network } from 'lucide-react'

export default function AdminCoinConfigPage() {
  const router = useRouter()
  const [config, setConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({
    coinsPerUsd: '',
    directSponsorRewardPercent: '',
    sellPercent: '',
    allowedUsdtNetwork: 'BEP20',
  })

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      router.push('/signin')
      return
    }
    fetchConfig()
  }, [router])

  const fetchConfig = async () => {
    try {
      const result = await getAdminWidgetBConfig()
      if (result.success) {
        const cfg = result.data
        setConfig(cfg)
        setForm({
          coinsPerUsd: cfg.coinsPerUsd?.toString() || '',
          directSponsorRewardPercent: cfg.directSponsorRewardPercent?.toString() || '',
          sellPercent: cfg.sellPercent?.toString() || '',
          allowedUsdtNetwork: cfg.allowedUsdtNetwork || 'BEP20',
        })
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to load config')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMsg('')
    try {
      const result = await updateAdminWidgetBConfig({
        coinsPerUsd: form.coinsPerUsd,
        directSponsorRewardPercent: form.directSponsorRewardPercent,
        sellPercent: form.sellPercent,
        allowedUsdtNetwork: form.allowedUsdtNetwork,
      })
      if (!result.success) throw new Error(result.error?.message || 'Update failed')
      setMsg('Coin configuration updated successfully')
      fetchConfig()
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#B48811]/30 border-t-[#EBD197] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading coin configuration...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4 mb-8"
      >
        <div className="w-12 h-12 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10">
          <Coins className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">Coin Configuration</h1>
          <p className="text-slate-400 text-sm">Set coin price, sponsor reward, and sell settings</p>
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

      {/* Current Config Display */}
      {config && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6"
        >
          <Card className="p-6 border-[#B48811]/30">
            <h3 className="text-white font-semibold mb-4">Current Settings</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 rounded-lg bg-slate-800/30">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-[#EBD197]" />
                  <p className="text-slate-400 text-xs">Coins per USDT</p>
                </div>
                <p className="text-lg font-bold text-white">{config.coinsPerUsd}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/30">
                <div className="flex items-center gap-2 mb-1">
                  <Percent className="w-4 h-4 text-[#EBD197]" />
                  <p className="text-slate-400 text-xs">Sponsor Reward</p>
                </div>
                <p className="text-lg font-bold text-white">{config.directSponsorRewardPercent}%</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/30">
                <div className="flex items-center gap-2 mb-1">
                  <Percent className="w-4 h-4 text-[#EBD197]" />
                  <p className="text-slate-400 text-xs">Sell Percent</p>
                </div>
                <p className="text-lg font-bold text-white">{config.sellPercent}%</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-800/30">
                <div className="flex items-center gap-2 mb-1">
                  <Network className="w-4 h-4 text-[#EBD197]" />
                  <p className="text-slate-400 text-xs">Network</p>
                </div>
                <p className="text-lg font-bold text-white">{config.allowedUsdtNetwork}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Edit Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-6 border-[#B48811]/30">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Coins className="w-5 h-5 text-[#EBD197]" />
            Update Configuration
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-slate-400 text-sm mb-2">Coins per USDT</label>
              <input
                type="number"
                step="any"
                placeholder="e.g. 100"
                value={form.coinsPerUsd}
                onChange={(e) => setForm({ ...form, coinsPerUsd: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:border-[#B48811]/50 focus:ring-1 focus:ring-[#B48811]/50 focus:outline-none transition-all"
                required
              />
              <p className="text-slate-500 text-xs mt-1">How many coins a user gets for 1 USDT (Widget B purchase rate)</p>
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-2">Direct Sponsor Reward (%)</label>
              <input
                type="number"
                step="any"
                placeholder="e.g. 10"
                value={form.directSponsorRewardPercent}
                onChange={(e) => setForm({ ...form, directSponsorRewardPercent: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:border-[#B48811]/50 focus:ring-1 focus:ring-[#B48811]/50 focus:outline-none transition-all"
                required
              />
              <p className="text-slate-500 text-xs mt-1">Percentage of coins given to direct sponsor on purchase</p>
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-2">Sell Percent (%)</label>
              <input
                type="number"
                step="any"
                placeholder="e.g. 80"
                value={form.sellPercent}
                onChange={(e) => setForm({ ...form, sellPercent: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:border-[#B48811]/50 focus:ring-1 focus:ring-[#B48811]/50 focus:outline-none transition-all"
                required
              />
              <p className="text-slate-500 text-xs mt-1">Percentage of coin value user gets when selling Widget B coins back</p>
            </div>

            <div>
              <label className="block text-slate-400 text-sm mb-2">Allowed USDT Network</label>
              <select
                value={form.allowedUsdtNetwork}
                onChange={(e) => setForm({ ...form, allowedUsdtNetwork: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:border-[#B48811]/50 focus:ring-1 focus:ring-[#B48811]/50 focus:outline-none transition-all"
              >
                <option value="BEP20">BEP20 (Tron)</option>
                <option value="BSC">BSC (Binance Smart Chain)</option>
                <option value="ERC20">ERC20 (Ethereum)</option>
              </select>
              <p className="text-slate-500 text-xs mt-1">Network for USDT payouts on sell requests</p>
            </div>

            <Button
              type="submit"
              disabled={saving}
              variant="primary"
              className="rounded-full bg-gradient-to-r from-[#EBD197] to-[#B48811] text-slate-950 border-0"
            >
              {saving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save Configuration</>}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
