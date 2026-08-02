'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { HDate } from '@hebcal/core'
import { toHebrewDate, getHolidaysInRange } from '@/lib/hebrewDate'

const EVENT_META = {
  birthday: { icon: '🎂', dot: 'bg-family-gold' },
  anniversary: { icon: '💍', dot: 'bg-rose-400' },
  chasana: { icon: '💐', dot: 'bg-purple-400' },
  bar_mitzvah: { icon: '📖', dot: 'bg-blue-400' },
  bat_mitzvah: { icon: '🕯️', dot: 'bg-pink-400' },
  bris: { icon: '👶', dot: 'bg-green-400' },
  vort: { icon: '💫', dot: 'bg-orange-400' },
  simcha: { icon: '✨', dot: 'bg-teal-400' },
  other: { icon: '📌', dot: 'bg-gray-400' },
}

export default function CalendarPage() {
  const [events, setEvents] = useState([])
  const [holidays, setHolidays] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadData()
  }, [currentDate])

  const loadData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data: eventsData } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true })

    setEvents(eventsData || [])

    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const start = new Date(year, month, 1)
    const end = new Date(year, month + 1, 0)
    setHolidays(getHolidaysInRange(start, end))

    setLoading(false)
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startWeekday = firstDay.getDay()

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const eventsForDay = (day) => {
    return events.filter((e) => {
      const ed = new Date(e.event_date)
      if (e.recurring) {
        return ed.getMonth() === month && ed.getDate() === day
      }
      return ed.getFullYear() === year && ed.getMonth() === month && ed.getDate() === day
    })
  }

  const holidaysForDay = (day) => {
    return holidays.filter((h) => {
      const hd = new Date(h.date)
      return hd.getFullYear() === year && hd.getMonth() === month && hd.getDate() === day
    })
  }

  const hebrewDayLabel = (day) => {
    const hd = new HDate(new Date(year, month, day))
    return `${hd.getDate()} ${hd.getMonthName()}`
  }

  const goToPrevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const goToNextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const cells = []
  for (let i = 0; i < startWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-family-black">
        <p className="text-family-muted">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-family-black px-4 py-10 md:px-10">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => router.push('/dashboard')} className="text-sm text-family-muted hover:text-family-gold transition">
            ← Dashboard
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-family-white">{monthName}</h1>
          <button
            onClick={() => router.push('/events/new')}
            className="text-sm bg-family-gold text-family-black font-semibold px-4 py-2 rounded-lg hover:bg-family-goldSoft transition-colors"
          >
            + Add Event
          </button>
        </div>

        <div className="flex justify-between items-center mb-4">
          <button onClick={goToPrevMonth} className="text-family-muted hover:text-family-gold px-3 py-1">← Prev</button>
          <button onClick={goToNextMonth} className="text-family-muted hover:text-family-gold px-3 py-1">Next →</button>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs uppercase tracking-wide text-family-muted">
          <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {cells.map((day, i) => {
            if (!day) return <div key={i} />
            const dayEvents = eventsForDay(day)
            const dayHolidays = holidaysForDay(day)
            const thisDate = new Date(year, month, day)
            const isToday = new Date().toDateString() === thisDate.toDateString()
            const photosEvents = dayEvents.filter((e) => e.photo_url)

            return (
              <button
                key={i}
                onClick={() => setSelectedDay({ day, events: dayEvents, holidays: dayHolidays, date: thisDate })}
                className={`aspect-square rounded-lg border p-1 text-left flex flex-col overflow-hidden ${
                  isToday ? 'border-family-gold bg-family-gold/5' : 'border-family-border bg-family-card'
                } hover:border-family-gold/40 transition`}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-sm ${isToday ? 'text-family-gold font-bold' : 'text-family-white'}`}>{day}</span>
                  {dayHolidays.length > 0 && <span className="text-[10px]">🕎</span>}
                </div>
                <span className="text-[9px] text-family-muted leading-tight">{hebrewDayLabel(day)}</span>

                {photosEvents.length > 0 && (
                  <div className={`grid gap-0.5 ${photosEvents.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                    {photosEvents.slice(0, 4).map((e, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={e.photo_url}
                          alt={e.title}
                          className="w-full aspect-square object-cover rounded"
                        />
                        <span className={`absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full ${EVENT_META[e.event_type]?.dot || 'bg-gray-400'} ring-1 ring-family-card`} />
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-auto space-y-0.5">
                  {dayEvents.slice(0, photosEvents.length > 0 ? 1 : 2).map((e, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${EVENT_META[e.event_type]?.dot || 'bg-gray-400'}`} />
                      <span className="text-[8px] text-family-white truncate leading-tight">{e.title}</span>
                    </div>
                  ))}
                  {dayEvents.length > (photosEvents.length > 0 ? 1 : 2) && (
                    <span className="text-[8px] text-family-muted">+{dayEvents.length - (photosEvents.length > 0 ? 1 : 2)} more</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {selectedDay && (
          <div className="mt-8 bg-family-card border border-family-border rounded-2xl p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-family-white font-semibold">
                  {selectedDay.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-family-gold text-sm mt-1">{toHebrewDate(selectedDay.date)}</p>
              </div>
              <button onClick={() => setSelectedDay(null)} className="text-family-muted hover:text-family-gold text-sm">
                Close
              </button>
            </div>

            {selectedDay.holidays.length > 0 && (
              <div className="mb-4">
                {selectedDay.holidays.map((h, idx) => (
                  <p key={idx} className="text-family-muted text-sm">🕎 {h.title}</p>
                ))}
              </div>
            )}

            {selectedDay.events.length === 0 && selectedDay.holidays.length === 0 && (
              <p className="text-family-muted text-sm">Nothing on this day.</p>
            )}

            <div className="space-y-2">
              {selectedDay.events.map((e) => {
                const meta = EVENT_META[e.event_type] || EVENT_META.other
                return (
                  <div key={e.id} className="flex items-center gap-3 bg-family-charcoal rounded-lg p-3">
                    {e.photo_url ? (
                      <img src={e.photo_url} alt={e.title} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <span className="text-xl">{meta.icon}</span>
                    )}
                    <p className="text-family-white font-medium">{e.title}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}