'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { getMyTickets, getTicket, createTicket, sendTicketMessage } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import { MessageCircle, Plus, Send, Clock, CheckCircle, AlertCircle, X, Shield, Inbox } from 'lucide-react'
import Card from '@/components/ui/Card'

export default function UserTicketsPage() {
  const router = useRouter()
  const [tickets, setTickets] = useState([])
  const [selected, setSelected] = useState(null)
  const [messages, setMessages] = useState([])
  const [subject, setSubject] = useState('')
  const [newMessage, setNewMessage] = useState('')
  const [reply, setReply] = useState('')
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
  }, [router])

  useEffect(() => {
    if (selected) {
      fetchMessages(selected.id)
    }
  }, [selected])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  const fetchTickets = async () => {
    try {
      const result = await getMyTickets()
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

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    setMsg('')
    try {
      const result = await createTicket({ subject, message: newMessage })
      if (!result.success) throw new Error(result.error?.message || 'Failed to create ticket')
      setMsg('Ticket created successfully')
      setSubject('')
      setNewMessage('')
      await fetchTickets()
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to create ticket')
    }
  }

  const handleReply = async (e) => {
    e.preventDefault()
    if (!selected || !reply.trim()) return
    setError('')
    setMsg('')
    try {
      const result = await sendTicketMessage(selected.id, { message: reply })
      if (!result.success) throw new Error(result.error?.message || 'Failed to send message')
      setReply('')
      await fetchMessages(selected.id)
      await fetchTickets()
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to send message')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#B48811]/30 border-t-[#EBD197] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading support tickets...</p>
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
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Support Tickets</h1>
                <p className="text-slate-400 text-sm">Get help from our support team</p>
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

          {/* Create New Ticket Card */}
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
                    <Plus className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Create New Ticket</h2>
                    <p className="text-slate-400 text-sm mt-1">Submit a new support request</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Subject</label>
                  <input
                    type="text"
                    placeholder="Brief description of your issue"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:border-[#B48811] focus:outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-2">Message</label>
                  <textarea
                    placeholder="Describe your issue in detail..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:border-[#B48811] focus:outline-none transition-colors resize-none"
                    required
                  />
                </div>
                <Button type="submit" variant="primary" className="rounded-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Ticket
                </Button>
              </form>
            </Card>
          </motion.div>

          {/* Tickets Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid md:grid-cols-3 gap-6 h-[600px]"
          >
            {/* Ticket List */}
            <Card className="overflow-hidden flex flex-col">
              <div className="p-4 border-b border-slate-700/50 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] border border-[#B48811]/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Inbox className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-white">My Tickets</h2>
              </div>
              <div className="overflow-y-auto flex-1">
                {tickets.length === 0 ? (
                  <div className="p-8 text-center">
                    <Inbox className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-500">No tickets found</p>
                  </div>
                ) : (
                  tickets.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelected(t)}
                      className={`w-full text-left p-4 border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors ${selected?.id === t.id ? 'bg-slate-800/50 border-l-2 border-l-[#EBD197]' : ''}`}
                    >
                      <p className="font-medium text-white truncate">{t.subject}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          t.status === 'OPEN' 
                            ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                            : t.status === 'PENDING' 
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                            : 'bg-slate-700/50 text-slate-400 border border-slate-600/50'
                        }`}>
                          {t.status}
                        </span>
                        <span className="text-slate-500 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : '-'}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </Card>

            {/* Chat Interface */}
            <Card className="md:col-span-2 overflow-hidden flex flex-col">
              {selected ? (
                <>
                  <div className="p-4 border-b border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-white">{selected.subject}</h2>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            selected.status === 'OPEN' 
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                              : selected.status === 'PENDING' 
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                              : 'bg-slate-700/50 text-slate-400 border border-slate-600/50'
                          }`}>
                            {selected.status}
                          </span>
                          <span className="text-slate-500 text-xs flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {selected.updatedAt ? new Date(selected.updatedAt).toLocaleString() : '-'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((m) => (
                      <div key={m.id} className={`flex ${m.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3 rounded-2xl ${
                          m.sender === 'USER' 
                            ? 'bg-gradient-to-br from-[#EBD197] via-[#B48811] to-[#BB9B49] text-white rounded-br-none' 
                            : 'bg-slate-800/50 text-slate-200 rounded-bl-none border border-slate-700/50'
                        }`}>
                          <p className="text-sm">{m.message}</p>
                          <p className="text-xs opacity-70 mt-1 text-right flex items-center justify-end gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(m.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleReply} className="p-4 border-t border-slate-700/50 flex gap-2">
                    <input
                      type="text"
                      placeholder="Type your reply..."
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white focus:border-[#B48811] focus:outline-none transition-colors"
                      required
                    />
                    <Button type="submit" variant="primary" className="rounded-full">
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-500">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p>Select a ticket to view conversation</p>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
