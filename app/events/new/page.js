'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function NewEvent() {
  const [title, setTitle] = useState('')
  const [eventType, setEventType] = useState('birthday')
  const [eventDate, setEventDate] = useState('')
  const [recurring, setRecurring] = useState(true)
  const [notes, setNotes] = useState('')
  const [members, setMembers] = useState([])
  const [relatedMember, setRelatedMember] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadMembers()
  }, [])

  const loadMembers = async () => {
    const { data } = await supabase
      .from('family_members')
      .select('id, full_name')
      .eq('approved', true)
      .order('full_name')
    setMembers(data || [])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    const { data: memberData } = await supabase
      .from('family_members')
      .select('id')
      .eq('auth_user_id', user.id)
      .single()

    const { error: insertError } = await supabase.from('events').insert({
      title,
      event_type: eventType,
      event_date: eventDate,
      recurring,
      notes,
      related_member_id: relatedMember || null,
      created_by: memberData?.id,
    })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-family-black px-4 py-10 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-family-card border border-family-border rounded-2xl p-8 w-full max-w-md h-fit"
      >
        <h1 className="text-2xl font-bold text-family-white mb-6">Add Event</h1>

        {error && (
          <p className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <label className="block text-xs font-semibold tracking-wide uppercase text-family-muted mb-2">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Sarah's Birthday"
          className="w-full bg-family-charcoal border border-family-border text-family-white rounded-lg px-3 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-family-gold/50 focus:border-family-gold transition"
          required
        />

        <label className="block text-xs font-semibold tracking-wide uppercase text-family-muted mb-2">
          Type
        </label>
        <select
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="w-full bg-family-charcoal border border-family-border text-family-white rounded-lg px-3 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-family-gold/50 focus:border-family-gold transition"
        >
          <option value="birthday">Birthday</option>
          <option value="anniversary">Anniversary</option>
          <option value="simcha">Simcha</option>
          <option value="other">Other</option>
        </select>

        <label className="block text-xs font-semibold tracking-wide uppercase text-family-muted mb-2">
          Date
        </label>
        <input
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          className="w-full bg-family-charcoal border border-family-border text-family-white rounded-lg px-3 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-family-gold/50 focus:border-family-gold transition"
          required
        />

        <label className="block text-xs font-semibold tracking-wide uppercase text-family-muted mb-2">
          Related Family Member (optional)
        </label>
        <select
          value={relatedMember}
          onChange={(e) => setRelatedMember(e.target.value)}
          className="w-full bg-family-charcoal border border-family-border text-family-white rounded-lg px-3 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-family-gold/50 focus:border-family-gold transition"
        >
          <option value="">None</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>{m.full_name}</option>
          ))}
        </select>

        <label className="flex items-center gap-2 mb-4 text-family-white text-sm">
          <input
            type="checkbox"
            checked={recurring}
            onChange={(e) => setRecurring(e.target.checked)}
            className="w-4 h-4 accent-family-gold"
          />
          Repeats every year
        </label>

        <label className="block text-xs font-semibold tracking-wide uppercase text-family-muted mb-2">
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full bg-family-charcoal border border-family-border text-family-white rounded-lg px-3 py-2.5 mb-6 focus:outline-none focus:ring-2 focus:ring-family-gold/50 focus:border-family-gold transition"
        />

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            className="flex-1 border border-family-border text-family-muted font-semibold py-2.5 rounded-lg hover:border-family-gold/40 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-family-gold text-family-black font-semibold py-2.5 rounded-lg hover:bg-family-goldSoft transition-colors"
          >
            {loading ? 'Saving...' : 'Save Event'}
          </button>
        </div>
      </form>
    </div>
  )
}