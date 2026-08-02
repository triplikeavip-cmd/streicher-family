'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function PendingPage() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-family-black px-4 text-center">
      <p className="text-family-white text-lg font-semibold mb-2">Waiting for approval</p>
      <p className="text-family-muted max-w-sm mb-6">
        Your account is waiting for approval from a family admin. Check back soon!
      </p>
      <button
        onClick={handleLogout}
        className="text-sm text-family-muted hover:text-family-gold transition underline"
      >
        Log out
      </button>
    </div>
  )
}