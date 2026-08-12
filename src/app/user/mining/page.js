'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { getMiningContent, getMiningStatus, mine, getMiningHistory } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Pickaxe, Clock, Coins, Play, History, Zap, X, Shield, FileText } from 'lucide-react'
import Card from '@/components/ui/Card'

export default function MiningPage() {
  const router = useRouter()
  const [content, setContent] = useState([])
  const [status, setStatus] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [mining, setMining] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      router.push('/signin')
      return
    }
    const fetchData = async () => {
      try {
        const [c, s, h] = await Promise.all([getMiningContent(), getMiningStatus(), getMiningHistory()])
        setContent(c.success ? (c.data?.data || c.data || []) : [])
        setStatus(s.success ? s.data : null)
        setHistory(h.success ? (h.data?.data || h.data || []) : [])
      } catch (err) {
        setError(err.response?.data?.error?.message || err.message || 'Failed to load mining')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [router])

  const handleMine = async (contentId) => {
    setMining(true)
    setError('')
    setMsg('')
    try {
      const result = await mine({ contentId, confirmation: true })
      if (!result.success) throw new Error(result.error?.message || 'Mining failed')
      setMsg(result.data.message || 'Mined successfully')
      const s = await getMiningStatus()
      setStatus(s.success ? s.data : null)
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Mining failed')
    } finally {
      setMining(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#B48811]/30 border-t-[#EBD197] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading mining status...</p>
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
                <Pickaxe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Mining</h1>
                <p className="text-slate-400 text-sm">Earn rewards by mining content</p>
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

          {/* Mining Status Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid md:grid-cols-3 gap-6 mb-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
              className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-[#B48811]/40 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#B48811]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-black/10 group-hover:scale-110 transition-transform duration-300 ${
                    status?.canMine 
                      ? 'bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm' 
                      : 'bg-gradient-to-br from-[#BB9B49] via-[#B48811] to-[#EBD197] border border-[#B48811]/20 backdrop-blur-sm'
                  }`}>
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    status?.canMine 
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                      : 'bg-slate-700/50 text-slate-400 border border-slate-600/50'
                  }`}>
                    {status?.canMine ? 'Ready' : 'Wait'}
                  </div>
                </div>
                <p className="text-slate-400 text-sm font-medium mb-1">Mining Status</p>
                <p className="text-3xl font-bold text-white tracking-tight">{status?.canMine ? 'Available' : 'Not Available'}</p>
                <p className="text-slate-500 text-xs mt-2">{status?.canMine ? 'You can mine now' : 'Wait for next mining window'}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
              className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-[#B48811]/40 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#B48811]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-black/10 group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-[#EBD197] text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    <span>Next</span>
                  </div>
                </div>
                <p className="text-slate-400 text-sm font-medium mb-1">Next Mining</p>
                <p className="text-3xl font-bold text-white tracking-tight">
                  {status?.nextMiningAt ? new Date(status.nextMiningAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Now'}
                </p>
                <p className="text-slate-500 text-xs mt-2">{status?.nextMiningAt ? new Date(status.nextMiningAt).toLocaleDateString() : 'Available immediately'}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              whileHover="hover"
              whileTap={{ scale: 0.98 }}
              className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-[#B48811]/40 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#B48811]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-black/10 group-hover:scale-110 transition-transform duration-300">
                    <Coins className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-[#EBD197] text-sm font-medium">
                    <Coins className="w-4 h-4" />
                    <span>Balance</span>
                  </div>
                </div>
                <p className="text-slate-400 text-sm font-medium mb-1">Reward Coins</p>
                <p className="text-3xl font-bold text-white tracking-tight">{status?.rewardCoins ?? '0'}</p>
                <p className="text-slate-500 text-xs mt-2">Total earned rewards</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Mining Content Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Mining Content</h2>
                <p className="text-slate-400 text-sm">Available content to mine for rewards</p>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {content.length === 0 ? (
                <Card className="p-8 text-center">
                  <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500">No content available for mining</p>
                </Card>
              ) : (
                content.map((c) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover="hover"
                    whileTap={{ scale: 0.98 }}
                    className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-[#B48811]/40 transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#B48811]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-black/10 group-hover:scale-110 transition-transform duration-300">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex items-center gap-1 text-[#EBD197] text-sm font-medium">
                          <Coins className="w-4 h-4" />
                          <span>{c.rewardCoins}</span>
                        </div>
                      </div>
                      <h3 className="font-bold text-lg text-white mb-2">{c.title}</h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-3">{c.content?.substring(0, 150)}...</p>
                      <Button
                        onClick={() => handleMine(c.id)}
                        disabled={mining || !status?.canMine}
                        variant="primary"
                        className="rounded-full w-full"
                        size="sm"
                      >
                        {mining ? 'Mining...' : <><Play className="w-4 h-4 mr-2" /> Mine Now</>}
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>

          {/* Mining History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10">
                <History className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Mining History</h2>
                <p className="text-slate-400 text-sm">Your past mining activities</p>
              </div>
            </motion.div>

            <Card className="overflow-hidden">
              {history.length === 0 ? (
                <div className="p-8 text-center">
                  <History className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500">No mining history found</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-700/50">
                  {history.map((h, i) => (
                    <div key={i} className="p-4 hover:bg-slate-800/30 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                            <Coins className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-white">Reward Earned</p>
                            <p className="text-slate-400 text-sm">{h.createdAt ? new Date(h.createdAt).toLocaleString() : '-'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#EBD197]">{h.rewardCoins}</p>
                          <p className="text-slate-400 text-xs">Coins</p>
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
