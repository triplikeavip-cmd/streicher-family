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
      <div className="min-h-screen flex items-center justify-center bg-family-cream">
        <p className="text-family-deep">Loading...</p>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-family-cream px-4 text-center">
        <p className="text-family-deep max-w-sm">
          Your account is waiting for approval from a family admin. Check back soon!
        </p>
      </div>
    )
  }

  // Filter to upcoming events in the next 60 days (simple version for now)
  const today = new Date()
  const upcoming = events.filter((e) => {
    const eventDate = new Date(e.event_date)
    const thisYear = new Date(today.getFullYear(), eventDate.getMonth(), eventDate.getDate())
    const diffDays = (thisYear - today) / (1000 * 60 * 60 * 24)
    return diffDays >= -1 && diffDays <= 60
  })

  return (
    <div className="min-h-screen bg-family-cream px-4 py-8 md:px-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-family-deep">
            Welcome, {member.full_name.split(' ')[0]}
          </h1>
          <button
            onClick={handleLogout}
            className="text-sm text-family-deep underline"
          >
            Log out
          </button>
        </div>

        <h2 className="text-lg font-semibold text-family-deep mb-4">
          Upcoming
        </h2>

        {upcoming.length === 0 && (
          <p className="text-family-deep opacity-70">Nothing coming up in the next 60 days.</p>
        )}

        <div className="space-y-3">
          {upcoming.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-family-deep">{event.title}</p>
                <p className="text-sm text-family-deep opacity-60 capitalize">
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