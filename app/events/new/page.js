'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

const EVENT_TYPES = [
  { value: 'birthday', label: 'Birthday', color: 'gold' },
  { value: 'anniversary', label: 'Anniversary', color: 'rose' },
  { value: 'chasana', label: 'Chasana (Wedding)', color: 'purple' },
  { value: 'bar_mitzvah', label: 'Bar Mitzvah', color: 'blue' },
  { value: 'bat_mitzvah', label: 'Bat Mitzvah', color: 'pink' },
  { value: 'bris', label: 'Bris', color: 'green' },
  { value: 'vort', label: 'Vort / Engagement', color: 'orange' },
  { value: 'simcha', label: 'Simcha (Other)', color: 'teal' },
  { value: 'other', label: 'Other', color: 'gray' },
]

export default function NewEvent() {
  const [title, setTitle] = useState('')
  const [eventType, setEventType] = useState('birthday')
  const [eventDate, setEventDate] = useState('')
  const [recurring, setRecurring] = useState(true)
  const [notes, setNotes] = useState('')
  const [members, setMembers] = useState([])
  const [relatedMember, setRelatedMember] = useState('')
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPhotoFile(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
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

    let photoUrl = null

    if (photoFile) {
      const fileExt = photoFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('family-photos')
        .upload(fileName, photoFile)

      if (uploadError) {
        setError('Photo upload failed: ' + uploadError.message)
        setLoading(false)
        return
      }

      const { data: urlData } = await supabase.storage
        .from('family-photos')
        .createSignedUrl(fileName, 60 * 60 * 24 * 365)

      photoUrl = urlData?.signedUrl || null
    }

    const typeConfig = EVENT_TYPES.find((t) => t.value === eventType)

    const { error: insertError } = await supabase.from('events').insert({
      title,
      event_type: eventType,
      event_date: eventDate,
      recurring,
      notes,
      related_member_id: relatedMember || null,
      created_by: memberData?.id,
      photo_url: photoUrl,
      color: typeConfig?.color || 'gold',
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
          {EVENT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
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

        <label className="block text-xs font-semibold tracking-wide uppercase text-family-muted mb-2">
          Photo (optional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="w-full text-family-muted text-sm mb-2 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-family-gold file:text-family-black file:font-semibold file:cursor-pointer"
        />
        {photoPreview && (
          <img
            src={photoPreview}
            alt="Preview"
            className="w-full h-40 object-cover rounded-lg mb-4 border border-family-border"
          />
        )}

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