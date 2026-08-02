'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

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
  const upcoming = events.filter((e) => {
    const eventDate = new Date(e.event_date)
    const thisYear = new Date(today.getFullYear(), eventDate.getMonth(), eventDate.getDate())
    const diffDays = (thisYear - today) / (1000 * 60 * 60 * 24)
    return diffDays >= -1 && diffDays <= 60
  })

  const eventIcon = (type) => {
    if (type === 'birthday') return '🎂'
    if (type === 'anniversary') return '💍'
    if (type === 'simcha') return '✨'
    return '📌'
  }

  return (
    <div className="min-h-screen bg-family-black px-4 py-10 md:px-10 relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] bg-family-gold/5 rounded-full blur-[140px] top-0 left-1/2 -translate-x-1/2" />

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-10">
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

        <h2 className="text-sm font-semibold tracking-wide uppercase text-family-muted mb-4">
          Upcoming
        </h2>

        {upcoming.length === 0 && (
          <p className="text-family-muted">Nothing coming up in the next 60 days.</p>
        )}

        <div className="space-y-3">
          {upcoming.map((event) => (
            <div
              key={event.id}
              className="bg-family-card border border-family-border rounded-xl p-4 flex items-center gap-4 hover:border-family-gold/40 transition"
            >
              <span className="text-2xl">{eventIcon(event.event_type)}</span>
              <div>
                <p className="font-semibold text-family-white">{event.title}</p>
                <p className="text-sm text-family-muted capitalize">
                  {event.event_type} • {new Date(event.event_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}