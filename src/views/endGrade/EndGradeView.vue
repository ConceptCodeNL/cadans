<template>
  <AppLayout>
    <div v-if="loading" class="text-center py-12">
      <p class="text-text-secondary">{{ $t('common.loading') }}</p>
    </div>

    <div v-else-if="!session" class="text-center py-12">
      <p class="text-text-secondary">{{ $t('common.error') }}</p>
    </div>

    <div v-else>
      <div class="mb-8">
        <RouterLink
          :to="`/session/${session.id}`"
          class="text-text-secondary hover:text-text-primary mb-4 inline-block"
        >
          ← {{ $t('common.back') }}
        </RouterLink>
        <h1 class="font-heading text-4xl mt-4">{{ $t('endGrade.title') }}</h1>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Teacher Grade -->
        <div class="bg-surface rounded-xl p-6 border border-border">
          <h2 class="font-heading text-2xl mb-4">{{ $t('endGrade.teacherGrade') }} *</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Grade (0-10)</label>
              <input
                v-model.number="formData.teacherGrade"
                type="number"
                min="0"
                max="10"
                step="0.1"
                required
                class="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">{{ $t('meetings.notes') }}</label>
              <textarea
                v-model="formData.teacherNotes"
                rows="4"
                class="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <!-- Company Grader Advice (if invited) -->
        <div v-if="session.company_grader_id" class="bg-surface rounded-xl p-6 border border-border">
          <h2 class="font-heading text-2xl mb-4">{{ $t('endGrade.companyAdvice') }}</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Advice Grade (0-10)</label>
              <input
                v-model.number="formData.companyGraderAdvice"
                type="number"
                min="0"
                max="10"
                step="0.1"
                class="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">{{ $t('meetings.notes') }}</label>
              <textarea
                v-model="formData.companyGraderNotes"
                rows="4"
                class="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <!-- Calculated Final Grade -->
        <div v-if="calculatedGrade" class="bg-primary-light rounded-xl p-6 border border-primary">
          <h3 class="font-heading text-xl mb-2 text-primary-text">{{ $t('endGrade.finalGrade') }}: {{ calculatedGrade }}</h3>
          <p class="text-sm text-text-secondary">{{ $t('endGrade.calculated') }}</p>
        </div>

        <div v-if="error" class="text-error text-sm">
          {{ error }}
        </div>

        <div class="flex gap-4">
          <button
            type="button"
            @click="$router.back()"
            class="flex-1 px-6 py-3 border border-border rounded-lg font-semibold hover:bg-hover transition-colors"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            type="submit"
            :disabled="submitting"
            class="flex-1 px-6 py-3 bg-primary text-primary-text rounded-lg font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            {{ submitting ? $t('common.loading') : $t('common.save') }}
          </button>
          <button
            v-if="canFinalize"
            type="button"
            @click="handleFinalize"
            :disabled="finalizing"
            class="flex-1 px-6 py-3 bg-success text-white rounded-lg font-semibold hover:bg-success-dark transition-colors disabled:opacity-50"
          >
            {{ finalizing ? $t('common.loading') : $t('endGrade.finalize') }}
          </button>
        </div>
      </form>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useSessionsStore } from '@/stores/sessions'
import { useEndGradesStore } from '@/stores/endGrades'
import AppLayout from '@/components/AppLayout.vue'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const route = useRoute()
const sessionsStore = useSessionsStore()
const endGradesStore = useEndGradesStore()

const loading = ref(true)
const submitting = ref(false)
const finalizing = ref(false)
const error = ref('')
const session = ref(null)
const calculatedGrade = ref(null)

const formData = ref({
  teacherGrade: null,
  teacherNotes: '',
  companyGraderAdvice: null,
  companyGraderNotes: '',
})

onMounted(async () => {
  const sessionId = route.params.sessionId
  await sessionsStore.fetchSession(sessionId)
  session.value = sessionsStore.currentSession
  
  await endGradesStore.fetchEndGrade(sessionId)
  if (endGradesStore.currentEndGrade) {
    formData.value = {
      teacherGrade: endGradesStore.currentEndGrade.teacher_grade,
      teacherNotes: endGradesStore.currentEndGrade.teacher_notes || '',
      companyGraderAdvice: endGradesStore.currentEndGrade.company_grader_advice,
      companyGraderNotes: endGradesStore.currentEndGrade.company_grader_notes || '',
    }
    calculatedGrade.value = endGradesStore.currentEndGrade.final_grade
  } else {
    calculatedGrade.value = await endGradesStore.calculateFinalGrade(sessionId, formData.value)
  }
  
  loading.value = false
})

const canFinalize = computed(() => {
  return formData.value.teacherGrade != null && calculatedGrade.value != null
})

async function handleSubmit() {
  submitting.value = true
  error.value = ''
  
  const gradeData = {
    teacher_grade: formData.value.teacherGrade,
    teacher_notes: formData.value.teacherNotes || null,
    company_grader_advice: formData.value.companyGraderAdvice || null,
    company_grader_notes: formData.value.companyGraderNotes || null,
  }
  
  const { data, error: saveError } = await endGradesStore.createOrUpdateEndGrade(
    session.value.id,
    gradeData
  )
  
  if (saveError) {
    error.value = saveError
  } else {
    calculatedGrade.value = data.final_grade
  }
  
  submitting.value = false
}

async function handleFinalize() {
  if (!confirm('Are you sure you want to finalize this grade? This action cannot be undone.')) {
    return
  }
  
  finalizing.value = true
  error.value = ''
  
  const { error: finalizeError } = await endGradesStore.finalizeEndGrade(session.value.id)
  
  if (finalizeError) {
    error.value = finalizeError
  } else {
    window.location.href = `/session/${session.value.id}`
  }
  
  finalizing.value = false
}
</script>
