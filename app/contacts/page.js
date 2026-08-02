'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { requireApproval } from '@/lib/requireApproval'

export default function ContactsPage() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedMember, setSelectedMember] = useState(null)
  const router = useRouter()

  useEffect(() => {
    loadMembers()
  }, [])

  const loadMembers = async () => {
    const member = await requireApproval(router)
    if (!member) return

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
            <button
              key={m.id}
              onClick={() => setSelectedMember(m)}
              className="w-full text-left bg-family-card border border-family-border rounded-xl p-4 flex items-center gap-4 hover:border-family-gold/40 transition"
            >
              {m.photo_url ? (
                <img src={m.photo_url} alt={m.full_name} className="w-14 h-14 rounded-full object-cover border border-family-border" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-family-charcoal border border-family-border flex items-center justify-center text-family-gold font-bold text-lg">
                  {m.full_name?.[0]}
                </div>
              )}
              <div className="flex-1">
                <p className="font-semibold text-family-white">{m.full_name}</p>
                {m.phone && <p className="text-sm text-family-muted">📞 {m.phone}</p>}
              </div>
            </button>
          ))}

          {filtered.length === 0 && (
            <p className="text-family-muted text-center">No family members found.</p>
          )}
        </div>

        {selectedMember && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-50"
            onClick={() => setSelectedMember(null)}
          >
            <div
              className="bg-family-card border border-family-border rounded-2xl p-6 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  {selectedMember.photo_url ? (
                    <img src={selectedMember.photo_url} alt={selectedMember.full_name} className="w-20 h-20 rounded-full object-cover border border-family-border" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-family-charcoal border border-family-border flex items-center justify-center text-family-gold font-bold text-2xl">
                      {selectedMember.full_name?.[0]}
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-family-white text-lg">{selectedMember.full_name}</p>
                    {selectedMember.role === 'admin' && (
                      <p className="text-family-gold text-xs">Admin</p>
                    )}
                  </div>
                </div>
                <button onClick={() => setSelectedMember(null)} className="text-family-muted hover:text-family-gold text-sm">
                  Close
                </button>
              </div>

              <div className="space-y-2 mt-4">
                {selectedMember.phone && (
                  <a href={`tel:${selectedMember.phone}`} className="block text-sm text-family-white hover:text-family-gold transition">
                    📞 {selectedMember.phone}
                  </a>
                )}
                {selectedMember.email && (
                  <a href={`mailto:${selectedMember.email}`} className="block text-sm text-family-white hover:text-family-gold transition">
                    ✉️ {selectedMember.email}
                  </a>
                )}
                {selectedMember.address && (
                  <p className="text-sm text-family-white">📍 {selectedMember.address}</p>
                )}
                {selectedMember.birthday && (
                  <p className="text-sm text-family-white">
                    🎂 {new Date(selectedMember.birthday).toLocaleDateString()}
                  </p>
                )}
                {!selectedMember.phone && !selectedMember.email && !selectedMember.address && !selectedMember.birthday && (
                  <p className="text-sm text-family-muted">No additional info yet.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}