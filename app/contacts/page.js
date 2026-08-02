'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function ContactsPage() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const router = useRouter()

  useEffect(() => {
    loadMembers()
  }, [])

  const loadMembers = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data } = await supabase
      .from('family_members')
      .select('*')
      .eq('approved', true)
      .order('full_name')

    setMembers(data || [])
    setLoading(false)
  }

  const filtered = members.filter((m) =>
    m.full_name?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-family-black">
        <p className="text-family-muted">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-family-black px-4 py-10 md:px-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => router.push('/dashboard')} className="text-sm text-family-muted hover:text-family-gold transition">
            ← Dashboard
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-family-white">Family Directory</h1>
          <div className="w-20" />
        </div>

        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-family-charcoal border border-family-border text-family-white rounded-lg px-4 py-2.5 mb-6 focus:outline-none focus:ring-2 focus:ring-family-gold/50 focus:border-family-gold transition"
        />

        <div className="space-y-3">
          {filtered.map((m) => (
            <div key={m.id} className="bg-family-card border border-family-border rounded-xl p-4 flex items-center gap-4">
              {m.photo_url ? (
                <img src={m.photo_url} alt={m.full_name} className="w-14 h-14 rounded-full object-cover border border-family-border" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-family-charcoal border border-family-border flex items-center justify-center text-family-gold font-bold text-lg">
                  {m.full_name?.[0]}
                </div>
              )}
              <div className="flex-1">
                <p className="font-semibold text-family-white">{m.full_name}</p>
                {m.phone && (
                  <a href={`tel:${m.phone}`} className="block text-sm text-family-muted hover:text-family-gold transition">
                    📞 {m.phone}
                  </a>
                )}
                {m.email && (
                  <a href={`mailto:${m.email}`} className="block text-sm text-family-muted hover:text-family-gold transition">
                    ✉️ {m.email}
                  </a>
                )}
                {m.address && (
                  <p className="text-sm text-family-muted">📍 {m.address}</p>
                )}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="text-family-muted text-center">No family members found.</p>
          )}
        </div>
      </div>
    </div>
  )
}