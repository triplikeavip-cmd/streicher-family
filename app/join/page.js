'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function JoinPage() {
  const [familyPassword, setFamilyPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleJoin = async (e) => {
    e.preventDefault()
    setError('')

    if (familyPassword !== process.env.NEXT_PUBLIC_FAMILY_PASSWORD) {
      setError('Incorrect family password.')
      return
    }

    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { error: insertError } = await supabase
      .from('family_members')
      .insert({
        auth_user_id: user.id,
        full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email,
        email: user.email,
        role: 'member',
        approved: false,
      })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-family-black px-4 relative overflow-hidden">
      <div className="absolute w-[400px] h-[400px] bg-family-gold/10 rounded-full blur-[120px]" />

      <form
        onSubmit={handleJoin}
        className="relative z-10 bg-family-card border border-family-border rounded-2xl shadow-2xl p-8 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-center mb-1 text-family-white">
          Join the Streicher Family
        </h1>
        <p className="text-family-muted text-sm text-center mb-6">
          Enter the family password to request access
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
          className="w-full bg-family-charcoal border border-family-border text-family-white rounded-lg px-3 py-2.5 mb-6 focus:outline-none focus:ring-2 focus:ring-family-gold/50 focus:border-family-gold transition"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-family-gold text-family-black font-semibold py-2.5 rounded-lg hover:bg-family-goldSoft transition-colors"
        >
          {loading ? 'Submitting...' : 'Request Access'}
        </button>
      </form>
    </div>
  )
}