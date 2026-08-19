'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { getAdminTickets, getTicket, sendTicketMessage, updateTicketStatus } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { MessageSquare, Send, CheckCircle, AlertCircle, Filter } from 'lucide-react'

export default function AdminTicketsPage() {
  const router = useRouter()
  const [tickets, setTickets] = useState([])
  const [selected, setSelected] = useState(null)
  const [messages, setMessages] = useState([])
  const [reply, setReply] = useState('')
  const [status, setStatus] = useState('')
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      router.push('/signin')
      return
    }
    fetchTickets()
  }, [router, filter])

  useEffect(() => {
    if (selected) {
      fetchMessages(selected.id)
      setStatus(selected.status)
    }
  }, [selected])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  const fetchTickets = async () => {
    try {
      const query = filter ? `status=${filter}` : ''
      const result = await getAdminTickets(query)
      setTickets(result.success ? (result.data?.data || result.data || []) : [])
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to load tickets')
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async (id) => {
    try {
      const result = await getTicket(id)
      if (result.success) {
        setMessages(result.data.messages || [])
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to load messages')
    }
  }

  const handleReply = async (e) => {
    e.preventDefault()
    if (!selected || !reply.trim()) return
    setError('')
    setMsg('')
    try {
      const result = await sendTicketMessage(selected.id, { message: reply })
      if (!result.success) throw new Error(result.error?.message || 'Failed to send reply')
      setReply('')
      await fetchMessages(selected.id)
      await fetchTickets()
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to send reply')
    }
  }

  const handleStatus = async (e) => {
    e.preventDefault()
    if (!selected || !status) return
    setError('')
    setMsg('')
    try {
      const result = await updateTicketStatus(selected.id, { status })
      if (!result.success) throw new Error(result.error?.message || 'Failed to update status')
      setMsg('Status updated')
      setSelected((prev) => prev ? { ...prev, status } : null)
      await fetchTickets()
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to update status')
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
        <p className="text-white font-semibold text-base sm:text-lg mb-1">Loading Support Tickets</p>
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
        className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-black/10 shrink-0">
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-linear-to-r from-white to-slate-200 bg-clip-text text-transparent">Support Tickets</h1>
            <p className="text-slate-400 text-xs sm:text-sm">Manage user support requests</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:ml-auto">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total: {tickets.length}</span>
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

      {/* Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-wrap gap-2 mb-4 sm:mb-6"
      >
        {['', 'OPEN', 'PENDING', 'CLOSED'].map((s) => (
          <Button
            key={s || 'all'}
            onClick={() => setFilter(s)}
            variant={filter === s ? 'primary' : 'outline'}
            size="sm"
            className={`rounded-full text-xs sm:text-sm ${filter === s ? 'bg-linear-to-r from-[#EBD197] to-[#B48811] text-slate-950 border-0' : 'hover:bg-slate-700/50'}`}
          >
            {s || 'All'}
          </Button>
        ))}
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid md:grid-cols-3 gap-4 sm:gap-6 h-150 sm:h-175"
      >
        {/* Tickets List */}
        <Card className="border-[#B48811]/30 overflow-hidden flex-col hidden md:flex">
          <div className="p-3 sm:p-4 border-b border-slate-700/50">
            <h2 className="text-base sm:text-lg font-semibold text-white">Tickets</h2>
          </div>
          <div className="overflow-y-auto flex-1">
            {tickets.length === 0 ? (
              <p className="p-4 text-slate-500 text-center">No tickets found.</p>
            ) : (
              tickets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelected(t)}
                    className={`w-full text-left p-3 sm:p-4 border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors ${selected?.id === t.id ? 'bg-slate-800/50 border-l-2 border-l-[#B48811]' : ''}`}
                >
                  <p className="font-medium text-white truncate text-sm sm:text-base">{t.subject}</p>
                  <p className="text-slate-500 text-xs">{t.user?.firstName} {t.user?.lastName} — {t.user?.email}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      t.status === 'OPEN' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      t.status === 'PENDING' ? 'bg-[#EBD197]/10 text-[#EBD197] border-[#B48811]/20' : 
                      'bg-slate-700/50 text-slate-300 border-slate-600/30'
                    }`}>{t.status}</span>
                    <span className="text-slate-500 text-xs">{t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : '-'}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </Card>

        {/* Mobile Ticket Selector */}
        <div className="md:hidden">
          <Card className="border-[#B48811]/30 p-3 sm:p-4 mb-4">
            <label className="text-slate-400 text-xs sm:text-sm mb-2 block">Select Ticket</label>
            <select
              value={selected?.id || ''}
              onChange={(e) => {
                const ticket = tickets.find(t => t.id === e.target.value)
                setSelected(ticket || null)
              }}
              className="w-full px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-[#B48811]/50"
            >
              <option value="">Choose a ticket...</option>
              {tickets.map((t) => (
                <option key={t.id} value={t.id}>{t.subject}</option>
              ))}
            </select>
          </Card>
        </div>

        {/* Conversation */}
        <Card className="md:col-span-2 border-[#B48811]/30 overflow-hidden flex flex-col">
          {selected ? (
            <>
              <div className="p-3 sm:p-4 border-b border-slate-700/50 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-semibold text-white truncate">{selected.subject}</h2>
                  <p className="text-slate-500 text-xs sm:text-sm">{selected.user?.firstName} {selected.user?.lastName} — {selected.user?.email}</p>
                </div>
                <form onSubmit={handleStatus} className="flex gap-2 items-center shrink-0">
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="px-2 sm:px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700/50 text-white text-xs sm:text-sm focus:outline-none focus:border-[#B48811]/50"
                  >
                    <option value="OPEN">OPEN</option>
                    <option value="PENDING">PENDING</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                  <Button type="submit" variant="primary" size="sm" className="rounded-full bg-linear-to-r from-[#EBD197] to-[#B48811] text-slate-950 border-0 text-xs sm:text-sm">Update</Button>
                </form>
              </div>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.sender === 'ADMIN' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] sm:max-w-[70%] p-2 sm:p-3 rounded-2xl ${m.sender === 'ADMIN' ? 'bg-linear-to-r from-[#EBD197] to-[#B48811] text-white rounded-br-none' : 'bg-slate-800/50 text-slate-200 rounded-bl-none border border-slate-700/30'}`}>
                      <p className="text-xs sm:text-sm">{m.message}</p>
                      <p className="text-xs opacity-70 mt-1 text-right">{new Date(m.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleReply} className="p-3 sm:p-4 border-t border-slate-700/50 flex gap-2">
                <input
                  type="text"
                  placeholder="Type your reply..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:border-[#B48811]/50 focus:ring-1 focus:ring-[#B48811]/50 focus:outline-none transition-all text-sm"
                  required
                />
                <Button type="submit" variant="primary" className="rounded-full bg-linear-to-r from-[#EBD197] to-[#B48811] text-slate-950 border-0 flex items-center gap-2 px-3 sm:px-4">
                  <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Send</span>
                </Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-500">
              <div className="text-center p-4">
                <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-slate-600" />
                <p className="text-sm sm:text-base">Select a ticket to view conversation</p>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
