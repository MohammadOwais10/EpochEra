'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { getMyTickets, getTicket, createTicket, sendTicketMessage } from '@/lib/api'
import { Button } from '@/components/ui/Button'

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

  if (loading) return <div className="p-8 text-white">Loading...</div>

  return (
    <div className="p-8 text-white w-full">
      <h1 className="text-3xl font-bold mb-6">Support Tickets</h1>
      {error && <p className="text-red-400 mb-4">{error}</p>}
      {msg && <p className="text-green-400 mb-4">{msg}</p>}

      <form onSubmit={handleCreate} className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Create New Ticket</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-[#B48811] focus:outline-none"
            required
          />
          <input
            type="text"
            placeholder="Describe your query"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-[#B48811] focus:outline-none"
            required
          />
        </div>
        <Button type="submit" variant="primary" className="rounded-full">Create Ticket</Button>
      </form>

      <div className="grid md:grid-cols-3 gap-6 h-[600px]">
        <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl overflow-hidden flex flex-col">
          <h2 className="text-lg font-semibold p-4 border-b border-zinc-800">My Tickets</h2>
          <div className="overflow-y-auto flex-1">
            {tickets.length === 0 ? (
              <p className="p-4 text-zinc-500">No tickets found.</p>
            ) : (
              tickets.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelected(t)}
                  className={`w-full text-left p-4 border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors ${selected?.id === t.id ? 'bg-zinc-800' : ''}`}
                >
                  <p className="font-medium truncate">{t.subject}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${t.status === 'OPEN' ? 'bg-emerald-500/20 text-emerald-400' : t.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400' : 'bg-zinc-700 text-zinc-300'}`}>{t.status}</span>
                    <span className="text-zinc-500 text-xs">{t.updatedAt ? new Date(t.updatedAt).toLocaleDateString() : '-'}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="md:col-span-2 bg-zinc-900/80 border border-zinc-700 rounded-2xl overflow-hidden flex flex-col">
          {selected ? (
            <>
              <div className="p-4 border-b border-zinc-800">
                <h2 className="text-lg font-semibold">{selected.subject}</h2>
                <p className="text-zinc-500 text-sm">{selected.status}</p>
              </div>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-2xl ${m.sender === 'USER' ? 'bg-[#B48811] text-white rounded-br-none' : 'bg-zinc-800 text-zinc-200 rounded-bl-none'}`}>
                      <p className="text-sm">{m.message}</p>
                      <p className="text-xs opacity-70 mt-1 text-right">{new Date(m.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleReply} className="p-4 border-t border-zinc-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Type your reply..."
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-[#B48811] focus:outline-none"
                  required
                />
                <Button type="submit" variant="primary" className="rounded-full">Send</Button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-500">
              Select a ticket to view conversation
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
