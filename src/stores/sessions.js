import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useSessionsStore = defineStore('sessions', () => {
  const sessions = ref([])
  const currentSession = ref(null)
  const loading = ref(false)
  const error = ref(null)

  function generateCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  async function fetchSessions() {
    try {
      loading.value = true
      error.value = null
      const { data, error: fetchError } = await supabase
        .from('grading_sessions')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (fetchError) throw fetchError
      sessions.value = data || []
      return { data, error: null }
    } catch (err) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function fetchSession(id) {
    try {
      loading.value = true
      error.value = null
      const { data, error: fetchError } = await supabase
        .from('grading_sessions')
        .select('*')
        .eq('id', id)
        .single()
      
      if (fetchError) throw fetchError
      currentSession.value = data
      return { data, error: null }
    } catch (err) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function createSession({ code, type, company, ownReference }) {
    try {
      loading.value = true
      error.value = null

      // Generate code if not provided
      if (!code) {
        code = generateCode()
      }

      // Validate code
      if (!/^[A-Z0-9]{6}$/.test(code)) {
        throw new Error('Student code must be exactly 6 alphanumeric characters')
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Get default competencies
      const { data: competencies } = await supabase
        .from('competency_templates')
        .select('id, name, description, default_weight')
        .eq('is_system_default', true)
        .order('order', { ascending: true })

      const sessionCompetencies = (competencies || []).map(c => ({
        id: c.id,
        name: c.name,
        description: c.description || '',
        weight: c.default_weight,
      }))

      // Create the session
      const { data: session, error: insertError } = await supabase
        .from('grading_sessions')
        .insert({
          code,
          type: type || 'standard_intern',
          company: company || '',
          own_reference: ownReference || '',
          teacher_id: user.id,
          start_date: null,
          end_date: null,
          number_of_meetings: 3,
          competencies: sessionCompetencies,
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Auto-create 3 empty meetings
      const meetingInserts = []
      for (let i = 1; i <= 3; i++) {
        meetingInserts.push({
          grading_session_id: session.id,
          meeting_number: i,
          meeting_date: null,
          graded_by: user.id,
          status: 'draft',
        })
      }

      const { error: meetingsError } = await supabase
        .from('meetings')
        .insert(meetingInserts)

      if (meetingsError) throw meetingsError

      sessions.value.unshift(session)
      return { data: session, error: null }
    } catch (err) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function updateSession(id, updates) {
    try {
      loading.value = true
      error.value = null
      const { data, error: updateError } = await supabase
        .from('grading_sessions')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (updateError) throw updateError
      
      const index = sessions.value.findIndex(s => s.id === id)
      if (index !== -1) {
        sessions.value[index] = data
      }
      if (currentSession.value?.id === id) {
        currentSession.value = data
      }
      
      return { data, error: null }
    } catch (err) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function deleteSession(id) {
    try {
      loading.value = true
      error.value = null
      const { error: deleteError } = await supabase
        .from('grading_sessions')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      sessions.value = sessions.value.filter(s => s.id !== id)
      if (currentSession.value?.id === id) {
        currentSession.value = null
      }
      return { error: null }
    } catch (err) {
      error.value = err.message
      return { error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function inviteReviewer(sessionId, email, role) {
    try {
      loading.value = true
      error.value = null
      
      const token = generateInvitationToken()
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7)
      
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data, error: insertError } = await supabase
        .from('invitations')
        .insert({
          grading_session_id: sessionId,
          email,
          role,
          token,
          invited_by: user.id,
          expires_at: expiresAt.toISOString(),
        })
        .select()
        .single()
      
      if (insertError) throw insertError
      return { data, error: null }
    } catch (err) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  function generateInvitationToken() {
    return Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
  }

  function generateAccessCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  async function generateStudentCode(sessionId) {
    try {
      const code = generateAccessCode()
      const { data, error: updateError } = await supabase
        .from('grading_sessions')
        .update({
          student_access_code: code,
          student_code_attempts: 0,
          student_code_locked: false,
        })
        .eq('id', sessionId)
        .select()
        .single()

      if (updateError) throw updateError

      if (currentSession.value?.id === sessionId) {
        currentSession.value = data
      }
      const index = sessions.value.findIndex(s => s.id === sessionId)
      if (index !== -1) sessions.value[index] = data

      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  async function generateReviewerCode(sessionId) {
    try {
      const code = generateAccessCode()
      const { data, error: updateError } = await supabase
        .from('grading_sessions')
        .update({
          reviewer_access_code: code,
          reviewer_code_attempts: 0,
          reviewer_code_locked: false,
        })
        .eq('id', sessionId)
        .select()
        .single()

      if (updateError) throw updateError

      if (currentSession.value?.id === sessionId) {
        currentSession.value = data
      }
      const index = sessions.value.findIndex(s => s.id === sessionId)
      if (index !== -1) sessions.value[index] = data

      return { data, error: null }
    } catch (err) {
      return { data: null, error: err.message }
    }
  }

  async function verifyAccessCode(sessionId, code, role) {
    // role = 'student' or 'reviewer'
    try {
      const codeField = role === 'student' ? 'student_access_code' : 'reviewer_access_code'
      const attemptsField = role === 'student' ? 'student_code_attempts' : 'reviewer_code_attempts'
      const lockedField = role === 'student' ? 'student_code_locked' : 'reviewer_code_locked'

      // Fetch current session data
      const { data: session, error: fetchError } = await supabase
        .from('grading_sessions')
        .select('id, ' + codeField + ', ' + attemptsField + ', ' + lockedField)
        .eq('id', sessionId)
        .single()

      if (fetchError) throw fetchError
      if (!session) throw new Error('Session not found')

      // Check if locked
      if (session[lockedField]) {
        return { success: false, locked: true, attemptsLeft: 0 }
      }

      // Check if code exists
      if (!session[codeField]) {
        return { success: false, locked: false, attemptsLeft: 0, noCode: true }
      }

      // Verify code
      if (session[codeField] === code.toUpperCase()) {
        // Reset attempts on success
        await supabase
          .from('grading_sessions')
          .update({ [attemptsField]: 0 })
          .eq('id', sessionId)

        return { success: true, locked: false }
      }

      // Wrong code - increment attempts
      const newAttempts = (session[attemptsField] || 0) + 1
      const updates = { [attemptsField]: newAttempts }

      if (newAttempts >= 10) {
        // Lock the code
        updates[lockedField] = true
        updates[codeField] = null // Remove the code
      }

      await supabase
        .from('grading_sessions')
        .update(updates)
        .eq('id', sessionId)

      return {
        success: false,
        locked: newAttempts >= 10,
        attemptsLeft: Math.max(0, 10 - newAttempts),
      }
    } catch (err) {
      return { success: false, locked: false, attemptsLeft: 0, error: err.message }
    }
  }

  return {
    sessions,
    currentSession,
    loading,
    error,
    fetchSessions,
    fetchSession,
    createSession,
    updateSession,
    deleteSession,
    inviteReviewer,
    generateCode,
    generateStudentCode,
    generateReviewerCode,
    verifyAccessCode,
  }
})
