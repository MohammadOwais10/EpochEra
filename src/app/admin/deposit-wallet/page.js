'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAdminDepositWallet, setAdminDepositWallet } from '@/lib/api'
import { Button } from '@/components/ui/Button'

export default function AdminDepositWalletPage() {
  const router = useRouter()
  const [wallet, setWallet] = useState(null)
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
        const result = await getAdminDepositWallet()
        setWallet(result.success ? result.data : null)
      } catch (err) {
        setError(err.response?.data?.error?.message || err.message || 'Failed to load deposit wallet')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [router])

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setMsg('')
    try {
      const result = await setAdminDepositWallet({ address })
      if (!result.success) throw new Error(result.error?.message || 'Save failed')
      setMsg('Deposit wallet updated')
      const r = await getAdminDepositWallet()
      setWallet(r.success ? r.data : null)
      setAddress('')
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-8 text-white">Loading...</div>

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-6">Deposit Wallet</h1>
      {error && <p className="text-red-400 mb-4">{error}</p>}
      {msg && <p className="text-green-400 mb-4">{msg}</p>}

      <div className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6 mb-8">
        <p className="text-zinc-400 text-sm">Current Deposit Address</p>
        <p className="text-xl font-mono mt-2 break-all">{wallet?.address || 'Not set'}</p>
        {wallet?.updatedAt && <p className="text-zinc-500 text-sm mt-2">Updated: {new Date(wallet.updatedAt).toLocaleString()}</p>}
      </div>

      <form onSubmit={handleSave} className="bg-zinc-900/80 border border-zinc-700 rounded-2xl p-6 space-y-4">
        <input
          type="text"
          placeholder="0x... BSC/EVM address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-[#B48811] focus:outline-none"
          required
        />
        <Button type="submit" disabled={saving} variant="primary" className="rounded-full">
          {saving ? 'Saving...' : 'Update Address'}
        </Button>
      </form>
    </div>
  )
}
