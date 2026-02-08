import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useEndGradesStore = defineStore('endGrades', () => {
  const endGrades = ref([])
  const currentEndGrade = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchEndGrade(sessionId) {
    try {
      loading.value = true
      error.value = null
      const { data, error: fetchError } = await supabase
        .from('end_grades')
        .select('*')
        .eq('grading_session_id', sessionId)
        .single()
      
      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError // PGRST116 = not found
      currentEndGrade.value = data
      return { data, error: null }
    } catch (err) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function createOrUpdateEndGrade(sessionId, gradeData) {
    try {
      loading.value = true
      error.value = null
      
      // Calculate final grade if we have all meeting data
      const finalGrade = await calculateFinalGrade(sessionId, gradeData)
      
      const updateData = {
        ...gradeData,
        final_grade: finalGrade,
        teacher_submitted_at: gradeData.teacher_grade ? new Date().toISOString() : null,
        company_grader_submitted_at: gradeData.company_grader_advice ? new Date().toISOString() : null,
      }
      
      // Determine status
      if (updateData.teacher_grade && updateData.company_grader_advice) {
        updateData.status = 'completed'
      } else if (updateData.teacher_grade || updateData.company_grader_advice) {
        updateData.status = 'partial'
      }
      
      const { data, error: upsertError } = await supabase
        .from('end_grades')
        .upsert({
          grading_session_id: sessionId,
          ...updateData,
        })
        .select()
        .single()
      
      if (upsertError) throw upsertError
      currentEndGrade.value = data
      return { data, error: null }
    } catch (err) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function calculateFinalGrade(sessionId, gradeData) {
    try {
      // Get all meetings for this session
      const { data: meetings } = await supabase
        .from('meetings')
        .select('competency_scores')
        .eq('grading_session_id', sessionId)
        .eq('status', 'submitted')
      
      if (!meetings || meetings.length === 0) {
        return gradeData.teacher_grade || null
      }
      
      // Get session competencies
      const { data: session } = await supabase
        .from('grading_sessions')
        .select('competencies')
        .eq('id', sessionId)
        .single()
      
      if (!session || !session.competencies) {
        return gradeData.teacher_grade || null
      }
      
      // Calculate weighted average
      const competencies = session.competencies
      const competencyAverages = {}
      const competencyWeights = {}
      
      // Calculate average for each competency
      competencies.forEach(comp => {
        const scores = meetings
          .map(m => m.competency_scores?.[comp.id])
          .filter(s => s != null)
        
        if (scores.length > 0) {
          const avg = scores.reduce((a, b) => a + b, 0) / scores.length
          competencyAverages[comp.id] = avg
          competencyWeights[comp.id] = comp.weight || 1.0
        }
      })
      
      // Calculate weighted average
      let totalWeighted = 0
      let totalWeight = 0
      
      Object.keys(competencyAverages).forEach(compId => {
        const avg = competencyAverages[compId]
        const weight = competencyWeights[compId]
        totalWeighted += avg * weight
        totalWeight += weight
      })
      
      if (totalWeight > 0) {
        return Math.round((totalWeighted / totalWeight) * 10) / 10
      }
      
      return gradeData.teacher_grade || null
    } catch (err) {
      console.error('Error calculating final grade:', err)
      return gradeData.teacher_grade || null
    }
  }

  async function finalizeEndGrade(sessionId) {
    try {
      loading.value = true
      error.value = null
      
      const { data, error: updateError } = await supabase
        .from('end_grades')
        .update({
          status: 'completed',
          finalized_at: new Date().toISOString(),
        })
        .eq('grading_session_id', sessionId)
        .select()
        .single()
      
      if (updateError) throw updateError
      
      // Also update session status
      await supabase
        .from('grading_sessions')
        .update({ status: 'completed' })
        .eq('id', sessionId)
      
      currentEndGrade.value = data
      return { data, error: null }
    } catch (err) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  return {
    endGrades,
    currentEndGrade,
    loading,
    error,
    fetchEndGrade,
    createOrUpdateEndGrade,
    calculateFinalGrade,
    finalizeEndGrade,
  }
})

