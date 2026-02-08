<template>
  <AppLayout>
    <div v-if="loading" class="text-center py-12">
      <p class="text-text-secondary">{{ $t('common.loading') }}</p>
    </div>

    <div v-else-if="!meeting || !session" class="text-center py-12">
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
        <h1 class="font-heading text-4xl mt-4">
          {{ $t('meetings.meeting') }} {{ meeting.meeting_number }}
        </h1>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Meeting Date -->
        <div>
          <label class="block text-sm font-medium mb-2">
            {{ $t('meetings.date') }}
          </label>
          <input
            v-model="formData.meetingDate"
            type="date"
            class="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <!-- Overall Grade -->
        <div>
          <label class="block text-sm font-medium mb-4">
            {{ $t('meetings.overallGrade') }} *
          </label>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              @click="formData.overallGrade = 'bad'"
              :class="[
                'px-6 py-4 rounded-xl font-semibold text-lg transition-all',
                formData.overallGrade === 'bad'
                  ? 'bg-error text-white scale-105'
                  : 'bg-surface border-2 border-border hover:border-error'
              ]"
            >
              {{ $t('meetings.bad') }}
            </button>
            <button
              type="button"
              @click="formData.overallGrade = 'go_but_needs_attention'"
              :class="[
                'px-6 py-4 rounded-xl font-semibold text-lg transition-all',
                formData.overallGrade === 'go_but_needs_attention'
                  ? 'bg-warning text-white scale-105'
                  : 'bg-surface border-2 border-border hover:border-warning'
              ]"
            >
              {{ $t('meetings.goButNeedsAttention') }}
            </button>
            <button
              type="button"
              @click="formData.overallGrade = 'all_good'"
              :class="[
                'px-6 py-4 rounded-xl font-semibold text-lg transition-all',
                formData.overallGrade === 'all_good'
                  ? 'bg-success text-white scale-105'
                  : 'bg-surface border-2 border-border hover:border-success'
              ]"
            >
              {{ $t('meetings.allGood') }}
            </button>
          </div>
        </div>

        <!-- Competency Scores -->
        <div>
          <h2 class="font-heading text-2xl mb-4">{{ $t('meetings.competencyScores') }}</h2>
          <div class="space-y-6">
            <div
              v-for="comp in session.competencies"
              :key="comp.id"
              class="bg-surface rounded-xl p-6 border border-border"
            >
              <div class="flex justify-between items-center mb-4">
                <h3 class="font-heading text-xl">{{ comp.name }}</h3>
                <span class="text-sm text-text-secondary">Weight: {{ comp.weight }}x</span>
              </div>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium mb-2">
                    Score (1-5)
                  </label>
                  <input
                    v-model.number="formData.competencyScores[comp.id]"
                    type="number"
                    min="1"
                    max="5"
                    class="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-2">
                    {{ $t('meetings.notes') }}
                  </label>
                  <textarea
                    v-model="formData.competencyNotes[comp.id]"
                    rows="3"
                    class="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- General Notes -->
        <div>
          <label class="block text-sm font-medium mb-2">
            {{ $t('meetings.generalNotes') }}
          </label>
          <textarea
            v-model="formData.generalNotes"
            rows="4"
            class="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <!-- Tips & Tops -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-heading text-2xl">{{ $t('meetings.tipsAndTops') }}</h2>
            <div class="flex gap-3">
              <button
                type="button"
                @click="openTipTopModal('tip')"
                class="inline-flex items-center gap-2 px-5 py-2.5 bg-warning-light text-warning-text border border-warning-border rounded-xl font-semibold hover:bg-warning hover:text-white transition-all hover:scale-105"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                {{ $t('meetings.addTip') }}
              </button>
              <button
                type="button"
                @click="openTipTopModal('top')"
                class="inline-flex items-center gap-2 px-5 py-2.5 bg-success-light text-success-text border border-success-border rounded-xl font-semibold hover:bg-success hover:text-white transition-all hover:scale-105"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                {{ $t('meetings.addTop') }}
              </button>
            </div>
          </div>

          <!-- Tips & Tops List -->
          <div v-if="formData.tipsTops.length === 0" class="text-center py-8 bg-surface rounded-xl border border-border">
            <p class="text-text-tertiary">{{ $t('meetings.noTipsTops') }}</p>
          </div>

          <TransitionGroup
            name="tip-top"
            tag="div"
            class="space-y-3"
            v-else
          >
            <div
              v-for="(item, index) in formData.tipsTops"
              :key="item.id"
              :class="[
                'flex items-start gap-4 p-4 rounded-xl border transition-all',
                item.type === 'tip'
                  ? 'bg-warning-light border-warning-border'
                  : 'bg-success-light border-success-border'
              ]"
            >
              <!-- Icon -->
              <div
                :class="[
                  'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                  item.type === 'tip' ? 'bg-warning text-white' : 'bg-success text-white'
                ]"
              >
                <svg v-if="item.type === 'tip'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <span
                  :class="[
                    'inline-block text-xs font-bold uppercase tracking-wide mb-1',
                    item.type === 'tip' ? 'text-warning-text' : 'text-success-text'
                  ]"
                >
                  {{ item.type === 'tip' ? $t('meetings.tip') : $t('meetings.top') }}
                </span>
                <p class="text-text-primary">{{ item.text }}</p>
              </div>

              <!-- Actions -->
              <div class="flex-shrink-0 flex gap-2">
                <button
                  type="button"
                  @click="editTipTop(index)"
                  class="p-2 text-text-tertiary hover:text-text-primary rounded-lg hover:bg-surface transition-colors"
                  :aria-label="$t('common.edit')"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  type="button"
                  @click="deleteTipTop(index)"
                  class="p-2 text-text-tertiary hover:text-error rounded-lg hover:bg-surface transition-colors"
                  :aria-label="$t('common.delete')"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </TransitionGroup>
        </div>

        <div v-if="error" class="text-error text-sm">
          {{ error }}
        </div>

        <div class="flex gap-4">
          <button
            type="button"
            @click="handleSaveDraft"
            :disabled="saving"
            class="flex-1 px-6 py-3 border border-border rounded-lg font-semibold hover:bg-hover transition-colors disabled:opacity-50"
          >
            {{ saving ? $t('common.loading') : $t('meetings.saveDraft') }}
          </button>
          <button
            type="submit"
            :disabled="!canSubmit || submitting"
            class="flex-1 px-6 py-3 bg-primary text-primary-text rounded-lg font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            {{ submitting ? $t('common.loading') : $t('meetings.submit') }}
          </button>
        </div>
      </form>
    </div>

    <!-- Tip/Top Modal -->
    <Transition name="modal">
      <div
        v-if="showTipTopModal"
        class="fixed inset-0 flex items-center justify-center z-50 p-4"
        style="background-color: rgba(0,0,0,0.5);"
        @click.self="closeTipTopModal"
      >
        <Transition name="modal-content">
          <div
            v-if="showTipTopModal"
            :class="[
              'rounded-2xl p-8 max-w-lg w-full shadow-xl bg-surface-elevated border-2',
              tipTopModalType === 'tip' ? 'border-warning-border' : 'border-success-border'
            ]"
          >
            <div class="flex items-center gap-3 mb-6">
              <div
                :class="[
                  'w-12 h-12 rounded-full flex items-center justify-center',
                  tipTopModalType === 'tip' ? 'bg-warning text-white' : 'bg-success text-white'
                ]"
              >
                <svg v-if="tipTopModalType === 'tip'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <h2 class="font-heading text-3xl">
                {{ editingTipTopIndex !== null
                  ? $t('meetings.editTipTop', { type: tipTopModalType === 'tip' ? $t('meetings.tip') : $t('meetings.top') })
                  : (tipTopModalType === 'tip' ? $t('meetings.addTip') : $t('meetings.addTop'))
                }}
              </h2>
            </div>

            <textarea
              ref="tipTopInput"
              v-model="tipTopText"
              rows="4"
              :placeholder="tipTopModalType === 'tip' ? $t('meetings.tipPlaceholder') : $t('meetings.topPlaceholder')"
              class="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-6"
              @keydown.meta.enter="saveTipTop"
              @keydown.ctrl.enter="saveTipTop"
            />

            <div class="flex gap-4">
              <button
                type="button"
                @click="closeTipTopModal"
                class="flex-1 px-4 py-3 border border-border rounded-lg font-semibold hover:bg-hover transition-colors"
              >
                {{ $t('common.cancel') }}
              </button>
              <button
                type="button"
                @click="saveTipTop"
                :disabled="!tipTopText.trim()"
                :class="[
                  'flex-1 px-4 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 text-white',
                  tipTopModalType === 'tip'
                    ? 'bg-warning hover:bg-warning-dark'
                    : 'bg-success hover:bg-success-dark'
                ]"
              >
                {{ $t('common.save') }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useMeetingsStore } from '@/stores/meetings'
