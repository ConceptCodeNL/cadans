import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Initialize auth state
  supabase.auth.getSession().then(({ data: { session } }) => {
    user.value = session?.user ?? null
  })

  // Listen for auth changes
  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null
  })

  async function signIn(email, password) {
    try {
      loading.value = true
      error.value = null
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (authError) throw authError
      user.value = data.user
      return { user: data.user, error: null }
    } catch (err) {
      error.value = err.message
      return { user: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function signUp(email, password, metadata = {}) {
    try {
      loading.value = true
      error.value = null
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      })
      if (authError) throw authError
      return { user: data.user, error: null }
    } catch (err) {
      error.value = err.message
      return { user: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function signOut() {
    try {
      loading.value = true
      error.value = null
      const { error: authError } = await supabase.auth.signOut()
      if (authError) throw authError
      user.value = null
      return { error: null }
    } catch (err) {
      error.value = err.message
      return { error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function resetPassword(email) {
    try {
      loading.value = true
      error.value = null
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (authError) throw authError
      return { error: null }
    } catch (err) {
      error.value = err.message
      return { error: err.message }
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }
})


