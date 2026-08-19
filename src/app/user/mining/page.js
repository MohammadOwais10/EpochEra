'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { getMiningContent, getMiningStatus, mine, getMiningHistory, getMySocialVerifications, submitSocialVerification, uploadScreenshot } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { Pickaxe, Clock, Coins, Play, History, Zap, X, Shield, FileText, ExternalLink, CheckCircle, AlertCircle, Upload, Loader2 } from 'lucide-react'
import Card from '@/components/ui/Card'

export default function MiningPage() {
  const router = useRouter()
  const [content, setContent] = useState(null)
  const [timeLeft, setTimeLeft] = useState('')
  const [showReadMore, setShowReadMore] = useState(false)
  const [showMineModal, setShowMineModal] = useState(false)
  const [hasRead, setHasRead] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [minedReward, setMinedReward] = useState('')
  const [showAlreadyMinedModal, setShowAlreadyMinedModal] = useState(false)
  const [status, setStatus] = useState(null)
  const [history, setHistory] = useState([])
  const [verifications, setVerifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [mining, setMining] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({ platform: '', socialUrl: '', screenshotUrl: '' })
  const [preview, setPreview] = useState(null)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      router.push('/signin')
      return
    }
    const fetchData = async () => {
      try {
        const [c, s, h, v] = await Promise.all([getMiningContent(), getMiningStatus(), getMiningHistory(), getMySocialVerifications()])
        setContent(c.success ? (c.data?.content || null) : null)
        setStatus(s.success ? s.data : null)
        setHistory(h.success ? (h.data?.data || h.data || []) : [])
        setVerifications(v.success ? (v.data?.data || v.data || []) : [])
        if (s.success && s.data?.socialLinks?.length) {
          setForm((f) => ({
            ...f,
            platform: s.data.socialLinks[0].platform,
            socialUrl: s.data.socialLinks[0].url,
          }))
        }
      } catch (err) {
        setError(err.response?.data?.error?.message || err.message || 'Failed to load mining')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [router])

  // 24h countdown timer for current mining card
  useEffect(() => {
    if (!status?.expiresAt) {
      setTimeLeft('')
      return
    }
    const tick = () => {
      const diff = new Date(status.expiresAt).getTime() - Date.now()
      if (diff <= 0) {
        setTimeLeft('Expired')
        return
      }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${h}h ${m}m ${s}s`)
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [status?.expiresAt])

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
      setError('Only JPG, PNG, or WEBP screenshots allowed')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }
    setPreview(URL.createObjectURL(file))
    handleUpload(file)
  }

  const handleUpload = async (file) => {
    setUploading(true)
    setError('')
    try {
      const result = await uploadScreenshot(file)
      if (!result.success) throw new Error(result.error?.message || 'Upload failed')
      setForm((f) => ({ ...f, screenshotUrl: result.data.url }))
      setMsg('Screenshot uploaded successfully')
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Upload failed')
      setForm((f) => ({ ...f, screenshotUrl: '' }))
    } finally {
      setUploading(false)
    }
  }

  const handleSubmitSocial = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    setMsg('')
    try {
      const result = await submitSocialVerification(form)
      if (!result.success) throw new Error(result.error?.message || 'Submission failed')
      setMsg('Screenshot submitted for admin review')
      const [s, v] = await Promise.all([getMiningStatus(), getMySocialVerifications()])
      setStatus(s.success ? s.data : null)
      setVerifications(v.success ? (v.data?.data || v.data || []) : [])
      setForm({
        platform: s.data?.socialLinks?.[0]?.platform || '',
        socialUrl: s.data?.socialLinks?.[0]?.url || '',
        screenshotUrl: '',
      })
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleMine = async (contentId) => {
    setMining(true)
    setError('')
    setMsg('')
    try {
      const result = await mine({ contentId, confirmation: true })
      if (!result.success) throw new Error(result.error?.message || 'Mining failed')
      setMinedReward(result.data.rewardCoins || '')
      setShowMineModal(false)
      setHasRead(false)
      setShowSuccessModal(true)
      const s = await getMiningStatus()
      setStatus(s.success ? s.data : null)
      const h = await getMiningHistory()
      setHistory(h.success ? (h.data?.data || h.data || []) : [])
    } catch (err) {
      const message = err.response?.data?.error?.message || err.message || 'Mining failed'
      if (message.toLowerCase().includes('already mined')) {
        setShowMineModal(false)
        setHasRead(false)
        setShowAlreadyMinedModal(true)
      } else {
        setError(message)
      }
    } finally {
      setMining(false)
    }
  }

  const openMineModal = () => {
    setHasRead(false)
    setShowMineModal(true)
  }

  const closeMineModal = () => {
    setShowMineModal(false)
    setHasRead(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-[#B48811]/30 border-t-[#EBD197] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 text-sm sm:text-base">Loading mining status...</p>
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
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10 shrink-0">
                <Pickaxe className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white">Mining</h1>
                <p className="text-slate-400 text-xs sm:text-sm">Earn rewards by mining content</p>
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

          {/* Mining Status Cards */}
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
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shadow-black/10 group-hover:scale-110 transition-transform duration-300 ${
                    status?.canMine
                      ? 'bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm'
                      : 'bg-linear-to-br from-[#BB9B49] via-[#B48811] to-[#EBD197] border border-[#B48811]/20 backdrop-blur-sm'
                  }`}>
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    status?.canMine
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-slate-700/50 text-slate-400 border border-slate-600/50'
                  }`}>
                    {status?.canMine ? 'Ready' : 'Wait'}
                  </div>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm font-medium mb-1">Mining Status</p>
                <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{status?.canMine ? 'Available' : 'Not Available'}</p>
                <p className="text-slate-500 text-xs mt-2">{status?.canMine ? 'You can mine now' : 'Wait for next mining window'}</p>
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
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-[#EBD197] text-xs sm:text-sm font-medium">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Next</span>
                  </div>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm font-medium mb-1">Next Mining</p>
                <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
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
              className="group relative bg-linear-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 sm:p-6 hover:border-[#B48811]/40 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-to-br from-[#B48811]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-black/10 group-hover:scale-110 transition-transform duration-300">
                    <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-[#EBD197] text-xs sm:text-sm font-medium">
                    <Coins className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Balance</span>
                  </div>
                </div>
                <p className="text-slate-400 text-xs sm:text-sm font-medium mb-1">Reward Coins</p>
                <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{status?.rewardCoins ?? '0'}</p>
                <p className="text-slate-500 text-xs mt-2">Total earned rewards</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Requirements Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mb-6 sm:mb-8"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10 shrink-0">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Mining Requirements</h2>
                <p className="text-slate-400 text-xs sm:text-sm">Complete the steps below to unlock mining</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
              {/* Membership */}
              <Card className={`p-4 sm:p-6 border ${status?.membershipActive ? 'border-green-500/30' : 'border-red-500/30'}`}>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${status?.membershipActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {status?.membershipActive ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-white">1. Active Membership</h3>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">
                      {status?.membershipActive
                        ? 'You have an active membership.'
                        : 'You must purchase the $50 membership before mining.'}
                    </p>
                    {!status?.membershipActive && (
                      <Button
                        onClick={() => router.push('/user/membership')}
                        variant="primary"
                        size="sm"
                        className="mt-3 rounded-full"
                      >
                        Buy Membership
                      </Button>
                    )}
                  </div>
                </div>
              </Card>

              {/* Social Verification */}
              <Card className={`p-4 sm:p-6 border ${status?.socialApproved ? 'border-green-500/30' : 'border-[#B48811]/30'}`}>
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${status?.socialApproved ? 'bg-green-500/10 text-green-400' : 'bg-[#B48811]/10 text-[#EBD197]'}`}>
                    {status?.socialApproved ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : <Upload className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-white">2. Social Follow</h3>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">
                      {status?.socialApproved
                        ? 'Your social follow is approved.'
                        : 'Follow our Facebook page OR Twitter/X account and upload a screenshot.'}
                    </p>

                    {!status?.socialApproved && verifications[0]?.status === 'REJECTED' && (
                      <div className="mt-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                        <p className="text-red-400 text-xs sm:text-sm font-medium">
                          Previous submission rejected
                        </p>
                        <p className="text-red-300 text-xs mt-1">
                          Please follow properly first. Admin will verify, only then mining will start.
                        </p>
                        {verifications[0]?.adminNote && (
                          <p className="text-red-300 text-xs mt-1">
                            Admin note: {verifications[0].adminNote}
                          </p>
                        )}
                      </div>
                    )}

                    {!status?.socialApproved && status?.socialLinks?.length > 0 && (
                      <div className="flex flex-wrap gap-2 sm:gap-3 mt-3">
                        {status.socialLinks.map((link) => (
                          <a
                            key={link.platform}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-[#EBD197] hover:text-[#BB9B49] text-xs sm:text-sm"
                          >
                            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                            Open {link.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Social Submission Form */}
            {!status?.socialApproved && (
              <Card className="p-4 sm:p-6 border border-[#B48811]/30">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Upload Follow Screenshot</h3>
                <form onSubmit={handleSubmitSocial} className="space-y-4">
                  <div>
                    <label className="block text-slate-400 text-xs sm:text-sm mb-2">Select Platform</label>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      {status?.socialLinks?.map((link) => (
                        <button
                          key={link.platform}
                          type="button"
                          onClick={() => setForm({ ...form, platform: link.platform, socialUrl: link.url })}
                          className={`px-3 sm:px-4 py-2 rounded-xl border text-xs sm:text-sm font-medium transition-colors ${
                            form.platform === link.platform
                              ? 'bg-[#B48811]/20 border-[#B48811] text-[#EBD197]'
                              : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-[#B48811]/50'
                          }`}
                        >
                          {link.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* <div>
                    <label className="block text-slate-400 text-sm mb-2">Social Page URL (pre-filled)</label>
                    <input
                      type="text"
                      value={form.socialUrl}
                      onChange={(e) => setForm({ ...form, socialUrl: e.target.value })}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#B48811]"
                      placeholder="https://www.facebook.com/... or https://x.com/..."
                    />
                  </div> */}
                  <div>
                    <label className="block text-slate-400 text-xs sm:text-sm mb-2">Upload Screenshot</label>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp"
                      onChange={handleFileChange}
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-3 sm:px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-[#B48811]/20 file:text-[#EBD197] hover:file:bg-[#B48811]/30"
                    />
                    {uploading && (
                      <p className="text-[#EBD197] text-xs mt-2 flex items-center gap-2">
                        <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                      </p>
                    )}
                    {preview && (
                      <div className="mt-3">
                        <img src={preview} alt="Preview" className="max-h-32 sm:max-h-40 w-auto rounded-xl border border-slate-700" />
                      </div>
                    )}
                    {/* <input
                      type="text"
                      value={form.screenshotUrl}
                      onChange={(e) => setForm({ ...form, screenshotUrl: e.target.value })}
                      className="w-full mt-3 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#B48811]"
                      placeholder="Backend screenshot URL will appear here"
                      required
                      readOnly={!form.screenshotUrl}
                    /> */}
                    <p className="text-slate-500 text-xs mt-2">Select a screenshot image (JPG/PNG/WEBP, max 5MB). It will be uploaded to the server.</p>
                  </div>
                  <Button
                    type="submit"
                    disabled={submitting || !form.screenshotUrl}
                    variant="primary"
                    className="rounded-full w-full sm:w-auto"
                  >
                    {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : <><Upload className="w-4 h-4 mr-2" /> Submit for Review</>}
                  </Button>
                </form>

                {verifications.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-slate-700/50">
                    <h4 className="text-white font-medium mb-3 text-sm sm:text-base">Previous Submissions</h4>
                    <div className="space-y-2">
                      {verifications.map((v) => (
                        <div key={v.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-slate-800/30">
                          <div className="flex-1 min-w-0">
                            <p className="text-white text-xs sm:text-sm">{v.platform}</p>
                            <p className="text-slate-500 text-xs">{v.status}</p>
                            {v.adminNote && (
                              <p className="mt-1 text-red-400 text-xs">
                                Note: {v.adminNote}
                              </p>
                            )}
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium self-start sm:self-center ${
                            v.status === 'APPROVED' ? 'bg-green-500/10 text-green-400' :
                            v.status === 'REJECTED' ? 'bg-red-500/10 text-red-400' :
                            'bg-[#B48811]/10 text-[#EBD197]'
                          }`}>
                            {v.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            )}
          </motion.div>

          {/* Mining Content Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-6 sm:mb-8"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10 shrink-0">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Mining Content</h2>
                <p className="text-slate-400 text-xs sm:text-sm">Available content to mine for rewards</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {!content ? (
                <Card className="p-6 sm:p-8 text-center md:col-span-2">
                  <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500 text-sm sm:text-base">No mining card available right now. Please check back later.</p>
                </Card>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  whileHover="hover"
                  whileTap={{ scale: 0.98 }}
                  className="group relative bg-linear-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 sm:p-6 hover:border-[#B48811]/40 transition-all duration-300 overflow-hidden md:col-span-2"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-[#B48811]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative">
                    <div className="flex items-start justify-between mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-black/10 group-hover:scale-110 transition-transform duration-300 shrink-0">
                        <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-1 text-[#EBD197] text-xs sm:text-sm font-medium">
                        <Coins className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{content.rewardCoins}</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-base sm:text-lg text-white mb-2">{content.title}</h3>
                    <p className="text-slate-400 text-xs sm:text-sm mb-2 line-clamp-3">{content.content?.substring(0, 150)}...</p>
                    {content.content && content.content.length > 150 && (
                      <button
                        onClick={() => setShowReadMore(true)}
                        className="text-[#EBD197] hover:text-[#BB9B49] text-xs sm:text-sm mb-4 inline-flex items-center gap-1"
                      >
                        Read More
                      </button>
                    )}

                    <div className="flex items-center gap-2 mb-4 text-xs sm:text-sm">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-[#EBD197]" />
                      <span className="text-slate-400">Expires in:</span>
                      <span className="text-[#EBD197] font-mono font-medium">{timeLeft || '...'}</span>
                    </div>

                    <Button
                      onClick={openMineModal}
                      disabled={mining || !status?.canMine}
                      variant="primary"
                      className="rounded-full w-full"
                      size="sm"
                    >
                      {mining ? 'Mining...' : <><Play className="w-4 h-4 mr-2" /> Mine Now</>}
                    </Button>
                    {!status?.canMine && status?.socialApproved && status?.membershipActive && (
                      <p className="text-slate-500 text-xs mt-2 text-center">
                        {status?.lastMinedAt ? 'You already mined this card. Wait for the next one.' : 'Mining will be available soon.'}
                      </p>
                    )}
                  </div>
                </motion.div>
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
              className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10 shrink-0">
                <History className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Mining History</h2>
                <p className="text-slate-400 text-xs sm:text-sm">Your past mining activities</p>
              </div>
            </motion.div>

            <Card className="overflow-hidden">
              {history.length === 0 ? (
                <div className="p-6 sm:p-8 text-center">
                  <History className="w-10 h-10 sm:w-12 sm:h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-500 text-sm sm:text-base">No mining history found</p>
                </div>
              ) : (
                <>
                  {/* Mobile Card Layout */}
                  <div className="sm:hidden divide-y divide-slate-700/50">
                    {history.map((h, i) => (
                      <div key={i} className="p-4 hover:bg-slate-800/30 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 border rounded-lg flex items-center justify-center shrink-0 ${
                            h.status === 'MISSED'
                              ? 'bg-red-500/10 border-red-500/20'
                              : 'bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border-[#B48811]/20'
                          }`}>
                            {h.status === 'MISSED'
                              ? <X className="w-5 h-5 text-red-400" />
                              : <Coins className="w-5 h-5 text-white" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-white text-sm">
                              {h.status === 'MISSED' ? 'Missed' : 'Reward Earned'}
                              {h.content?.title ? ` - ${h.content.title}` : ''}
                            </p>
                            <p className="text-slate-400 text-xs mt-1">{h.createdAt ? new Date(h.createdAt).toLocaleString() : '-'}</p>
                            <div className="mt-2">
                              {h.status === 'MISSED' ? (
                                <p className="text-xs font-bold text-red-400">MISSED - Card expired</p>
                              ) : (
                                <p className="text-lg font-bold text-[#EBD197]">{h.rewardCoins} Coins</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table Layout */}
                  <div className="hidden sm:block divide-y divide-slate-700/50">
                    {history.map((h, i) => (
                      <div key={i} className="p-4 hover:bg-slate-800/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 border rounded-lg flex items-center justify-center ${
                              h.status === 'MISSED'
                                ? 'bg-red-500/10 border-red-500/20'
                                : 'bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border-[#B48811]/20'
                            }`}>
                              {h.status === 'MISSED'
                                ? <X className="w-5 h-5 text-red-400" />
                                : <Coins className="w-5 h-5 text-white" />}
                            </div>
                            <div>
                              <p className="font-medium text-white text-sm">
                                {h.status === 'MISSED' ? 'Missed' : 'Reward Earned'}
                                {h.content?.title ? ` - ${h.content.title}` : ''}
                              </p>
                              <p className="text-slate-400 text-xs sm:text-sm">{h.createdAt ? new Date(h.createdAt).toLocaleString() : '-'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            {h.status === 'MISSED' ? (
                              <>
                                <p className="text-sm font-bold text-red-400">MISSED</p>
                                <p className="text-slate-400 text-xs">Card expired</p>
                              </>
                            ) : (
                              <>
                                <p className="text-xl sm:text-2xl font-bold text-[#EBD197]">{h.rewardCoins}</p>
                                <p className="text-slate-400 text-xs">Coins</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Read More Modal */}
      {showReadMore && content && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm" onClick={() => setShowReadMore(false)}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[85vh] sm:max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700">
              <h3 className="text-lg sm:text-xl font-bold text-white">{content.title}</h3>
              <button onClick={() => setShowReadMore(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <p className="text-slate-300 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{content.content}</p>
            </div>
            <div className="p-4 border-t border-slate-700 flex justify-end">
              <Button onClick={() => setShowReadMore(false)} variant="outline" className="rounded-full">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mine Confirmation Modal */}
      {showMineModal && content && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm" onClick={closeMineModal}>
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] rounded-xl flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white truncate">{content.title}</h3>
              </div>
              <button onClick={closeMineModal} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="p-4 sm:p-6 overflow-y-auto flex-1">
              <div className="flex items-center gap-2 mb-4 text-xs sm:text-sm">
                <Coins className="w-3 h-3 sm:w-4 sm:h-4 text-[#EBD197]" />
                <span className="text-slate-400">Reward:</span>
                <span className="text-[#EBD197] font-bold">{content.rewardCoins} Coins</span>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
                <p className="text-slate-300 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{content.content}</p>
              </div>
              <label className="flex items-start gap-3 cursor-pointer p-3 rounded-xl bg-slate-800/30 border border-slate-700 hover:border-[#B48811]/40 transition-colors">
                <input
                  type="checkbox"
                  checked={hasRead}
                  onChange={(e) => setHasRead(e.target.checked)}
                  className="w-5 h-5 mt-0.5 accent-[#B48811] cursor-pointer shrink-0"
                />
                <span className="text-slate-300 text-xs sm:text-sm">
                  I have read and understood the content. I confirm that I want to mine this card.
                </span>
              </label>
            </div>
            <div className="p-4 border-t border-slate-700 flex flex-col sm:flex-row gap-3 justify-end">
              <Button onClick={closeMineModal} variant="outline" className="rounded-full w-full sm:w-auto">
                Cancel
              </Button>
              <Button
                onClick={() => handleMine(content.id)}
                disabled={!hasRead || mining}
                variant="primary"
                className="rounded-full w-full sm:w-auto"
              >
                {mining ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Mining...</> : <><Play className="w-4 h-4 mr-2" /> Submit & Mine</>}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mining Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm" onClick={() => setShowSuccessModal(false)}>
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 sm:p-8 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Mining Completed Successfully!</h3>
              <p className="text-slate-400 text-xs sm:text-sm mb-4">Your mining reward has been credited to your Widget A wallet.</p>
              {minedReward && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                  <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-[#EBD197]" />
                  <span className="text-[#EBD197] font-bold text-base sm:text-lg">+{minedReward} Coins</span>
                </div>
              )}
              <div className="flex justify-center">
                <Button onClick={() => setShowSuccessModal(false)} variant="primary" className="rounded-full w-full sm:w-auto">
                  <CheckCircle className="w-4 h-4 mr-2" /> Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Already Mined Modal */}
      {showAlreadyMinedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm" onClick={() => setShowAlreadyMinedModal(false)}>
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-md w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 sm:p-8 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center">
                <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Already Mined</h3>
              <p className="text-slate-400 text-xs sm:text-sm mb-6">
                You have already mined this card. You cannot mine the same card again.
                Please wait for the next mining card to become available.
              </p>
              <div className="flex justify-center">
                <Button onClick={() => setShowAlreadyMinedModal(false)} variant="primary" className="rounded-full w-full sm:w-auto">
                  <CheckCircle className="w-4 h-4 mr-2" /> OK
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