import { useSessionsStore } from '@/stores/sessions'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/components/AppLayout.vue'

const { t: $t } = useI18n()
const route = useRoute()
const router = useRouter()
const meetingsStore = useMeetingsStore()
const sessionsStore = useSessionsStore()
const authStore = useAuthStore()

const loading = ref(true)
const saving = ref(false)
const submitting = ref(false)
const error = ref('')
const meeting = ref(null)
const session = ref(null)

// Tip/Top modal state
const showTipTopModal = ref(false)
const tipTopModalType = ref('tip')
const tipTopText = ref('')
const editingTipTopIndex = ref(null)
const tipTopInput = ref(null)

const formData = ref({
  meetingDate: '',
  overallGrade: '',
  competencyScores: {},
  competencyNotes: {},
  generalNotes: '',
  tipsTops: [],
})

onMounted(async () => {
  const sessionId = route.params.sessionId
  const meetingId = route.params.meetingId
  
  await sessionsStore.fetchSession(sessionId)
  session.value = sessionsStore.currentSession
  
  if (meetingId && meetingId !== 'new') {
    await meetingsStore.fetchMeeting(meetingId)
    meeting.value = meetingsStore.currentMeeting
    
    // Load existing data
    if (meeting.value) {
      formData.value = {
        meetingDate: meeting.value.meeting_date || '',
        overallGrade: meeting.value.overall_grade || '',
        competencyScores: meeting.value.competency_scores || {},
        competencyNotes: meeting.value.competency_notes || {},
        generalNotes: meeting.value.general_notes || '',
        tipsTops: meeting.value.tips_tops || [],
      }
    }
  } else {
    // New meeting - initialize with session competencies
    if (session.value) {
      session.value.competencies.forEach(comp => {
        formData.value.competencyScores[comp.id] = null
        formData.value.competencyNotes[comp.id] = ''
      })
    }
  }
  
  loading.value = false
})

