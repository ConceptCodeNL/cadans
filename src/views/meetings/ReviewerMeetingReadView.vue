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
        <div class="flex items-center gap-4 mt-4 flex-wrap">
          <h1 class="font-heading text-4xl">
            {{ meeting.is_end_grade ? $t('meetings.endGrade') : `${$t('meetings.meeting')} ${meeting.meeting_number}` }}
          </h1>
          <span class="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-info-light text-info-text border border-info-border">
            {{ $t('sessions.reviewerRow') }}
          </span>
          <span class="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-warning-light text-warning-text">
            {{ $t('meetings.viewOnly') }}
          </span>
        </div>
      </div>

      <!-- No data yet -->
      <div v-if="!hasReviewerData" class="text-center py-16 bg-surface rounded-xl border border-border">
        <svg class="w-16 h-16 mx-auto text-text-tertiary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p class="text-text-secondary text-lg">{{ $t('meetings.reviewerNoDataYet') }}</p>
      </div>

      <!-- Reviewer data (read-only) -->
      <div v-else class="space-y-8">
        <!-- Meeting Date & Overall Grade -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label class="block text-xs text-text-tertiary uppercase tracking-wide mb-2">
              {{ $t('meetings.date') }}
            </label>
            <p class="px-4 py-3 border border-border rounded-lg bg-surface-elevated text-text-primary">
              {{ meeting.reviewer_meeting_date ? formatDate(meeting.reviewer_meeting_date) : $t('common.notSet') }}
            </p>
          </div>

          <div v-if="!meeting.is_end_grade" class="md:col-span-3">
            <label class="block text-xs text-text-tertiary uppercase tracking-wide mb-2">
              {{ $t('meetings.overallGrade') }}
            </label>
            <div class="grid grid-cols-3 gap-2">
              <div
                :class="[
                  'px-3 py-3 rounded-xl font-semibold text-sm text-center',
                  meeting.reviewer_overall_grade === 'bad'
                    ? 'bg-error text-white'
                    : 'bg-surface border-2 border-border opacity-40'
                ]"
              >
                {{ $t('meetings.bad') }}
              </div>
              <div
                :class="[
                  'px-3 py-3 rounded-xl font-semibold text-sm text-center',
                  meeting.reviewer_overall_grade === 'go_but_needs_attention'
                    ? 'bg-warning text-white'
                    : 'bg-surface border-2 border-border opacity-40'
                ]"
              >
                {{ $t('meetings.goButNeedsAttention') }}
              </div>
              <div
                :class="[
                  'px-3 py-3 rounded-xl font-semibold text-sm text-center',
                  meeting.reviewer_overall_grade === 'all_good'
                    ? 'bg-success text-white'
                    : 'bg-surface border-2 border-border opacity-40'
                ]"
              >
                {{ $t('meetings.allGood') }}
              </div>
            </div>
          </div>
        </div>

        <!-- Competency Scores -->
        <div>
          <h2 class="font-heading text-2xl mb-4">{{ $t('meetings.competencyScores') }}</h2>

          <!-- Average advice banner -->
          <div class="flex gap-4 mb-6">
            <div :class="['rounded-xl p-4 border flex items-center gap-3 flex-1', averageAdvice.bannerClass]">
              <div :class="['flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white', averageAdvice.iconClass]">
                {{ averageAdvice.numericAvg ?? '–' }}
              </div>
              <div>
                <p class="text-xs font-medium uppercase tracking-wide opacity-75">{{ $t('meetings.scoreAdvice') }}</p>
                <p class="font-heading text-lg">{{ averageAdvice.label }}</p>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div
              v-for="comp in visibleCompetencies"
              :key="comp.id"
              :class="[
                'bg-surface rounded-xl p-6',
                comp.endGradeOnly ? 'border-2 border-primary' : 'border border-border'
              ]"
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
                          reviewerScores[comp.id] === level.value
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
                  v-if="meeting.is_end_grade"
                  class="flex-shrink-0 flex flex-col items-center justify-center"
                >
                  <label class="text-xs text-text-tertiary font-medium mb-2 uppercase tracking-wide">{{ $t('meetings.competencyGrade') }}</label>
                  <div class="w-24 h-24 flex items-center justify-center text-3xl font-bold border-2 border-border rounded-xl bg-surface-elevated text-text-primary">
                    {{ reviewerGrades[comp.id] ?? '–' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- General Notes -->
        <div v-if="meeting.reviewer_general_notes">
          <label class="block text-sm font-medium mb-2">{{ $t('meetings.generalNotes') }}</label>
          <div class="w-full px-4 py-3 border border-border rounded-lg bg-surface-elevated text-text-primary whitespace-pre-wrap">
            {{ meeting.reviewer_general_notes }}
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSessionsStore } from '@/stores/sessions'
import { useMeetingsStore } from '@/stores/meetings'
import AppLayout from '@/components/AppLayout.vue'

const { t: $t, locale } = useI18n()
const route = useRoute()
const sessionsStore = useSessionsStore()
const meetingsStore = useMeetingsStore()

const loading = ref(true)
const session = ref(null)
const meeting = ref(null)
const expandedCompetencies = reactive({})

const scoreLevels = [
  { value: 1, label: 'meetings.scoreBad', activeClass: 'bg-error text-white', hoverClass: '' },
  { value: 2, label: 'meetings.scoreNeedsAttention', activeClass: 'bg-warning text-white', hoverClass: '' },
  { value: 3, label: 'meetings.scoreNeutral', activeClass: 'bg-info text-white', hoverClass: '' },
  { value: 4, label: 'meetings.scoreGood', activeClass: 'bg-primary text-primary-text', hoverClass: '' },
  { value: 5, label: 'meetings.scorePerfect', activeClass: 'bg-success text-white', hoverClass: '' },
]

onMounted(async () => {
  const { sessionId, meetingId } = route.params
  const [sessionResult] = await Promise.all([
    sessionsStore.fetchSession(sessionId),
    meetingsStore.fetchMeeting(meetingId),
  ])
  session.value = sessionResult.data
  meeting.value = meetingsStore.currentMeeting
  loading.value = false
})

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

const reviewerScores = computed(() => meeting.value?.reviewer_competency_scores || {})
const reviewerGrades = computed(() => meeting.value?.reviewer_competency_grades || {})
const reviewerNotes = computed(() => meeting.value?.reviewer_competency_notes || {})

const hasReviewerData = computed(() => {
  if (!meeting.value) return false
  const scores = meeting.value.reviewer_competency_scores || {}
  return Object.values(scores).some(v => v != null)
})

const visibleCompetencies = computed(() => {
  if (!session.value?.competencies) return []
  const isEndGrade = meeting.value?.is_end_grade
  return session.value.competencies.filter(comp => isEndGrade || !comp.endGradeOnly)
})

const averageAdvice = computed(() => {
  const comps = visibleCompetencies.value
  let totalWeighted = 0
  let totalWeight = 0
  let hasAny = false

  comps.forEach(comp => {
    const score = reviewerScores.value[comp.id]
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
  const notes = reviewerNotes.value[compId]
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
