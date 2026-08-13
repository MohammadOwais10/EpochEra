'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { listAdminMiningContent, createAdminMiningContent, updateAdminMiningContent, deleteAdminMiningContent } from '@/lib/api'
import { Button } from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import { FileText, Coins, Plus, Edit, Trash2, CheckCircle, AlertCircle } from 'lucide-react'

export default function AdminMiningContentPage() {
  const router = useRouter()
  const [content, setContent] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({ title: '', content: '', rewardCoins: '', isActive: true })
  const [editing, setEditing] = useState(null)

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
      const result = await listAdminMiningContent()
      setContent(result.success ? (result.data?.data || result.data || []) : [])
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMsg('')
    try {
      const data = { ...form, rewardCoins: form.rewardCoins.toString(), isActive: Boolean(form.isActive) }
      if (editing) {
        await updateAdminMiningContent(editing, data)
      } else {
        await createAdminMiningContent(data)
      }
      setMsg(editing ? 'Content updated' : 'Content created')
      setForm({ title: '', content: '', rewardCoins: '', isActive: true })
      setEditing(null)
      fetchData()
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to save content')
    }
  }

  const handleEdit = (item) => {
    setEditing(item.id)
    setForm({
      title: item.title,
      content: item.content,
      rewardCoins: item.rewardCoins,
      isActive: item.isActive,
    })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this content?')) return
    try {
      await deleteAdminMiningContent(id)
      fetchData()
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Delete failed')
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
        <p className="text-white font-semibold text-lg mb-1">Loading Mining Content</p>
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
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">Mining Content</h1>
          <p className="text-slate-400 text-sm">Manage mining tasks and rewards</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Total: {content.length}</span>
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

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6"
      >
        <Card className="p-6 border-[#B48811]/30">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            {editing ? <Edit className="w-5 h-5 text-[#EBD197]" /> : <Plus className="w-5 h-5 text-[#EBD197]" />}
            {editing ? 'Edit Content' : 'Create New Content'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:border-[#B48811]/50 focus:ring-1 focus:ring-[#B48811]/50 focus:outline-none transition-all"
              required
            />
            <textarea
              placeholder="Content"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white h-24 placeholder-slate-400 focus:border-[#B48811]/50 focus:ring-1 focus:ring-[#B48811]/50 focus:outline-none transition-all resize-none"
              required
            />
            <input
              type="text"
              placeholder="Reward Coins"
              value={form.rewardCoins}
              onChange={(e) => setForm({ ...form, rewardCoins: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 focus:border-[#B48811]/50 focus:ring-1 focus:ring-[#B48811]/50 focus:outline-none transition-all"
              required
            />
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4 accent-[#B48811]"
              />
              Active
            </label>
            <div className="flex gap-2">
              <Button type="submit" variant="primary" className="rounded-full bg-gradient-to-r from-[#EBD197] to-[#B48811] text-slate-950 border-0">
                {editing ? 'Update' : 'Create'}
              </Button>
              {editing && (
                <Button 
                  type="button" 
                  onClick={() => { setEditing(null); setForm({ title: '', content: '', rewardCoins: '', isActive: true }) }}
                  variant="outline" 
                  className="rounded-full hover:bg-slate-700/50"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Card>
      </motion.div>

      {/* Content List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-[#B48811]/30 overflow-hidden">
          {content.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500">No content found.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-700/30">
              {content.map((c) => (
                <li key={c.id} className="p-4 hover:bg-slate-800/30 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-white">{c.title}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          c.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-700/50 text-slate-400 border-slate-600/30'
                        }`}>
                          {c.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-slate-500 text-sm flex items-center gap-1">
                        <Coins className="w-4 h-4 text-[#EBD197]" />
                        Reward: {c.rewardCoins}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => handleEdit(c)} variant="outline" size="sm" className="rounded-full hover:bg-slate-700/50">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button onClick={() => handleDelete(c.id)} variant="outline" size="sm" className="rounded-full hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </motion.div>
    </div>
  )
}