const canSubmit = computed(() => {
  if (!formData.value.overallGrade) return false
  if (!session.value) return false
  
  return session.value.competencies.every(comp => 
    formData.value.competencyScores[comp.id] != null
  )
})

// Tip/Top functions
function openTipTopModal(type) {
  tipTopModalType.value = type
  tipTopText.value = ''
  editingTipTopIndex.value = null
  showTipTopModal.value = true
  nextTick(() => {
    tipTopInput.value?.focus()
  })
}

function editTipTop(index) {
  const item = formData.value.tipsTops[index]
  tipTopModalType.value = item.type
  tipTopText.value = item.text
  editingTipTopIndex.value = index
  showTipTopModal.value = true
  nextTick(() => {
    tipTopInput.value?.focus()
  })
}

function deleteTipTop(index) {
  formData.value.tipsTops.splice(index, 1)
}

function saveTipTop() {
  if (!tipTopText.value.trim()) return

  if (editingTipTopIndex.value !== null) {
    formData.value.tipsTops[editingTipTopIndex.value].text = tipTopText.value.trim()
  } else {
    formData.value.tipsTops.push({
      id: Date.now().toString(),
      type: tipTopModalType.value,
      text: tipTopText.value.trim(),
    })
  }

  closeTipTopModal()
}

function closeTipTopModal() {
  showTipTopModal.value = false
  tipTopText.value = ''
  editingTipTopIndex.value = null
}

function buildMeetingData(status) {
  return {
    meeting_date: formData.value.meetingDate || null,
    overall_grade: formData.value.overallGrade || null,
    competency_scores: formData.value.competencyScores,
    competency_notes: formData.value.competencyNotes,
    general_notes: formData.value.generalNotes || null,
    tips_tops: formData.value.tipsTops,
    graded_by: authStore.user.id,
    status,
  }
}

async function handleSaveDraft() {
  saving.value = true
  error.value = ''
  
  const meetingData = buildMeetingData('draft')
  
  if (meeting.value) {
    await meetingsStore.updateMeeting(meeting.value.id, meetingData)
  } else {
    const { data } = await meetingsStore.createMeeting({
      ...meetingData,
      grading_session_id: session.value.id,
      meeting_number: meetingsStore.meetings.length + 1,
    })
    meeting.value = data
  }
  
  saving.value = false
}

async function handleSubmit() {
  if (!canSubmit.value) return
  
  submitting.value = true
  error.value = ''
  
  const meetingData = buildMeetingData('submitted')
  
  if (meeting.value) {
    const { error: updateError } = await meetingsStore.updateMeeting(meeting.value.id, meetingData)
    if (updateError) {
      error.value = updateError
    } else {
      router.push(`/session/${session.value.id}`)
    }
  } else {
    const { data, error: createError } = await meetingsStore.createMeeting({
      ...meetingData,
      grading_session_id: session.value.id,
      meeting_number: meetingsStore.meetings.length + 1,
    })
    if (createError) {
      error.value = createError
    } else {
      router.push(`/session/${session.value.id}`)
    }
  }
  
  submitting.value = false
}
</script>

<style scoped>
/* Tip/Top list animations */
.tip-top-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.tip-top-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.tip-top-enter-from {
  opacity: 0;
  transform: translateY(-12px) scale(0.97);
}
.tip-top-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.97);
}
.tip-top-move {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Modal animations */
.modal-enter-active {
  transition: opacity 0.2s ease;
}
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-content-enter-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-content-leave-active {
  transition: all 0.2s ease;
}
.modal-content-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
.modal-content-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
