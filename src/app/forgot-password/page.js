'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { forgotPassword, verifyResetOtp, resetPassword } from '@/lib/api'
import { Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'

const STEPS = {
  EMAIL: 'email',
  OTP: 'otp',
  PASSWORD: 'password',
  SUCCESS: 'success',
}

export default function ForgotPassword() {
  const router = useRouter()
  const [step, setStep] = useState(STEPS.EMAIL)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const result = await forgotPassword(email)
      if (!result.success) throw new Error(result.error?.message || 'Failed to send OTP')
      setStep(STEPS.OTP)
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const result = await verifyResetOtp(email, otp)
      if (!result.success) throw new Error(result.error?.message || 'Failed to verify OTP')
      if (!result.data?.valid) throw new Error('Invalid or expired OTP')
      setStep(STEPS.PASSWORD)
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Invalid or expired OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError('')
    try {
      const result = await resetPassword(email, otp, newPassword)
      if (!result.success) throw new Error(result.error?.message || 'Failed to reset password')
      setStep(STEPS.SUCCESS)
    } catch (err) {
      setError(err.response?.data?.error?.message || err.message || 'Failed to reset password')
    } finally {
      setLoading(false)
    }
  }

  const renderEmailStep = () => (
    <form onSubmit={handleSendOtp} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3.5 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/50 text-foreground placeholder-slate-400 focus:border-[#B48811] focus:ring-2 focus:ring-[#B48811]/30 focus:shadow-lg focus:shadow-[#B48811]/10 hover:border-slate-500/50 hover:bg-gradient-to-br hover:from-slate-800/60 hover:to-slate-900/60 focus:outline-none transition-all duration-300"
          placeholder="you@example.com"
        />
      </div>
      <Button type="submit" disabled={loading} variant="primary" size="lg" className="w-full rounded-xl mt-6">
        {loading ? 'Sending...' : 'Send OTP'}
      </Button>
    </form>
  )

  const renderOtpStep = () => (
    <form onSubmit={handleVerifyOtp} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">OTP</label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          required
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
          className="w-full px-4 py-3.5 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/50 text-foreground placeholder-slate-400 focus:border-[#B48811] focus:ring-2 focus:ring-[#B48811]/30 focus:shadow-lg focus:shadow-[#B48811]/10 hover:border-slate-500/50 hover:bg-gradient-to-br hover:from-slate-800/60 hover:to-slate-900/60 focus:outline-none transition-all duration-300 tracking-[0.5em] text-center text-2xl"
          placeholder="123456"
        />
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Check your email for the 6-digit OTP.
        </p>
      </div>
      <Button type="submit" disabled={loading || otp.length !== 6} variant="primary" size="lg" className="w-full rounded-xl mt-6">
        {loading ? 'Verifying...' : 'Verify OTP'}
      </Button>
      <button
        type="button"
        onClick={handleSendOtp}
        disabled={loading}
        className="w-full text-sm text-[#EBD197] hover:text-[#B48811] transition-colors"
      >
        Resend OTP
      </button>
    </form>
  )

  const renderPasswordStep = () => (
    <form onSubmit={handleResetPassword} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
        <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
        <input
          type={showPassword ? 'text' : 'password'}
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-3.5 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-600/50 text-foreground placeholder-slate-400 focus:border-[#B48811] focus:ring-2 focus:ring-[#B48811]/30 focus:shadow-lg focus:shadow-[#B48811]/10 hover:border-slate-500/50 hover:bg-gradient-to-br hover:from-slate-800/60 hover:to-slate-900/60 focus:outline-none transition-all duration-300"
          placeholder="••••••••"
        />
      </div>
      <Button type="submit" disabled={loading} variant="primary" size="lg" className="w-full rounded-xl mt-6">
        {loading ? 'Resetting...' : 'Reset Password'}
      </Button>
    </form>
  )

  const renderSuccessStep = () => (
    <div className="text-center space-y-6">
      <div className="text-5xl">✅</div>
      <h2 className="text-2xl font-bold text-foreground">Password Reset Successful</h2>
      <p className="text-muted-foreground">Your password has been updated. You can now sign in with your new password.</p>
      <Button onClick={() => router.push('/signin')} variant="primary" size="lg" className="w-full rounded-xl">
        Sign In
      </Button>
    </div>
  )

  const getStepTitle = () => {
    switch (step) {
      case STEPS.EMAIL: return 'Forgot Password'
      case STEPS.OTP: return 'Enter OTP'
      case STEPS.PASSWORD: return 'Set New Password'
      case STEPS.SUCCESS: return 'All Set'
      default: return 'Forgot Password'
    }
  }

  const getStepDescription = () => {
    switch (step) {
      case STEPS.EMAIL: return 'Enter your email to receive a password reset OTP'
      case STEPS.OTP: return 'Enter the 6-digit code sent to your email'
      case STEPS.PASSWORD: return 'Create a strong new password'
      case STEPS.SUCCESS: return ''
      default: return 'Enter your email to receive a password reset OTP'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#B48811]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#BB9B49]/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md bg-card/10 backdrop-blur-xl border-2 border-[#B48811]/50 rounded-3xl p-10 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center">
            <Link href="/">
              <Image src="/logo.png" alt="EpochEra" width={80} height={80} className="object-contain" />
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{getStepTitle()}</h1>
          {getStepDescription() && (
            <p className="text-muted-foreground">{getStepDescription()}</p>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-xl">
            <p className="text-destructive text-sm text-center">{error}</p>
          </div>
        )}

        {step === STEPS.EMAIL && renderEmailStep()}
        {step === STEPS.OTP && renderOtpStep()}
        {step === STEPS.PASSWORD && renderPasswordStep()}
        {step === STEPS.SUCCESS && renderSuccessStep()}

        {step !== STEPS.SUCCESS && (
          <div className="mt-8 text-center">
            <p className="text-muted-foreground text-sm">
              Remember your password?{' '}
              <Link href="/signin" className="text-[#EBD197] hover:text-[#B48811] font-medium transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
