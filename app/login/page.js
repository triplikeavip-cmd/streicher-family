'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [familyPassword, setFamilyPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleGoogleLogin = async () => {
    if (familyPassword !== process.env.NEXT_PUBLIC_FAMILY_PASSWORD) {
      setError('Enter the family password first.')
      return
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
    if (error) setError(error.message)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (familyPassword !== process.env.NEXT_PUBLIC_FAMILY_PASSWORD) {
      setError('Incorrect family password.')
      setLoading(false)
      return
    }

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-family-black px-4 relative overflow-hidden">
      <div className="absolute w-[400px] h-[400px] bg-family-gold/10 rounded-full blur-[120px]" />

      <form
        onSubmit={handleLogin}
        className="relative z-10 bg-family-card border border-family-border rounded-2xl shadow-2xl p-8 w-full max-w-sm animate-fadeUp"
      >
        <h1 className="text-2xl font-bold text-center mb-1 text-family-white">
          Streicher Family
        </h1>
        <p className="text-family-muted text-sm text-center mb-6">
          Sign in to continue
        </p>

        {error && (
          <p className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <label className="block text-xs font-semibold tracking-wide uppercase text-family-muted mb-2">
          Family Password
        </label>
        <input
          type="password"
          value={familyPassword}
          onChange={(e) => setFamilyPassword(e.target.value)}
          className="w-full bg-family-charcoal border border-family-border text-family-white rounded-lg px-3 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-family-gold/50 focus:border-family-gold transition"
          required
        />

        <label className="block text-xs font-semibold tracking-wide uppercase text-family-muted mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-family-charcoal border border-family-border text-family-white rounded-lg px-3 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-family-gold/50 focus:border-family-gold transition"
          required
        />

        <label className="block text-xs font-semibold tracking-wide uppercase text-family-muted mb-2">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-family-charcoal border border-family-border text-family-white rounded-lg px-3 py-2.5 mb-6 focus:outline-none focus:ring-2 focus:ring-family-gold/50 focus:border-family-gold transition"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-family-gold text-family-black font-semibold py-2.5 rounded-lg hover:bg-family-goldSoft transition-colors duration-200"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-family-border" />
          <span className="text-xs text-family-muted uppercase tracking-wide">or</span>
          <div className="flex-1 h-px bg-family-border" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={!familyPassword}
          className="w-full border border-family-border text-family-white font-medium py-2.5 rounded-lg hover:border-family-gold/40 transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.92a8.78 8.78 0 002.68-6.62z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.87-3.04.87a5.28 5.28 0 01-4.96-3.65H1.02v2.33A9 9 0 009 18z"/>
            <path fill="#FBBC05" d="M4.04 10.78A5.4 5.4 0 013.76 9c0-.62.11-1.22.28-1.78V4.89H1.02A9 9 0 000 9c0 1.45.35 2.83 1.02 4.11l3.02-2.33z"/>
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.59-2.59C13.46.89 11.43 0 9 0A9 9 0 001.02 4.89l3.02 2.33A5.28 5.28 0 019 3.58z"/>
          </svg>
          Sign in with Google
        </button>
      </form>
    </div>
  )
}