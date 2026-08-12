'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { register } from '@/lib/api'

export default function SignUp() {
  const router = useRouter()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    sponsorReferralCode: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const generateUsername = (firstName, lastName, email) => {
    const raw = (firstName + lastName).toLowerCase().replace(/[^a-z0-9_.]/g, '') || email.split('@')[0].toLowerCase().replace(/[^a-z0-9_.]/g, '')
    const base = raw.slice(0, 20)
    const suffix = Math.floor(Math.random() * 10000)
    const username = `${base}_${suffix}`
    return username.length < 3 ? `${username}user` : username
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const username = generateUsername(form.firstName, form.lastName, form.email)
      const result = await register({ ...form, username })
      if (!result.success) throw new Error(result.error?.message || 'Registration failed')
      setMessage(result.data.message)
      setTimeout(() => router.push('/signin'), 2000)
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-zinc-700 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white text-center mb-2">Get Started</h1>
        <p className="text-gray-400 text-center mb-8">Create your EpochEra account</p>
        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
        {message && <p className="text-green-400 text-sm text-center mb-4">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                required
                value={form.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-[#B48811] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                required
                value={form.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-[#B48811] focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-[#B48811] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-[#B48811] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Sponsor Referral Code (optional)</label>
            <input
              type="text"
              name="sponsorReferralCode"
              value={form.sponsorReferralCode}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-[#B48811] focus:outline-none"
            />
          </div>
          <Button type="submit" disabled={loading} variant="primary" size="lg" className="w-full rounded-xl">
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
        <p className="text-gray-400 text-center mt-6 text-sm">
          Already have an account?{' '}
          <Link href="/signin" className="text-[#EBD197] hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
