'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [familyPassword, setFamilyPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')

    if (familyPassword !== process.env.NEXT_PUBLIC_FAMILY_PASSWORD) {
      setError('Incorrect family password.')
      return
    }

    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    const userId = data.user?.id

    if (userId) {
      await supabase.from('family_members').insert({
        auth_user_id: userId,
        full_name: fullName,
        email,
        role: 'member',
        approved: false,
      })

      fetch('/api/notify-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: fullName, email }),
      })
    }

    router.push('/pending')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-family-black px-4 relative overflow-hidden">
      <div className="absolute w-[400px] h-[400px] bg-family-gold/10 rounded-full blur-[120px]" />

      <form
        onSubmit={handleSignup}
        className="relative z-10 bg-family-card border border-family-border rounded-2xl shadow-2xl p-8 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-center mb-1 text-family-white">
          Join the Streicher Family
        </h1>
        <p className="text-family-muted text-sm text-center mb-6">
          Create your account
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
          Full Name
        </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
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
          minLength={6}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-family-gold text-family-black font-semibold py-2.5 rounded-lg hover:bg-family-goldSoft transition-colors"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        <button
          type="button"
          onClick={() => router.push('/login')}
          className="w-full text-sm text-family-muted hover:text-family-gold transition mt-4"
        >
          Already have an account? Log in
        </button>
      </form>
    </div>
  )
}