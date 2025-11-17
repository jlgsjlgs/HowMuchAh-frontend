// src/services/authService.ts
import { supabase } from '@/lib/supabase'

export const authService = {
  signInWithGoogle: async (redirectTo?: string) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectTo || `${window.location.origin}/dashboard`,
      }
    })
    if (error) throw error
  },

  // Sync user with backend after login
  syncUserWithBackend: async () => {
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      throw new Error('No active session')
    }
    
    try {
      const response = await fetch(`${import.meta.env.VITE_SPRINGBOOT_ENDPOINT}/api/auth/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Backend sync failed: ${response.status}`)
      }
      
      const backendUser = await response.json()
      return backendUser
    } catch (error) {
      console.error('Failed to sync user with backend:', error)
      throw error
    }
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }
}