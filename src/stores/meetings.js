import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useMeetingsStore = defineStore('meetings', () => {
  const meetings = ref([])
  const currentMeeting = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchMeetings(sessionId) {
    try {
      loading.value = true
      error.value = null
      const { data, error: fetchError } = await supabase
        .from('meetings')
        .select('*')
        .eq('grading_session_id', sessionId)
        .order('meeting_number', { ascending: true })
      
      if (fetchError) throw fetchError
      meetings.value = data || []
      return { data, error: null }
    } catch (err) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function fetchMeeting(id) {
    try {
      loading.value = true
      error.value = null
      const { data, error: fetchError } = await supabase
        .from('meetings')
        .select('*')
        .eq('id', id)
        .single()
      
      if (fetchError) throw fetchError
      currentMeeting.value = data
      return { data, error: null }
    } catch (err) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function createMeeting(meetingData) {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: insertError } = await supabase
        .from('meetings')
        .insert(meetingData)
        .select()
        .single()
      
      if (insertError) throw insertError
      
      meetings.value.push(data)
      meetings.value.sort((a, b) => a.meeting_number - b.meeting_number)
      return { data, error: null }
    } catch (err) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function updateMeeting(id, updates) {
    try {
      loading.value = true
      error.value = null
      
      // If submitting, set submitted_at
      if (updates.status === 'submitted' && !updates.submitted_at) {
        updates.submitted_at = new Date().toISOString()
      }
      
      const { data, error: updateError } = await supabase
        .from('meetings')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (updateError) throw updateError
      
      const index = meetings.value.findIndex(m => m.id === id)
      if (index !== -1) {
        meetings.value[index] = data
      }
      if (currentMeeting.value?.id === id) {
        currentMeeting.value = data
      }
      
      return { data, error: null }
    } catch (err) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function saveDraft(id, updates) {
    // Auto-save draft every 30 seconds
    return updateMeeting(id, { ...updates, status: 'draft' })
  }

  return {
    meetings,
    currentMeeting,
    loading,
    error,
    fetchMeetings,
    fetchMeeting,
    createMeeting,
    updateMeeting,
    saveDraft,
  }
})


