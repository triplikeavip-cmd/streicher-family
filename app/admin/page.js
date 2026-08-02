'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { requireApproval } from '@/lib/requireApproval'

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    loadMembers()
  }, [])

  const loadMembers = async () => {
    const me = await requireApproval(router)
    if (!me) return

    if (me.role !== 'admin') {
      setIsAdmin(false)
      setLoading(false)
      return
    }

    setIsAdmin(true)

    const { data } = await supabase
      .from('family_members')
      .select('*')
      .order('created_at', { ascending: false })

    setMembers(data || [])
    setLoading(false)
  }

  const approveMember = async (id) => {
    setError('')
    const { error: updateError } = await supabase
      .from('family_members')
      .update({ approved: true })
      .eq('id', id)

    if (updateError) {
      setError(updateError.message)
      return
    }
    loadMembers()
  }

  const removeMember = async (id) => {
    if (!confirm('Remove this person from the family site? This cannot be undone.')) return

    setError('')
    const { error: deleteError } = await supabase
      .from('family_members')
      .delete()
      .eq('id', id)

    if (deleteError) {
      setError(deleteError.message)
      return
    }
    loadMembers()
  }

  const toggleAdmin = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'member' : 'admin'
    const { error: updateError } = await supabase
      .from('family_members')
      .update({ role: newRole })
      .eq('id', id)

    if (updateError) {
      setError(updateError.message)
      return
    }
    loadMembers()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-family-black">
        <p className="text-family-muted">Loading...</p>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-family-black px-4 text-center">
        <p className="text-family-muted">You don't have access to this page.</p>
      </div>
    )
  }

  const pending = members.filter((m) => !m.approved)
  const approved = members.filter((m) => m.approved)

  return (
    <div className="min-h-screen bg-family-black px-4 py-10 md:px-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => router.push('/dashboard')} className="text-sm text-family-muted hover:text-family-gold transition">
            ← Dashboard
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-family-white">Admin</h1>
          <div className="w-20" />
        </div>

        {error && (
          <p className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2 mb-6">{error}</p>
        )}

        {pending.length > 0 && (
          <>
            <h2 className="text-sm font-semibold tracking-wide uppercase text-family-muted mb-3">
              Pending Approval ({pending.length})
            </h2>
            <div className="space-y-3 mb-8">
              {pending.map((m) => (
                <div key={m.id} className="bg-family-card border border-family-border rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-family-white">{m.full_name}</p>
                    <p className="text-sm text-family-muted">{m.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => approveMember(m.id)}
                      className="text-sm bg-family-gold text-family-black font-semibold px-3 py-1.5 rounded-lg hover:bg-family-goldSoft transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => removeMember(m.id)}
                      className="text-sm border border-red-500/40 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <h2 className="text-sm font-semibold tracking-wide uppercase text-family-muted mb-3">
          Family Members ({approved.length})
        </h2>
        <div className="space-y-3">
          {approved.map((m) => (
            <div key={m.id} className="bg-family-card border border-family-border rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-family-white">
                  {m.full_name} {m.role === 'admin' && <span className="text-family-gold text-xs ml-1">(Admin)</span>}
                </p>
                <p className="text-sm text-family-muted">{m.email}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleAdmin(m.id, m.role)}
                  className="text-sm border border-family-border text-family-muted px-3 py-1.5 rounded-lg hover:border-family-gold/40 hover:text-family-gold transition"
                >
                  {m.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                </button>
                <button
                  onClick={() => removeMember(m.id)}
                  className="text-sm border border-red-500/40 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}