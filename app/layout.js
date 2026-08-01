import './globals.css'

export const metadata = {
  title: 'Streicher Family',
  description: 'The Streicher family hub — photos, videos, calendar, and simchas',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}