import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export const useCompetenciesStore = defineStore('competencies', () => {
  const systemCompetencies = ref([])
  const organizationCompetencies = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchSystemCompetencies() {
    try {
      loading.value = true
      error.value = null
      const { data, error: fetchError } = await supabase
        .from('competency_templates')
        .select('*')
        .eq('is_system_default', true)
        .order('order', { ascending: true })
      
      if (fetchError) throw fetchError
      systemCompetencies.value = data || []
      return { data, error: null }
    } catch (err) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function fetchOrganizationCompetencies(organizationId) {
    try {
      loading.value = true
      error.value = null
      const { data, error: fetchError } = await supabase
        .from('competency_templates')
        .select('*')
        .eq('organization_id', organizationId)
        .order('order', { ascending: true })
      
      if (fetchError) throw fetchError
      organizationCompetencies.value = data || []
      return { data, error: null }
    } catch (err) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function createCompetency(competencyData) {
    try {
      loading.value = true
      error.value = null
      const { data, error: insertError } = await supabase
        .from('competency_templates')
        .insert(competencyData)
        .select()
        .single()
      
      if (insertError) throw insertError
      
      if (competencyData.organization_id) {
        organizationCompetencies.value.push(data)
      } else {
        systemCompetencies.value.push(data)
      }
      
      return { data, error: null }
    } catch (err) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function updateCompetency(id, updates) {
    try {
      loading.value = true
      error.value = null
      const { data, error: updateError } = await supabase
        .from('competency_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (updateError) throw updateError
      
      // Update in appropriate array
      const sysIndex = systemCompetencies.value.findIndex(c => c.id === id)
      if (sysIndex !== -1) {
        systemCompetencies.value[sysIndex] = data
      }
      
      const orgIndex = organizationCompetencies.value.findIndex(c => c.id === id)
      if (orgIndex !== -1) {
        organizationCompetencies.value[orgIndex] = data
      }
      
      return { data, error: null }
    } catch (err) {
      error.value = err.message
      return { data: null, error: err.message }
    } finally {
      loading.value = false
    }
  }

  async function deleteCompetency(id) {
    try {
      loading.value = true
      error.value = null
      const { error: deleteError } = await supabase
        .from('competency_templates')
        .delete()
        .eq('id', id)
      
      if (deleteError) throw deleteError
      
      systemCompetencies.value = systemCompetencies.value.filter(c => c.id !== id)
      organizationCompetencies.value = organizationCompetencies.value.filter(c => c.id !== id)
      
      return { error: null }
    } catch (err) {
      error.value = err.message
      return { error: err.message }
    } finally {
      loading.value = false
    }
  }

  return {
    systemCompetencies,
    organizationCompetencies,
    loading,
    error,
    fetchSystemCompetencies,
    fetchOrganizationCompetencies,
    createCompetency,
    updateCompetency,
    deleteCompetency,
  }
})

