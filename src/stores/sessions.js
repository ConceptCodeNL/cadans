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

      // Ensure graduation sessions have the "Defense" competency
      if (data && data.type === 'graduation' && Array.isArray(data.competencies)) {
        const hasDefense = data.competencies.some(c => c.id === 'defense')
        if (!hasDefense) {
          data.competencies.push({
            id: 'defense',
            name: { en: 'Defense', nl: 'Verdediging' },
            description: {
              en: 'Assessment of the student\'s graduation defense presentation and ability to explain and defend their work.',
              nl: 'Beoordeling van de afstudeerverdediging van de student en het vermogen om het werk uit te leggen en te verdedigen.',
            },
            weight: 1,
            endGradeOnly: true,
          })
          // Persist the updated competencies
          await supabase
            .from('grading_sessions')
            .update({ competencies: data.competencies })
            .eq('id', data.id)
        }
      }

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

      // Generate session code if not provided
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

      // Get default competencies (multilingual)
      const { data: competencies } = await supabase
        .from('competency_templates')
        .select('id, name, name_en, name_nl, description, description_en, description_nl, default_weight')
        .eq('is_system_default', true)
        .order('order', { ascending: true })

      const sessionCompetencies = (competencies || []).map(c => ({
        id: c.id,
        name: {
          en: c.name_en || c.name || '',
          nl: c.name_nl || c.name || '',
        },
        description: {
          en: c.description_en || c.description || '',
          nl: c.description_nl || c.description || '',
        },
        weight: c.default_weight,
      }))

      // Add "Defense" competency for graduation sessions (end grade only)
      if (type === 'graduation') {
        sessionCompetencies.push({
          id: 'defense',
          name: { en: 'Defense', nl: 'Verdediging' },
          description: {
            en: 'Assessment of the student\'s graduation defense presentation and ability to explain and defend their work.',
            nl: 'Beoordeling van de afstudeerverdediging van de student en het vermogen om het werk uit te leggen en te verdedigen.',
          },
          weight: 1,
          endGradeOnly: true,
        })
      }

      // Prepare initial access codes for student and reviewer
      const studentAccessCode = generateAccessCode()
      const reviewerAccessCode = generateAccessCode()

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
          number_of_meetings: 4,
          competencies: sessionCompetencies,
          student_access_code: studentAccessCode,
          student_code_attempts: 0,
          student_code_locked: false,
          reviewer_access_code: reviewerAccessCode,
          reviewer_code_attempts: 0,
          reviewer_code_locked: false,
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Auto-create 3 regular meetings + 1 eindbeoordeling
      const meetingInserts = []
      for (let i = 1; i <= 3; i++) {
        meetingInserts.push({
          grading_session_id: session.id,
          meeting_number: i,
          meeting_date: null,
          graded_by: user.id,
          status: 'draft',
          is_end_grade: false,
        })
      }
      // Add eindbeoordeling as the last meeting
      meetingInserts.push({
        grading_session_id: session.id,
        meeting_number: 4,
        meeting_date: null,
        graded_by: user.id,
        status: 'draft',
        is_end_grade: true,
      })

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
