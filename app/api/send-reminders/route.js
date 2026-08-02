import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { toHebrewDate } from '@/lib/hebrewDate'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { data: events } = await supabase
    .from('events')
    .select('*')

  const { data: members } = await supabase
    .from('family_members')
    .select('email, full_name')
    .eq('approved', true)

  if (!events || !members) {
    return Response.json({ sent: 0, error: 'No data found' })
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const reminderDaysAhead = [0, 3, 7] // day-of, 3 days before, 1 week before

  const eventsToRemind = events.filter((e) => {
    const eventDate = new Date(e.event_date)
    const thisYear = e.recurring
      ? new Date(today.getFullYear(), eventDate.getMonth(), eventDate.getDate())
      : eventDate
    thisYear.setHours(0, 0, 0, 0)
    const diffDays = Math.round((thisYear - today) / (1000 * 60 * 60 * 24))
    return reminderDaysAhead.includes(diffDays)
  })

  let sentCount = 0

  for (const event of eventsToRemind) {
    const hebrewDate = toHebrewDate(event.event_date)
    const emailList = members.map((m) => m.email).filter(Boolean)

    if (emailList.length === 0) continue

    await resend.emails.send({
      from: 'Streicher Family <onboarding@resend.dev>',
      to: emailList,
      subject: `Upcoming: ${event.title}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background: #0A0A0A; color: #F5F5F0;">
          <h2 style="color: #D4AF37;">Streicher Family</h2>
          <p style="font-size: 18px;">${event.title}</p>
          <p style="color: #9A9A93;">${new Date(event.event_date).toLocaleDateString()} • ${hebrewDate}</p>
          ${event.notes ? `<p>${event.notes}</p>` : ''}
        </div>
      `,
    })

    sentCount++
  }

  return Response.json({ sent: sentCount, checked: events.length })
}