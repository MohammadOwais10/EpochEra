'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { getAdminMlmConfig, updateAdminMlmConfig } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { Settings, Layers, DollarSign, Coins, Edit, AlertCircle, CheckCircle } from 'lucide-react'

export default function AdminMlmConfigPage() {
  const router = useRouter()
  const [config, setConfig] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ usdCommission: '', epochCoinReward: '', isActive: true })

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      router.push('/signin')
      return
    }
    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      const result = await getAdminMlmConfig()
      setConfig(result.success ? (result.data?.data || result.data || []) : [])
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to load MLM config')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (item) => {
    setEditing(item.generation)
    setForm({
      usdCommission: item.usdCommission,
      epochCoinReward: item.epochCoinReward,
      isActive: item.isActive,
    })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const data = {
        usdCommission: form.usdCommission.toString(),
        epochCoinReward: form.epochCoinReward.toString(),
        isActive: Boolean(form.isActive),
      }
      await updateAdminMlmConfig(editing, data)
      setEditing(null)
      fetchData()
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Update failed')
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center text-white">
      <div className="relative">
        <div className="absolute inset-0 bg-[#B48811]/20 rounded-full blur-xl animate-pulse"></div>
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 border-4 border-[#B48811]/20 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20 border-4 border-[#B48811] rounded-full border-t-transparent animate-spin"></div>
        <div className="absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20 border-4 border-[#EBD197] rounded-full border-b-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      <div className="text-center mt-4 sm:mt-6">
        <p className="text-white font-semibold text-base sm:text-lg mb-1">Loading MLM Configuration</p>
        <p className="text-slate-400 text-xs sm:text-sm">Please wait...</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10 shrink-0">
            <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-linear-to-r from-white to-slate-200 bg-clip-text text-transparent">MLM Configuration</h1>
            <p className="text-slate-400 text-xs sm:text-sm">Manage multi-level marketing settings</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:ml-auto">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Generations: {config.length}</span>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 flex items-center gap-3 text-xs sm:text-sm"
        >
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          {error}
        </motion.div>
      )}

      {/* Edit Form */}
      {editing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 sm:mb-6"
        >
          <Card className="p-4 sm:p-6 border-[#B48811]/30">
            <h3 className="text-white font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-base sm:text-lg">
              <Edit className="w-4 h-4 sm:w-5 sm:h-5 text-[#EBD197]" />
              Edit Generation {editing}
            </h3>
            <form onSubmit={handleSave} className="space-y-3 sm:space-y-4">
              <input
                type="text"
                placeholder="USDT Commission"
                value={form.usdCommission}
                onChange={(e) => setForm({ ...form, usdCommission: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:border-[#B48811]/50 focus:ring-1 focus:ring-[#B48811]/50 focus:outline-none transition-all text-sm"
              />
              <input
                type="text"
                placeholder="Epoch Coin Reward"
                value={form.epochCoinReward}
                onChange={(e) => setForm({ ...form, epochCoinReward: e.target.value })}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:border-[#B48811]/50 focus:ring-1 focus:ring-[#B48811]/50 focus:outline-none transition-all text-sm"
              />
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 accent-[#B48811]"
                />
                Active
              </label>
              <div className="flex gap-2">
                <Button type="submit" variant="primary" className="rounded-full bg-linear-to-r from-[#EBD197] to-[#B48811] text-slate-950 border-0 text-xs sm:text-sm px-4 sm:px-6">Save</Button>
                <Button onClick={() => setEditing(null)} variant="outline" className="rounded-full hover:bg-slate-700/50 text-xs sm:text-sm px-4 sm:px-6">Cancel</Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}

      {/* Config Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {/* Mobile Card Layout */}
        <div className="md:hidden space-y-3 sm:space-y-4">
          {config.length === 0 ? (
            <div className="p-6 sm:p-8 text-slate-500 text-center bg-slate-800/30 border border-slate-700/50 rounded-2xl">
              No MLM config found.
            </div>
          ) : (
            config.map((c) => (
              <Card key={c.generation} className="p-4 border-[#B48811]/30">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-[#EBD197]/10 to-[#B48811]/10 border border-[#B48811]/20 rounded-lg flex items-center justify-center shrink-0">
                      <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-[#EBD197]" />
                    </div>
                    <div>
                      <span className="text-white font-medium text-sm sm:text-base">Generation {c.generation}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ${
                    c.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-700/50 text-slate-400 border-slate-600/30'
                  }`}>
                    {c.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-slate-700/30 rounded-lg p-2">
                    <p className="text-slate-400 text-xs mb-1">USDT Commission</p>
                    <div className="flex items-center gap-1 text-slate-300 text-sm">
                      <DollarSign className="w-3 h-3 text-[#EBD197]" />
                      {c.usdCommission}
                    </div>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-2">
                    <p className="text-slate-400 text-xs mb-1">Epoch Coin</p>
                    <div className="flex items-center gap-1 text-slate-300 text-sm">
                      <Coins className="w-3 h-3 text-[#EBD197]" />
                      {c.epochCoinReward}
                    </div>
                  </div>
                </div>

                <Button onClick={() => handleEdit(c)} variant="outline" size="sm" className="rounded-full hover:bg-slate-700/50 w-full text-xs sm:text-sm">
                  <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Edit Configuration
                </Button>
              </Card>
            ))
          )}
        </div>

        {/* Desktop Table Layout */}
        <Card className="hidden md:block border-[#B48811]/30 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 border-b border-slate-700/50">
              <tr>
                <th className="p-4 text-slate-400 font-medium">Generation</th>
                <th className="p-4 text-slate-400 font-medium">USDT Commission</th>
                <th className="p-4 text-slate-400 font-medium">Epoch Coin</th>
                <th className="p-4 text-slate-400 font-medium">Active</th>
                <th className="p-4 text-slate-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {config.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-slate-500 text-center">No MLM config found.</td>
                </tr>
              ) : (
                config.map((c) => (
                  <tr key={c.generation} className="border-t border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-linear-to-br from-[#EBD197]/10 to-[#B48811]/10 border border-[#B48811]/20 rounded-lg flex items-center justify-center">
                          <Layers className="w-4 h-4 text-[#EBD197]" />
                        </div>
                        <span className="text-white font-medium">{c.generation}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <DollarSign className="w-4 h-4 text-[#EBD197]" />
                        {c.usdCommission}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Coins className="w-4 h-4 text-[#EBD197]" />
                        {c.epochCoinReward}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        c.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-700/50 text-slate-400 border-slate-600/30'
                      }`}>
                        {c.isActive ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="p-4">
                      <Button onClick={() => handleEdit(c)} variant="outline" size="sm" className="rounded-full hover:bg-slate-700/50">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      </motion.div>
    </div>
  )
}
