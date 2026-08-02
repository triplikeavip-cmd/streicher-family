'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { requireApproval } from '@/lib/requireApproval'

export default function ProfilePage() {
  const [memberId, setMemberId] = useState(null)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [birthday, setBirthday] = useState('')
  const [photoFile, setPhotoFile] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [existingPhotoUrl, setExistingPhotoUrl] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    const member = await requireApproval(router)
    if (!member) return

    const { data } = await supabase
      .from('family_members')
      .select('*')
      .eq('auth_user_id', user.id)
      .single()

    if (data) {
      setMemberId(data.id)
      setFullName(data.full_name || '')
      setPhone(data.phone || '')
      setAddress(data.address || '')
      setBirthday(data.birthday || '')
      setExistingPhotoUrl(data.photo_url || null)
    }

    setLoading(false)
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPhotoFile(file)
      setPhotoPreview(URL.createObjectURL(file))
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSaving(true)

    let photoUrl = existingPhotoUrl

    if (photoFile) {
      const fileExt = photoFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('family-photos')
        .upload(fileName, photoFile)

      if (uploadError) {
        setError('Photo upload failed: ' + uploadError.message)
        setSaving(false)
        return
      }

      const { data: urlData } = await supabase.storage
        .from('family-photos')
        .createSignedUrl(fileName, 60 * 60 * 24 * 365)

      photoUrl = urlData?.signedUrl || existingPhotoUrl
    }

    const { error: updateError } = await supabase
      .from('family_members')
      .update({
        full_name: fullName,
        phone,
        address,
        birthday: birthday || null,
        photo_url: photoUrl,
      })
      .eq('id', memberId)

    if (updateError) {
      setError(updateError.message)
      setSaving(false)
      return
    }

    setSuccess('Profile updated!')
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-family-black">
        <p className="text-family-muted">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-family-black px-4 py-10 flex justify-center">
      <form onSubmit={handleSave} className="bg-family-card border border-family-border rounded-2xl p-8 w-full max-w-md h-fit">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-family-white">My Profile</h1>
          <button type="button" onClick={() => router.push('/dashboard')} className="text-sm text-family-muted hover:text-family-gold transition">
            ← Dashboard
          </button>
        </div>

        {error && (
          <p className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-3 py-2 mb-4">{error}</p>
        )}
        {success && (
          <p className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-lg px-3 py-2 mb-4">{success}</p>
        )}

        <label className="block text-xs font-semibold tracking-wide uppercase text-family-muted mb-2">Photo</label>
        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          className="w-full text-family-muted text-sm mb-2 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-family-gold file:text-family-black file:font-semibold file:cursor-pointer"
        />
        {(photoPreview || existingPhotoUrl) && (
          <img src={photoPreview || existingPhotoUrl} alt="Preview" className="w-24 h-24 object-cover rounded-full mb-4 border border-family-border" />
        )}

        <label className="block text-xs font-semibold tracking-wide uppercase text-family-muted mb-2">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full bg-family-charcoal border border-family-border text-family-white rounded-lg px-3 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-family-gold/50 focus:border-family-gold transition"
          required
        />

        <label className="block text-xs font-semibold tracking-wide uppercase text-family-muted mb-2">Phone</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full bg-family-charcoal border border-family-border text-family-white rounded-lg px-3 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-family-gold/50 focus:border-family-gold transition"
        />

        <label className="block text-xs font-semibold tracking-wide uppercase text-family-muted mb-2">Address</label>
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full bg-family-charcoal border border-family-border text-family-white rounded-lg px-3 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-family-gold/50 focus:border-family-gold transition"
        />

        <label className="block text-xs font-semibold tracking-wide uppercase text-family-muted mb-2">Birthday</label>
        <input
          type="date"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          className="w-full bg-family-charcoal border border-family-border text-family-white rounded-lg px-3 py-2.5 mb-6 focus:outline-none focus:ring-2 focus:ring-family-gold/50 focus:border-family-gold transition"
        />

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-family-gold text-family-black font-semibold py-2.5 rounded-lg hover:bg-family-goldSoft transition-colors"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}