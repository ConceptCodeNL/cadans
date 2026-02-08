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
        <!-- Meeting Date & Overall Grade side by side -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
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
          <div class="md:col-span-3">
            <label class="block text-sm font-medium mb-2">
              {{ $t('meetings.overallGrade') }} *
            </label>
            <div class="grid grid-cols-3 gap-2">
              <button
                type="button"
                @click="formData.overallGrade = 'bad'"
                :class="[
                  'px-3 py-3 rounded-xl font-semibold text-sm transition-all',
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
                  'px-3 py-3 rounded-xl font-semibold text-sm transition-all',
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
                  'px-3 py-3 rounded-xl font-semibold text-sm transition-all',
                  formData.overallGrade === 'all_good'
                    ? 'bg-success text-white scale-105'
                    : 'bg-surface border-2 border-border hover:border-success'
                ]"
              >
                {{ $t('meetings.allGood') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Competency Scores -->
        <div>
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-heading text-2xl">{{ $t('meetings.competencyScores') }}</h2>
          </div>

          <!-- Advice banner based on average score -->
          <div
            :class="[
              'rounded-xl p-4 mb-6 border flex items-center gap-3 transition-all',
              averageAdvice.bannerClass
            ]"
          >
            <div
              :class="[
                'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white',
                averageAdvice.iconClass
              ]"
            >
              {{ averageAdvice.numericAvg ?? '–' }}
            </div>
            <div>
              <p class="text-xs font-medium uppercase tracking-wide opacity-75">{{ $t('meetings.scoreAdvice') }}</p>
              <p class="font-heading text-lg">{{ averageAdvice.label }}</p>
            </div>
          </div>
          <div class="space-y-6">
            <div
              v-for="comp in session.competencies"
              :key="comp.id"
              class="bg-surface rounded-xl p-6 border border-border"
            >
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-heading text-xl">{{ comp.name }}</h3>
                <span class="text-sm text-text-secondary">Weight: {{ comp.weight }}x</span>
              </div>

              <!-- Competency description accordion -->
              <div v-if="comp.description" class="mb-4">
                <button
                  type="button"
                  @click="toggleCompetencyInfo(comp.id)"
                  class="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-dark transition-colors"
                >
                  <svg
                    class="w-4 h-4 transition-transform duration-200"
                    :class="{ 'rotate-90': expandedCompetencies[comp.id] }"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                  {{ $t('meetings.competencyInfo') }}
                </button>
                <Transition name="accordion">
                  <div
                    v-if="expandedCompetencies[comp.id]"
                    class="mt-2 p-4 bg-surface-elevated rounded-lg border border-border text-sm text-text-secondary whitespace-pre-line leading-relaxed"
                  >
                    {{ comp.description }}
                  </div>
                </Transition>
              </div>

              <!-- Score buttons -->
              <div class="mb-4">
                <div class="grid grid-cols-5 gap-2">
                  <button
                    v-for="level in scoreLevels"
                    :key="level.value"
                    type="button"
                    @click="formData.competencyScores[comp.id] = level.value"
                    :class="[
                      'px-2 py-2.5 rounded-xl font-semibold text-xs transition-all text-center',
                      formData.competencyScores[comp.id] === level.value
                        ? level.activeClass
                        : 'bg-surface border-2 border-border ' + level.hoverClass
                    ]"
                  >
                    {{ $t(level.label) }}
                  </button>
                </div>
              </div>

              <!-- Tips & Tops per competency -->
              <div>
                <div class="flex items-center justify-between mb-3">
                  <span class="text-sm font-medium">{{ $t('meetings.tipsAndTops') }}</span>
                  <div class="flex gap-2">
                    <button
                      type="button"
                      @click="openTipTopModal('tip', comp.id)"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-warning-light text-warning-text border border-warning-border rounded-lg text-xs font-semibold hover:bg-warning hover:text-white transition-all"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      {{ $t('meetings.addTip') }}
                    </button>
                    <button
                      type="button"
                      @click="openTipTopModal('top', comp.id)"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-success-light text-success-text border border-success-border rounded-lg text-xs font-semibold hover:bg-success hover:text-white transition-all"
                    >
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      {{ $t('meetings.addTop') }}
                    </button>
                  </div>
                </div>

                <!-- Competency Tips & Tops List -->
                <div
                  v-if="getCompetencyTipsTops(comp.id).length === 0"
                  class="text-center py-4 rounded-lg border border-dashed border-border"
                >
                  <p class="text-text-tertiary text-xs">{{ $t('meetings.noTipsTops') }}</p>
                </div>

                <div v-else class="space-y-2">
                  <div
                    v-for="(item, index) in getCompetencyTipsTops(comp.id)"
                    :key="item.id"
                    :class="[
                      'flex items-start gap-3 p-3 rounded-lg border transition-all',
                      item.type === 'tip'
                        ? 'bg-warning-light border-warning-border'
                        : 'bg-success-light border-success-border'
                    ]"
                  >
                    <!-- Icon -->
                    <div
                      :class="[
                        'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center',
                        item.type === 'tip' ? 'bg-warning text-white' : 'bg-success text-white'
                      ]"
                    >
                      <svg v-if="item.type === 'tip'" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                    </div>

                    <!-- Content -->
                    <div class="flex-1 min-w-0">
                      <span
                        :class="[
                          'inline-block text-xs font-bold uppercase tracking-wide mb-0.5',
                          item.type === 'tip' ? 'text-warning-text' : 'text-success-text'
                        ]"
                      >
                        {{ item.type === 'tip' ? $t('meetings.tip') : $t('meetings.top') }}
                      </span>
                      <p class="text-sm text-text-primary">{{ item.text }}</p>
                    </div>

                    <!-- Actions -->
                    <div class="flex-shrink-0 flex gap-1">
                      <button
                        type="button"
                        @click="editTipTop(comp.id, index)"
                        class="p-1.5 text-text-tertiary hover:text-text-primary rounded-lg hover:bg-surface transition-colors"
                        :aria-label="$t('common.edit')"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        @click="deleteTipTop(comp.id, index)"
                        class="p-1.5 text-text-tertiary hover:text-error rounded-lg hover:bg-surface transition-colors"
                        :aria-label="$t('common.delete')"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
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
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
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

