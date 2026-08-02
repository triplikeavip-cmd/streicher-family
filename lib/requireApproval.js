import { supabase } from '@/lib/supabaseClient'

// Checks that the current user is logged in AND approved.
// Returns the member record if OK, or redirects appropriately and returns null.
export async function requireApproval(router) {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    router.push('/login')
    return null
  }

  const { data: memberData } = await supabase
    .from('family_members')
    .select('*')
    .eq('auth_user_id', user.id)
    .single()

  if (!memberData) {
    router.push('/join')
    return null
  }

  if (!memberData.approved) {
    router.push('/pending')
    return null
  }

  return memberData
}