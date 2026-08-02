'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { toHebrewDate } from '@/lib/hebrewDate'

export default function Dashboard() {
  const [member, setMember] = useState(null)
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { data: memberData } = await supabase
      .from('family_members')
      .select('*')
      .eq('auth_user_id', user.id)
      .single()

    if (!memberData || !memberData.approved) {
      setLoading(false)
      setMember(null)
      return
    }

    setMember(memberData)

    const { data: eventsData } = await supabase
      .from('events')
      .select('*, related_member_id(full_name, photo_url)')
      .order('event_date', { ascending: true })

    setEvents(eventsData || [])
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const deleteEvent = async (id) => {
    if (!confirm('Delete this event? This cannot be undone.')) return
    const { error } = await supabase.from('events').delete().eq('id', id)
    if (!error) {
      setEvents((prev) => prev.filter((e) => e.id !== id))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-family-black">
        <p className="text-family-muted">Loading...</p>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-family-black px-4 text-center">
        <p className="text-family-muted max-w-sm">
          Your account is waiting for approval from a family admin. Check back soon!
        </p>
      </div>
    )
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcoming = events
    .map((e) => {
      const eventDate = new Date(e.event_date)
      let nextOccurrence = eventDate

      if (e.recurring) {
        nextOccurrence = new Date(today.getFullYear(), eventDate.getMonth(), eventDate.getDate())
        if (nextOccurrence < today) {
          nextOccurrence = new Date(today.getFullYear() + 1, eventDate.getMonth(), eventDate.getDate())
        }
      }

      return { ...e, nextOccurrence }
    })
    .filter((e) => e.recurring || e.nextOccurrence >= today)
    .sort((a, b) => a.nextOccurrence - b.nextOccurrence)

  const EVENT_META = {
    birthday: { icon: '🎂', label: 'Birthday', border: 'border-l-family-gold' },
    anniversary: { icon: '💍', label: 'Anniversary', border: 'border-l-rose-400' },
    chasana: { icon: '💐', label: 'Chasana (Wedding)', border: 'border-l-purple-400' },
    bar_mitzvah: { icon: '📖', label: 'Bar Mitzvah', border: 'border-l-blue-400' },
    bat_mitzvah: { icon: '🕯️', label: 'Bat Mitzvah', border: 'border-l-pink-400' },
    bris: { icon: '👶', label: 'Bris', border: 'border-l-green-400' },
    vort: { icon: '💫', label: 'Vort / Engagement', border: 'border-l-orange-400' },
    simcha: { icon: '✨', label: 'Simcha', border: 'border-l-teal-400' },
    other: { icon: '📌', label: 'Other', border: 'border-l-gray-400' },
  }

  return (
    <div className="min-h-screen bg-family-black px-4 py-10 md:px-10 relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-family-gold/5 rounded-full blur-[140px] top-0 left-1/2 -translate-x-1/2" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-family-gold text-xs font-semibold tracking-[0.2em] uppercase mb-1">
              Streicher Family
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-family-white">
              Welcome, {member.full_name.split(' ')[0]}
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-family-muted hover:text-family-gold transition"
          >
            Log out
          </button>
        </div>

        <div className="flex gap-2 mb-10 border-b border-family-border pb-4 flex-wrap">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-sm bg-family-gold text-family-black font-semibold px-4 py-2 rounded-lg"
          >
            Dashboard
          </button>
          <button
            onClick={() => router.push('/calendar')}
            className="text-sm text-family-muted hover:text-family-gold border border-family-border px-4 py-2 rounded-lg transition"
          >
            Calendar
          </button>
          <button
            onClick={() => router.push('/contacts')}
            className="text-sm text-family-muted hover:text-family-gold border border-family-border px-4 py-2 rounded-lg transition"
          >
            Contacts
          </button>
          <button
            onClick={() => router.push('/profile')}
            className="text-sm text-family-muted hover:text-family-gold border border-family-border px-4 py-2 rounded-lg transition"
          >
            My Profile
          </button>
          {member.role === 'admin' && (
            <button
              onClick={() => router.push('/admin')}
              className="text-sm text-family-muted hover:text-family-gold border border-family-border px-4 py-2 rounded-lg transition"
            >
              Admin
            </button>
          )}
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold tracking-wide uppercase text-family-muted">
            Upcoming
          </h2>
          <button
            onClick={() => router.push('/events/new')}
            className="text-sm bg-family-gold text-family-black font-semibold px-4 py-2 rounded-lg hover:bg-family-goldSoft transition-colors"
          >
            + Add Event
          </button>
        </div>

        {upcoming.length === 0 && (
          <p className="text-family-muted">Nothing coming up in the next 60 days.</p>
        )}

        <div className="space-y-3">
          {upcoming.map((event) => {
            const meta = EVENT_META[event.event_type] || EVENT_META.other
            return (
              <div
                key={event.id}
                className={`bg-family-card border border-family-border border-l-4 ${meta.border} rounded-xl p-4 flex items-center justify-between gap-4 hover:border-family-gold/40 transition`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{meta.icon}</span>
                  <div>
                    <p className="font-semibold text-family-white">{event.title}</p>
                    <p className="text-sm text-family-muted">
                      {meta.label} • {event.nextOccurrence.toLocaleDateString()}
                    </p>
                    <p className="text-xs text-family-gold/70 mt-0.5">
                      {toHebrewDate(event.nextOccurrence)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => deleteEvent(event.id)}
                  className="text-xs text-red-400 border border-red-500/40 px-2 py-1 rounded-lg hover:bg-red-500/10 transition shrink-0"
                >
                  Delete
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}