// Score level definitions
const scoreLevels = [
  {
    value: 1,
    label: 'meetings.scoreBad',
    activeClass: 'bg-error text-white scale-105',
    hoverClass: 'hover:border-error',
  },
  {
    value: 2,
    label: 'meetings.scoreNeedsAttention',
    activeClass: 'bg-warning text-white scale-105',
    hoverClass: 'hover:border-warning',
  },
  {
    value: 3,
    label: 'meetings.scoreNeutral',
    activeClass: 'bg-info text-white scale-105',
    hoverClass: 'hover:border-info',
  },
  {
    value: 4,
    label: 'meetings.scoreGood',
    activeClass: 'bg-primary text-primary-text scale-105',
    hoverClass: 'hover:border-primary',
  },
  {
    value: 5,
    label: 'meetings.scorePerfect',
    activeClass: 'bg-success text-white scale-105',
    hoverClass: 'hover:border-success',
  },
]

// Accordion state for competency descriptions
const expandedCompetencies = reactive({})

function toggleCompetencyInfo(compId) {
  expandedCompetencies[compId] = !expandedCompetencies[compId]
}

// Tip/Top modal state
const showTipTopModal = ref(false)
const tipTopModalType = ref('tip')
const tipTopText = ref('')
const editingTipTopIndex = ref(null)
const editingCompetencyId = ref(null)
const tipTopInput = ref(null)

