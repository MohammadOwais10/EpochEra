'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { listAdminMiningContent, createAdminMiningContent, updateAdminMiningContent, deleteAdminMiningContent } from '@/lib/api'
import { Button } from '@/components/ui/Button'

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

  if (loading) return <div className="p-8 text-white">Loading...</div>

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Mining Content</h1>
      {error && <p className="text-red-400 mb-4">{error}</p>}
      {msg && <p className="text-green-400 mb-4">{msg}</p>}

      <form onSubmit={handleSubmit} className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6 mb-8 space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-[#B48811] focus:outline-none"
          required
        />
        <textarea
          placeholder="Content"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white h-24 focus:border-[#B48811] focus:outline-none"
          required
        />
        <input
          type="text"
          placeholder="Reward Coins"
          value={form.rewardCoins}
          onChange={(e) => setForm({ ...form, rewardCoins: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-[#B48811] focus:outline-none"
          required
        />
        <label className="flex items-center gap-2 text-zinc-300">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="w-4 h-4"
          />
          Active
        </label>
        <Button type="submit" variant="primary" className="rounded-full">
          {editing ? 'Update' : 'Create'}
        </Button>
      </form>

      <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl overflow-hidden">
        {content.length === 0 ? (
          <p className="p-6 text-zinc-500">No content found.</p>
        ) : (
          <ul className="divide-y divide-zinc-800">
            {content.map((c) => (
              <li key={c.id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold text-zinc-300">{c.title}</p>
                  <p className="text-zinc-500 text-sm">Reward: {c.rewardCoins} — {c.isActive ? 'Active' : 'Inactive'}</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleEdit(c)} variant="outline" size="sm" className="rounded-full">Edit</Button>
                  <Button onClick={() => handleDelete(c.id)} variant="outline" size="sm" className="rounded-full">Delete</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
