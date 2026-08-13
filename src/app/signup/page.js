'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { register } from '@/lib/api'
import { Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'

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
  const [showPassword, setShowPassword] = useState(false)

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
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#B48811]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#BB9B49]/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="w-full max-w-md bg-card/10 backdrop-blur-xl border-2 border-[#B48811]/50 rounded-3xl p-10 shadow-2xl relative z-10">
        {/* Logo/Brand section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center ">
            <Link href="/">
              <Image src="/logo.png" alt="EpochEra" width={80} height={80} className="object-contain" />
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Get Started</h1>
          <p className="text-muted-foreground">Create your EpochEra account</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-xl">
            <p className="text-destructive text-sm text-center">{error}</p>
          </div>
        )}
        
        {message && (
          <div className="mb-6 p-4 bg-primary/10 border border-primary/30 rounded-xl">
            <p className="text-primary text-sm text-center">{message}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                required
                value={form.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/50 text-foreground placeholder-slate-400 focus:border-[#B48811] focus:ring-2 focus:ring-[#B48811]/30 focus:shadow-lg focus:shadow-[#B48811]/10 hover:border-slate-500/50 hover:bg-gradient-to-br hover:from-slate-800/60 hover:to-slate-900/60 focus:outline-none transition-all duration-300"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                required
                value={form.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/50 text-foreground placeholder-slate-400 focus:border-[#B48811] focus:ring-2 focus:ring-[#B48811]/30 focus:shadow-lg focus:shadow-[#B48811]/10 hover:border-slate-500/50 hover:bg-gradient-to-br hover:from-slate-800/60 hover:to-slate-900/60 focus:outline-none transition-all duration-300"
                placeholder="Doe"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/50 text-foreground placeholder-slate-400 focus:border-[#B48811] focus:ring-2 focus:ring-[#B48811]/30 focus:shadow-lg focus:shadow-[#B48811]/10 hover:border-slate-500/50 hover:bg-gradient-to-br hover:from-slate-800/60 hover:to-slate-900/60 focus:outline-none transition-all duration-300"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                minLength={8}
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/50 text-foreground placeholder-slate-400 focus:border-[#B48811] focus:ring-2 focus:ring-[#B48811]/30 focus:shadow-lg focus:shadow-[#B48811]/10 hover:border-slate-500/50 hover:bg-gradient-to-br hover:from-slate-800/60 hover:to-slate-900/60 focus:outline-none transition-all duration-300 pr-12"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-[#EBD197] transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Sponsor Referral Code <span className="text-muted-foreground font-normal">(optional)</span></label>
            <input
              type="text"
              name="sponsorReferralCode"
              value={form.sponsorReferralCode}
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/50 text-foreground placeholder-slate-400 focus:border-[#B48811] focus:ring-2 focus:ring-[#B48811]/30 focus:shadow-lg focus:shadow-[#B48811]/10 hover:border-slate-500/50 hover:bg-gradient-to-br hover:from-slate-800/60 hover:to-slate-900/60 focus:outline-none transition-all duration-300"
              placeholder="Enter referral code"
            />
          </div>
          <Button type="submit" disabled={loading} variant="primary" size="lg" className="w-full rounded-xl mt-6">
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm">
            Already have an account?{' '}
            <Link href="/signin" className="text-[#EBD197] hover:text-[#B48811] font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