const formData = ref({
  meetingDate: '',
  overallGrade: '',
  competencyScores: {},
  competencyTipsTops: {}, // { [compId]: [{ id, type, text }] }
  generalNotes: '',
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
      // Support both old competency_notes (string) and new competency_tips_tops (array) format
      const competencyTipsTops = meeting.value.competency_notes || {}
      
      formData.value = {
        meetingDate: meeting.value.meeting_date || '',
        overallGrade: meeting.value.overall_grade || '',
        competencyScores: meeting.value.competency_scores || {},
        competencyTipsTops: competencyTipsTops,
        generalNotes: meeting.value.general_notes || '',
      }

      // Initialize any missing competency tips/tops arrays
      if (session.value) {
        session.value.competencies.forEach(comp => {
          if (!formData.value.competencyTipsTops[comp.id] || !Array.isArray(formData.value.competencyTipsTops[comp.id])) {
            formData.value.competencyTipsTops[comp.id] = []
          }
        })
      }
    }
  } else {
    // New meeting - initialize with session competencies
    if (session.value) {
      session.value.competencies.forEach(comp => {
        formData.value.competencyScores[comp.id] = null
        formData.value.competencyTipsTops[comp.id] = []
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

// Compute weighted average and map to advice word
const averageAdvice = computed(() => {
  if (!session.value) {
    return { label: $t('meetings.noScoresYet'), numericAvg: null, bannerClass: 'bg-surface-elevated border-border', iconClass: 'bg-border' }
  }

  const comps = session.value.competencies
  let totalWeighted = 0
  let totalWeight = 0
  let hasAnyScore = false

  comps.forEach(comp => {
    const score = formData.value.competencyScores[comp.id]
    if (score != null) {
      hasAnyScore = true
      const weight = comp.weight || 1
      totalWeighted += score * weight
      totalWeight += weight
    }
  })

  if (!hasAnyScore || totalWeight === 0) {
    return { label: $t('meetings.noScoresYet'), numericAvg: null, bannerClass: 'bg-surface-elevated border-border', iconClass: 'bg-border' }
  }

  const avg = totalWeighted / totalWeight
  const rounded = Math.round(avg * 10) / 10

  if (avg <= 1.5) {
    return { label: $t('meetings.scoreBad'), numericAvg: rounded, bannerClass: 'bg-error/10 border-error text-error', iconClass: 'bg-error' }
  } else if (avg <= 2.5) {
    return { label: $t('meetings.scoreNeedsAttention'), numericAvg: rounded, bannerClass: 'bg-warning/10 border-warning text-warning-text', iconClass: 'bg-warning' }
  } else if (avg <= 3.5) {
    return { label: $t('meetings.scoreNeutral'), numericAvg: rounded, bannerClass: 'bg-info/10 border-info text-info-text', iconClass: 'bg-info' }
  } else if (avg < 4.5) {
    return { label: $t('meetings.scoreGood'), numericAvg: rounded, bannerClass: 'bg-primary/10 border-primary text-primary-dark', iconClass: 'bg-primary' }
  } else {
    return { label: $t('meetings.scorePerfect'), numericAvg: rounded, bannerClass: 'bg-success/10 border-success text-success-text', iconClass: 'bg-success' }
  }
})

// Helpers
function getCompetencyTipsTops(compId) {
  return formData.value.competencyTipsTops[compId] || []
}

// Tip/Top functions
function openTipTopModal(type, compId) {
  tipTopModalType.value = type
  tipTopText.value = ''
  editingTipTopIndex.value = null
  editingCompetencyId.value = compId
  showTipTopModal.value = true
  nextTick(() => {
    tipTopInput.value?.focus()
  })
}

function editTipTop(compId, index) {
  const items = formData.value.competencyTipsTops[compId]
  const item = items[index]
  tipTopModalType.value = item.type
  tipTopText.value = item.text
  editingTipTopIndex.value = index
  editingCompetencyId.value = compId
  showTipTopModal.value = true
  nextTick(() => {
    tipTopInput.value?.focus()
  })
}

function deleteTipTop(compId, index) {
  formData.value.competencyTipsTops[compId].splice(index, 1)
}

function saveTipTop() {
  if (!tipTopText.value.trim()) return
  const compId = editingCompetencyId.value

  if (!formData.value.competencyTipsTops[compId]) {
    formData.value.competencyTipsTops[compId] = []
  }

  if (editingTipTopIndex.value !== null) {
    formData.value.competencyTipsTops[compId][editingTipTopIndex.value].text = tipTopText.value.trim()
  } else {
    formData.value.competencyTipsTops[compId].push({
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
  editingCompetencyId.value = null
}

function buildMeetingData(status) {
  return {
    meeting_date: formData.value.meetingDate || null,
    overall_grade: formData.value.overallGrade || null,
    competency_scores: formData.value.competencyScores,
    competency_notes: formData.value.competencyTipsTops,
    general_notes: formData.value.generalNotes || null,
    tips_tops: [], // No longer used globally
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
/* Accordion animations */
.accordion-enter-active {
  transition: all 0.25s ease-out;
}
.accordion-leave-active {
  transition: all 0.2s ease-in;
}
.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-4px);
}
.accordion-enter-to,
.accordion-leave-from {
  opacity: 1;
  max-height: 500px;
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
