'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { login } from '@/lib/api'

export default function SignIn() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const result = await login(form.email, form.password)
      if (!result.success) throw new Error(result.error?.message || 'Login failed')
      const { accessToken, user } = result.data
      localStorage.setItem('token', accessToken)
      if (user.role === 'ADMIN') {
        router.push('/admin/dashboard')
      } else {
        router.push('/user/dashboard')
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-zinc-700 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white text-center mb-2">Welcome Back</h1>
        <p className="text-gray-400 text-center mb-8">Sign in to your EpochEra account</p>
        {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-[#B48811] focus:outline-none"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-white focus:border-[#B48811] focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" disabled={loading} variant="primary" size="lg" className="w-full rounded-xl">
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        <p className="text-gray-400 text-center mt-6 text-sm">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[#EBD197] hover:underline">Get Started</Link>
        </p>
      </div>
    </div>
  )
}
