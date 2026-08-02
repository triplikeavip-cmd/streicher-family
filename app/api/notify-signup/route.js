import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  const { name, email } = await request.json()

  if (!email) {
    return Response.json({ error: 'Missing email' }, { status: 400 })
  }

  await resend.emails.send({
    from: 'Streicher Family <onboarding@resend.dev>',
    to: email,
    subject: 'Request Received — Streicher Family',
    html: `
      <div style="font-family: sans-serif; padding: 20px; background: #0A0A0A; color: #F5F5F0;">
        <h2 style="color: #D4AF37;">Streicher Family</h2>
        <p>Hi ${name || 'there'},</p>
        <p>Your request to join the Streicher Family site has been received and is now waiting for approval from a family admin.</p>
        <p style="color: #9A9A93;">You'll get another email as soon as you're approved.</p>
      </div>
    `,
  })

  return Response.json({ sent: true })
}