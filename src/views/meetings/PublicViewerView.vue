<template>
  <div class="min-h-screen bg-bg">
    <!-- Header -->
    <header class="border-b border-border bg-surface">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <span class="font-heading text-3xl tracking-wide">CADANS</span>
        <span
          v-if="verified"
          class="text-xs font-medium px-2 py-1 rounded-full bg-surface-elevated text-text-secondary border border-border"
        >
          {{ $t('sessions.viewerRow') }}
        </span>
      </div>
    </header>

    <div class="container mx-auto px-4 py-8">
      <!-- Loading -->
      <div v-if="pageLoading" class="text-center py-12">
        <p class="text-text-secondary">{{ $t('common.loading') }}</p>
      </div>

      <!-- Invalid link -->
      <div
        v-else-if="invalidLink"
        class="text-center py-12 bg-surface rounded-xl border border-border max-w-md mx-auto"
      >
        <svg class="w-16 h-16 mx-auto text-text-tertiary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
        <p class="text-text-secondary text-lg">{{ $t('publicAccess.invalidLink') }}</p>
      </div>

      <!-- Code entry screen -->
      <div v-else-if="!verified" class="max-w-sm mx-auto">
        <div class="bg-surface rounded-2xl p-8 border border-border">
          <div class="text-center mb-8">
            <span class="font-heading text-3xl tracking-wide">CADANS</span>
            <h1 class="font-heading text-2xl mt-4 mb-2">{{ $t('publicAccess.title') }}</h1>
            <p class="text-text-secondary text-sm">
              {{ $t('sessions.viewerRow') }}
              — {{ meetingData?.is_end_grade ? $t('meetings.endGrade') : `${$t('meetings.meeting')} ${meetingData?.meeting_number}` }}
            </p>
          </div>

          <!-- Locked state -->
          <div v-if="locked" class="text-center">
            <div class="bg-error/10 border border-error rounded-xl p-6 mb-4">
              <svg class="w-12 h-12 mx-auto text-error mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h2 class="font-heading text-xl text-error mb-2">{{ $t('publicAccess.locked') }}</h2>
              <p class="text-sm text-error/80">{{ $t('publicAccess.lockedMessage') }}</p>
            </div>
          </div>

          <!-- Code entry form -->
          <div v-else>
            <label class="block text-sm font-medium mb-2">{{ $t('publicAccess.enterCode') }}</label>
            <input
              v-model="codeInput"
              type="text"
              maxlength="8"
              :placeholder="$t('publicAccess.codePlaceholder')"
              class="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary uppercase text-center font-mono text-lg tracking-widest mb-4"
              @input="codeInput = codeInput.toUpperCase().replace(/[^A-Z0-9]/g, '')"
              @keydown.enter="handleVerify"
            >
            <p v-if="codeError" class="text-error text-sm mb-4">{{ codeError }}</p>
            <button
              type="button"
              :disabled="verifying || !codeInput"
              class="w-full py-3 bg-primary text-primary-text rounded-lg font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50"
              @click="handleVerify"
            >
              {{ verifying ? $t('common.loading') : $t('publicAccess.verify') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Read-only view -->
      <div v-else>
        <div class="mb-6 space-y-3">
          <div class="flex items-center justify-between gap-4 flex-wrap">
            <h1 class="font-heading text-4xl">
              {{ meetingData.is_end_grade ? $t('meetings.endGrade') : `${$t('meetings.meeting')} ${meetingData.meeting_number}` }}
            </h1>
            <!-- Prev / Next navigation aligned to the right of the title -->
            <div v-if="sessionMeetings.length > 1" class="flex items-center gap-2">
              <button
                type="button"
                :disabled="!prevMeeting"
                class="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-surface hover:bg-surface-elevated text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                @click="prevMeeting && navigateTo(prevMeeting)"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                {{ prevMeeting ? (prevMeeting.is_end_grade ? $t('meetings.endGrade') : `${$t('meetings.meeting')} ${prevMeeting.meeting_number}`) : '' }}
              </button>
              <span class="text-sm text-text-tertiary px-1">{{ currentMeetingIndex + 1 }} / {{ sessionMeetings.length }}</span>
              <button
                type="button"
                :disabled="!nextMeeting"
                class="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-surface hover:bg-surface-elevated text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                @click="nextMeeting && navigateTo(nextMeeting)"
              >
                {{ nextMeeting ? (nextMeeting.is_end_grade ? $t('meetings.endGrade') : `${$t('meetings.meeting')} ${nextMeeting.meeting_number}`) : '' }}
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <div class="flex items-center gap-3 flex-wrap">
            <span class="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-surface-elevated text-text-secondary border border-border">
              {{ $t('sessions.viewerRow') }}
            </span>
            <span class="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-warning-light text-warning-text">
              {{ $t('meetings.viewOnly') }}
            </span>
          </div>
        </div>

        <!-- Tab bar -->
        <div class="flex gap-1 mb-8 border-b border-border">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            :class="[
              'px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px',
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
            ]"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- No data yet -->
        <div v-if="!activeHasData" class="text-center py-16 bg-surface rounded-xl border border-border">
          <svg class="w-16 h-16 mx-auto text-text-tertiary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p class="text-text-secondary text-lg">{{ $t('meetings.viewerNoDataYet') }}</p>
        </div>

        <!-- Tab content -->
        <div v-else class="space-y-8">
          <!-- Meeting Date & Overall Grade -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label class="block text-xs text-text-tertiary uppercase tracking-wide mb-2">{{ $t('meetings.date') }}</label>
              <p class="px-4 py-3 border border-border rounded-lg bg-surface-elevated text-text-primary">
                {{ activeDate ? formatDate(activeDate) : $t('common.notSet') }}
              </p>
            </div>

            <div v-if="!meetingData.is_end_grade" class="md:col-span-3">
              <label class="block text-xs text-text-tertiary uppercase tracking-wide mb-2">{{ $t('meetings.overallGrade') }}</label>
              <div class="grid grid-cols-3 gap-2">
                <div
                  :class="[
                    'px-3 py-3 rounded-xl font-semibold text-sm text-center',
                    activeOverallGrade === 'bad'
                      ? 'bg-error text-white'
                      : 'bg-surface border-2 border-border opacity-40'
                  ]"
                >{{ $t('meetings.bad') }}</div>
                <div
                  :class="[
                    'px-3 py-3 rounded-xl font-semibold text-sm text-center',
                    activeOverallGrade === 'go_but_needs_attention'
                      ? 'bg-warning text-white'
                      : 'bg-surface border-2 border-border opacity-40'
                  ]"
                >{{ $t('meetings.goButNeedsAttention') }}</div>
                <div
                  :class="[
                    'px-3 py-3 rounded-xl font-semibold text-sm text-center',
                    activeOverallGrade === 'all_good'
                      ? 'bg-success text-white'
                      : 'bg-surface border-2 border-border opacity-40'
                  ]"
                >{{ $t('meetings.allGood') }}</div>
              </div>
            </div>
          </div>

          <!-- Competency Scores -->
          <div>
            <h2 class="font-heading text-2xl mb-4">{{ $t('meetings.competencyScores') }}</h2>

            <!-- Average advice banner -->
            <div class="flex gap-4 mb-6">
              <div :class="['rounded-xl p-4 border flex items-center gap-3 flex-1', activeAverageAdvice.bannerClass]">
                <div :class="['flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white', activeAverageAdvice.iconClass]">
                  {{ activeAverageAdvice.numericAvg ?? '–' }}
                </div>
                <div>
                  <p class="text-xs font-medium uppercase tracking-wide opacity-75">{{ $t('meetings.scoreAdvice') }}</p>
                  <p class="font-heading text-lg">{{ activeAverageAdvice.label }}</p>
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <div
                v-for="comp in visibleCompetencies"
                :key="comp.id"
                :class="['bg-surface rounded-xl p-6', comp.endGradeOnly ? 'border-2 border-primary' : 'border border-border']"
              >
                <div class="flex gap-6">
                  <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-center mb-2">
                      <h3 class="font-heading text-xl">{{ localized(comp.name) }}</h3>
                      <span class="text-sm text-text-secondary">Weight: {{ comp.weight }}x</span>
                    </div>

                    <!-- Competency description accordion -->
                    <div v-if="localized(comp.description)" class="mb-4">
                      <button
                        type="button"
                        class="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-dark transition-colors"
                        @click="expandedCompetencies[comp.id] = !expandedCompetencies[comp.id]"
                      >
                        <svg
                          class="w-4 h-4 transition-transform duration-200"
                          :class="{ 'rotate-90': expandedCompetencies[comp.id] }"
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
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
                          {{ localized(comp.description) }}
                        </div>
                      </Transition>
                    </div>

                    <!-- Score buttons (read-only) -->
                    <div class="mb-4">
                      <div class="grid grid-cols-5 gap-2">
                        <div
                          v-for="level in scoreLevels"
                          :key="level.value"
                          :class="[
                            'px-2 py-2.5 rounded-xl font-semibold text-xs text-center',
                            activeScores[comp.id] === level.value
                              ? level.activeClass
                              : 'bg-surface border-2 border-border opacity-40'
                          ]"
                        >
                          {{ $t(level.label) }}
                        </div>
                      </div>
                    </div>

                    <!-- Tips & Tops (read-only) -->
                    <div>
                      <span class="text-sm font-medium">{{ $t('meetings.tipsAndTops') }}</span>
                      <div
                        v-if="!getCompetencyTipsTops(comp.id).length"
                        class="mt-2 text-center py-4 rounded-lg border border-dashed border-border"
                      >
                        <p class="text-text-tertiary text-xs">{{ $t('meetings.noTipsTops') }}</p>
                      </div>
                      <div v-else class="mt-2 space-y-2">
                        <div
                          v-for="item in getCompetencyTipsTops(comp.id)"
                          :key="item.id"
                          :class="[
                            'flex items-start gap-3 p-3 rounded-lg border',
                            item.type === 'tip' ? 'bg-warning-light border-warning-border' : 'bg-success-light border-success-border'
                          ]"
                        >
                          <div :class="['flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center', item.type === 'tip' ? 'bg-warning text-white' : 'bg-success text-white']">
                            <svg v-if="item.type === 'tip'" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                          </div>
                          <div class="flex-1 min-w-0">
                            <span :class="['inline-block text-xs font-bold uppercase tracking-wide mb-0.5', item.type === 'tip' ? 'text-warning-text' : 'text-success-text']">
                              {{ item.type === 'tip' ? $t('meetings.tip') : $t('meetings.top') }}
                            </span>
                            <p class="text-sm text-text-primary">{{ item.text }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Numeric grade (end grade only, read-only) -->
                  <div
                    v-if="meetingData.is_end_grade && activeTab !== 'student'"
                    class="flex-shrink-0 flex flex-col items-center justify-center"
                  >
                    <label class="text-xs text-text-tertiary font-medium mb-2 uppercase tracking-wide">{{ $t('meetings.competencyGrade') }}</label>
                    <div class="w-24 h-24 flex items-center justify-center text-3xl font-bold border-2 border-border rounded-xl bg-surface-elevated text-text-primary">
                      {{ activeCompetencyGrades[comp.id] ?? '–' }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- General Notes -->
          <div v-if="activeGeneralNotes">
            <label class="block text-sm font-medium mb-2">{{ $t('meetings.generalNotes') }}</label>
            <div class="w-full px-4 py-3 border border-border rounded-lg bg-surface-elevated text-text-primary whitespace-pre-wrap">
              {{ activeGeneralNotes }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { supabase } from '@/lib/supabase'

const { t: $t, locale } = useI18n()
const route = useRoute()
const router = useRouter()

const pageLoading = ref(true)
const invalidLink = ref(false)
const verified = ref(false)
const locked = ref(false)
const verifying = ref(false)
const codeInput = ref('')
const codeError = ref('')
const activeTab = ref('teacher')

const meetingData = ref(null)
const sessionData = ref(null)
const sessionMeetings = ref([])
const expandedCompetencies = reactive({})

const tabs = computed(() => [
  { id: 'teacher', label: $t('sessions.teacherRow') },
  { id: 'reviewer', label: $t('sessions.reviewerRow') },
  { id: 'student', label: $t('sessions.studentRow') },
])

const scoreLevels = [
  { value: 1, label: 'meetings.scoreBad', activeClass: 'bg-error text-white' },
  { value: 2, label: 'meetings.scoreNeedsAttention', activeClass: 'bg-warning text-white' },
  { value: 3, label: 'meetings.scoreNeutral', activeClass: 'bg-info text-white' },
  { value: 4, label: 'meetings.scoreGood', activeClass: 'bg-primary text-primary-text' },
  { value: 5, label: 'meetings.scorePerfect', activeClass: 'bg-success text-white' },
]

async function loadMeetingForToken(token) {
  const { data: meeting, error: fetchError } = await supabase
    .from('meetings')
    .select('*')
    .eq('viewer_token', token)
    .single()

  if (fetchError || !meeting) {
    invalidLink.value = true
    return null
  }

  meetingData.value = meeting
  return meeting
}

onMounted(async () => {
  const token = route.params.token

  const meeting = await loadMeetingForToken(token)

  if (!meeting) {
    pageLoading.value = false
    return
  }

  const { data: session } = await supabase
    .from('grading_sessions')
    .select('*')
    .eq('id', meeting.grading_session_id)
    .single()

  if (session) {
    sessionData.value = session
    if (session.viewer_code_locked) {
      locked.value = true
    }
    if (!session.viewer_access_code && !session.viewer_code_locked) {
      invalidLink.value = true
    }
    // Auto-verify if already verified for this session
    if (sessionStorage.getItem(`viewer_verified_${session.id}`)) {
      verified.value = true
      await loadSessionMeetings(session.id)
    }
  } else {
    invalidLink.value = true
  }

  pageLoading.value = false
})

watch(
  () => route.params.token,
  async newToken => {
    if (!newToken || !verified.value) return
    pageLoading.value = true
    invalidLink.value = false
    await loadMeetingForToken(newToken)
    pageLoading.value = false
  }
)

async function handleVerify() {
  if (!codeInput.value.trim() || verifying.value) return

  verifying.value = true
  codeError.value = ''

  const { data: session } = await supabase
    .from('grading_sessions')
    .select('id, viewer_access_code, viewer_code_attempts, viewer_code_locked')
    .eq('id', meetingData.value.grading_session_id)
    .single()

  if (!session) {
    codeError.value = 'Session not found'
    verifying.value = false
    return
  }

  if (session.viewer_code_locked) {
    locked.value = true
    verifying.value = false
    return
  }

  if (session.viewer_access_code === codeInput.value.toUpperCase()) {
    await supabase
      .from('grading_sessions')
      .update({ viewer_code_attempts: 0 })
      .eq('id', session.id)

    sessionStorage.setItem(`viewer_verified_${session.id}`, '1')
    await loadSessionMeetings(session.id)
    verified.value = true
  } else {
    const newAttempts = (session.viewer_code_attempts || 0) + 1
    const updates = { viewer_code_attempts: newAttempts }

    if (newAttempts >= 10) {
      updates.viewer_code_locked = true
      updates.viewer_access_code = null
    }

    await supabase
      .from('grading_sessions')
      .update(updates)
      .eq('id', session.id)

    if (newAttempts >= 10) {
      locked.value = true
    } else {
      codeError.value = $t('publicAccess.wrongCode', { attemptsLeft: 10 - newAttempts })
    }
  }

  verifying.value = false
}

async function loadSessionMeetings(sessionId) {
  const { data } = await supabase
    .from('meetings')
    .select('id, meeting_number, is_end_grade, viewer_token')
    .eq('grading_session_id', sessionId)
    .order('meeting_number', { ascending: true })
  sessionMeetings.value = data || []
}

const currentMeetingIndex = computed(() =>
  sessionMeetings.value.findIndex(m => m.id === meetingData.value?.id)
)
const prevMeeting = computed(() => sessionMeetings.value[currentMeetingIndex.value - 1] ?? null)
const nextMeeting = computed(() => sessionMeetings.value[currentMeetingIndex.value + 1] ?? null)

function navigateTo(meeting) {
  router.push(`/m/v/${meeting.viewer_token}`)
}

function localized(value) {
  if (typeof value === 'object' && value !== null) {
    return value[locale.value] || value['nl'] || value['en'] || ''
  }
  return value || ''
}

function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

// Per-tab data accessors
const activeScores = computed(() => {
  if (!meetingData.value) return {}
  if (activeTab.value === 'reviewer') return meetingData.value.reviewer_competency_scores || {}
  if (activeTab.value === 'student') return meetingData.value.student_competency_scores || {}
  return meetingData.value.competency_scores || {}
})

const activeCompetencyGrades = computed(() => {
  if (!meetingData.value) return {}
  if (activeTab.value === 'reviewer') return meetingData.value.reviewer_competency_grades || {}
  return meetingData.value.competency_grades || {}
})

const activeTipsTops = computed(() => {
  if (!meetingData.value) return {}
  if (activeTab.value === 'reviewer') return meetingData.value.reviewer_competency_notes || {}
  if (activeTab.value === 'student') return meetingData.value.student_competency_notes || {}
  return meetingData.value.competency_notes || {}
})

const activeOverallGrade = computed(() => {
  if (!meetingData.value) return null
  if (activeTab.value === 'reviewer') return meetingData.value.reviewer_overall_grade
  if (activeTab.value === 'student') return meetingData.value.student_overall_grade
  return meetingData.value.overall_grade
})

const activeDate = computed(() => {
  if (!meetingData.value) return null
  if (activeTab.value === 'reviewer') return meetingData.value.reviewer_meeting_date
  if (activeTab.value === 'student') return meetingData.value.student_meeting_date
  return meetingData.value.meeting_date
})

const activeGeneralNotes = computed(() => {
  if (!meetingData.value) return null
  if (activeTab.value === 'reviewer') return meetingData.value.reviewer_general_notes
  if (activeTab.value === 'student') return meetingData.value.student_general_notes
  return meetingData.value.general_notes
})

const activeHasData = computed(() => {
  if (!meetingData.value) return false
  const scores = activeScores.value
  return Object.values(scores).some(v => v != null)
})

const visibleCompetencies = computed(() => {
  if (!sessionData.value?.competencies) return []
  const isEndGrade = meetingData.value?.is_end_grade
  return sessionData.value.competencies.filter(comp => isEndGrade || !comp.endGradeOnly)
})

const activeAverageAdvice = computed(() => {
  const comps = visibleCompetencies.value
  let totalWeighted = 0
  let totalWeight = 0
  let hasAny = false

  comps.forEach(comp => {
    const score = activeScores.value[comp.id]
    if (score != null) {
      hasAny = true
      const w = comp.weight || 1
      totalWeighted += score * w
      totalWeight += w
    }
  })

  if (!hasAny || totalWeight === 0) {
    return { label: $t('meetings.noScoresYet'), numericAvg: null, bannerClass: 'bg-surface-elevated border-border', iconClass: 'bg-border' }
  }

  const avg = totalWeighted / totalWeight
  const rounded = Math.round(avg * 10) / 10

  if (avg <= 1.5) return { label: $t('meetings.scoreBad'), numericAvg: rounded, bannerClass: 'bg-error/10 border-error text-error', iconClass: 'bg-error' }
  if (avg <= 2.5) return { label: $t('meetings.scoreNeedsAttention'), numericAvg: rounded, bannerClass: 'bg-warning/10 border-warning text-warning-text', iconClass: 'bg-warning' }
  if (avg <= 3.5) return { label: $t('meetings.scoreNeutral'), numericAvg: rounded, bannerClass: 'bg-info/10 border-info text-info-text', iconClass: 'bg-info' }
  if (avg < 4.5) return { label: $t('meetings.scoreGood'), numericAvg: rounded, bannerClass: 'bg-primary/10 border-primary text-primary-dark', iconClass: 'bg-primary' }
  return { label: $t('meetings.scorePerfect'), numericAvg: rounded, bannerClass: 'bg-success/10 border-success text-success-text', iconClass: 'bg-success' }
})

function getCompetencyTipsTops(compId) {
  const notes = activeTipsTops.value[compId]
  return Array.isArray(notes) ? notes : []
}
</script>

<style scoped>
.accordion-enter-active { transition: all 0.25s ease-out; }
.accordion-leave-active { transition: all 0.2s ease-in; }
.accordion-enter-from,
.accordion-leave-to { opacity: 0; max-height: 0; transform: translateY(-4px); }
.accordion-enter-to,
.accordion-leave-from { opacity: 1; max-height: 500px; }
</style>
