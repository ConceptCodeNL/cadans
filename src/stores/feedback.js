import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from './auth'

export const useFeedbackStore = defineStore('feedback', () => {
  async function createFeedback({ message, path }) {
    try {
      const authStore = useAuthStore()
      const user = authStore.user
      if (!user) {
        return { data: null, error: 'Not authenticated' }
      }

      const { data, error } = await supabase
        .from('feedback')
        .insert({
          user_id: user.id,
          message,
          path: path || null,
        })
        .select()
        .single()

      if (error) {
        return { data: null, error: error.message || 'Failed to save feedback' }
      }

      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message || 'Failed to save feedback' }
    }
  }

  return {
    createFeedback,
  }
})


