'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAdminMlmConfig, updateAdminMlmConfig } from '@/lib/api'
import { Button } from '@/components/ui/Button'

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

  if (loading) return <div className="p-8 text-white">Loading...</div>

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">MLM Configuration</h1>
      {error && <p className="text-red-400 mb-4">{error}</p>}

      {editing && (
        <form onSubmit={handleSave} className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6 mb-8 space-y-4">
          <p className="text-zinc-300 font-bold">Generation {editing}</p>
          <input
            type="text"
            placeholder="USD Commission"
            value={form.usdCommission}
            onChange={(e) => setForm({ ...form, usdCommission: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-[#B48811] focus:outline-none"
          />
          <input
            type="text"
            placeholder="Epoch Coin Reward"
            value={form.epochCoinReward}
            onChange={(e) => setForm({ ...form, epochCoinReward: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-[#B48811] focus:outline-none"
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
          <div className="flex gap-2">
            <Button type="submit" variant="primary" className="rounded-full">Save</Button>
            <Button onClick={() => setEditing(null)} variant="outline" className="rounded-full">Cancel</Button>
          </div>
        </form>
      )}

      <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-800 text-zinc-300">
            <tr>
              <th className="p-4">Generation</th>
              <th className="p-4">USD Commission</th>
              <th className="p-4">Epoch Coin</th>
              <th className="p-4">Active</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {config.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-zinc-500">No MLM config found.</td>
              </tr>
            ) : (
              config.map((c) => (
                <tr key={c.generation} className="border-t border-zinc-800">
                  <td className="p-4">{c.generation}</td>
                  <td className="p-4">{c.usdCommission}</td>
                  <td className="p-4">{c.epochCoinReward}</td>
                  <td className="p-4">{c.isActive ? 'Yes' : 'No'}</td>
                  <td className="p-4">
                    <Button onClick={() => handleEdit(c)} variant="outline" size="sm" className="rounded-full">Edit</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
