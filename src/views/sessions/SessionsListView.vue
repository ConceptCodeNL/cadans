<template>
  <AppLayout>
    <div class="flex justify-between items-center mb-8">
      <h1 class="font-heading text-4xl">{{ $t('sessions.title') }}</h1>
      <button
        @click="showCreateModal = true"
        class="px-6 py-3 bg-primary text-primary-text rounded-lg font-semibold hover:bg-primary-hover transition-colors"
      >
        {{ $t('sessions.create') }}
      </button>
    </div>

    <div v-if="sessionsStore.loading && sessionsStore.sessions.length === 0" class="text-center py-12">
      <p class="text-text-secondary">{{ $t('common.loading') }}</p>
    </div>

    <div v-else-if="sessionsStore.sessions.length === 0" class="text-center py-12 bg-surface rounded-xl">
      <p class="text-text-secondary mb-4">{{ $t('sessions.noSessions') }}</p>
      <p class="text-text-tertiary text-sm">{{ $t('sessions.createFirst') }}</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div
        v-for="session in sessionsStore.sessions"
        :key="session.id"
        class="bg-surface rounded-xl p-6 border border-border transition-colors"
      >
        <div class="flex justify-between items-start mb-3">
          <div>
            <h3 class="font-heading text-2xl mb-1">{{ session.code }}</h3>
            <div class="flex flex-wrap gap-2 mb-2">
              <span
                class="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                :class="getTypeClass(session.type)"
              >
                {{ $t(`sessions.types.${session.type}`) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Meta info -->
        <div class="space-y-1 mb-4 text-sm text-text-secondary">
          <p>
            <span class="text-text-tertiary">{{ $t('sessions.ownReference') }}:</span> {{ session.own_reference || $t('common.notSet') }}
          </p>
          <p>
            <span class="text-text-tertiary">{{ $t('sessions.company') }}:</span> {{ session.company || $t('common.notSet') }}
          </p>
          <p>
            <span class="text-text-tertiary">{{ $t('sessions.startDate') }}:</span>
            {{ session.start_date ? formatDate(session.start_date) : $t('common.notSet') }}
          </p>
        </div>

        <!-- Teacher meeting buttons -->
        <p class="text-xs text-text-tertiary font-medium mb-1">{{ $t('sessions.teacherRow') }}</p>
        <div class="flex gap-2 mb-2">
          <RouterLink
            v-for="meeting in getMeetings(session.id)"
            :key="meeting.id"
            :to="`/session/${session.id}/meeting/${meeting.id}`"
            :class="[
              'flex-1 py-2 rounded-lg text-center text-xs font-semibold transition-colors',
              getMeetingClass(meeting.overall_grade)
            ]"
            :title="meeting.is_end_grade ? $t('meetings.endGrade') : `${$t('meetings.meeting')} ${meeting.meeting_number}`"
          >
            {{ meeting.is_end_grade ? 'EB' : meeting.meeting_number }}
          </RouterLink>
        </div>

        <!-- Reviewer meeting buttons -->
        <p class="text-xs text-text-tertiary font-medium mb-1">{{ $t('sessions.reviewerRow') }}</p>
        <div class="flex gap-2 mb-2">
          <div
            v-for="meeting in getMeetings(session.id)"
            :key="'r-' + meeting.id"
            :class="[
              'flex-1 py-2 rounded-lg text-center text-xs font-semibold',
              session.reviewer_access_code
                ? 'bg-info-light text-info-text border border-info-border'
                : 'bg-hover text-text-tertiary border border-border'
            ]"
            :title="meeting.is_end_grade ? $t('meetings.endGrade') : `${$t('meetings.meeting')} ${meeting.meeting_number}`"
          >
            {{ meeting.is_end_grade ? 'EB' : meeting.meeting_number }}
          </div>
        </div>

        <!-- Student meeting buttons -->
        <p class="text-xs text-text-tertiary font-medium mb-1">{{ $t('sessions.studentRow') }}</p>
        <div class="flex gap-2 mb-4">
          <div
            v-for="meeting in getMeetings(session.id)"
            :key="'s-' + meeting.id"
            :class="[
              'flex-1 py-2 rounded-lg text-center text-xs font-semibold',
              session.student_access_code
                ? 'bg-primary-light text-primary-dark border border-primary'
                : 'bg-hover text-text-tertiary border border-border'
            ]"
            :title="meeting.is_end_grade ? $t('meetings.endGrade') : `${$t('meetings.meeting')} ${meeting.meeting_number}`"
          >
            {{ meeting.is_end_grade ? 'EB' : meeting.meeting_number }}
          </div>
        </div>

        <RouterLink
          :to="`/session/${session.id}`"
          class="block w-full px-4 py-2 bg-surface-elevated border border-border rounded-lg font-semibold hover:border-primary transition-colors text-center text-sm"
        >
          {{ $t('sessions.viewSession') }} →
        </RouterLink>
      </div>
    </div>

    <!-- Create Session Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-bg flex items-center justify-center z-50 p-4"
      style="background-color: rgba(0,0,0,0.5);"
      @click.self="showCreateModal = false"
    >
      <div class="bg-surface-elevated rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <h2 class="font-heading text-3xl mb-6">{{ $t('sessions.create') }}</h2>
        
        <div class="space-y-4">
          <!-- Session Type -->
          <div>
            <label class="block text-sm font-medium mb-2">
              {{ $t('sessions.type') }} *
            </label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                @click="newType = 'standard_intern'"
                :class="[
                  'px-4 py-3 rounded-xl font-semibold transition-all text-sm',
                  newType === 'standard_intern'
                    ? 'bg-primary text-primary-text scale-105'
                    : 'bg-surface border-2 border-border hover:border-primary'
                ]"
              >
                {{ $t('sessions.types.standard_intern') }}
              </button>
              <button
                type="button"
                @click="newType = 'graduation'"
                :class="[
                  'px-4 py-3 rounded-xl font-semibold transition-all text-sm',
                  newType === 'graduation'
                    ? 'bg-primary text-primary-text scale-105'
                    : 'bg-surface border-2 border-border hover:border-primary'
                ]"
              >
                {{ $t('sessions.types.graduation') }}
              </button>
            </div>
          </div>

          <!-- Privacy warning -->
          <div class="bg-warning-light border border-warning-border rounded-lg p-4 flex gap-3">
            <svg class="w-5 h-5 text-warning flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p class="text-sm text-warning-text">
              {{ $t('sessions.privacyWarning') }}
            </p>
          </div>

          <!-- Session Code -->
          <div>
            <label class="block text-sm font-medium mb-2">
              {{ $t('sessions.code') }} ({{ $t('common.optional') }})
            </label>
            <input
              v-model="newCode"
              type="text"
              maxlength="6"
              placeholder="ABC123"
              class="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary uppercase"
              @input="newCode = newCode.toUpperCase().replace(/[^A-Z0-9]/g, '')"
            />
            <p class="text-sm text-text-tertiary mt-1">
              {{ $t('sessions.generateHint') }}
            </p>
          </div>

          <!-- Company -->
          <div>
            <label class="block text-sm font-medium mb-2">
              {{ $t('sessions.company') }} ({{ $t('common.optional') }})
            </label>
            <input
              v-model="newCompany"
              type="text"
              :placeholder="$t('sessions.companyPlaceholder')"
              class="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <!-- Own Reference -->
          <div>
            <label class="block text-sm font-medium mb-2">
              {{ $t('sessions.ownReference') }} ({{ $t('common.optional') }})
            </label>
            <input
              v-model="newOwnReference"
              type="text"
              :placeholder="$t('sessions.ownReferencePlaceholder')"
              class="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <!-- Info box -->
          <div class="bg-info-light border border-info-border rounded-lg p-4">
            <p class="text-sm text-info-text">
              {{ $t('sessions.autoCreateInfo') }}
            </p>
          </div>

          <div v-if="createError" class="text-error text-sm">
            {{ createError }}
          </div>

          <div class="flex gap-4">
            <button
              @click="closeModal"
              class="flex-1 px-4 py-3 border border-border rounded-lg font-semibold hover:bg-hover transition-colors"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              @click="handleCreate"
              :disabled="sessionsStore.loading"
              class="flex-1 px-4 py-3 bg-primary text-primary-text rounded-lg font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50"
            >
              {{ sessionsStore.loading ? $t('common.loading') : $t('common.create') }}
            </button>
          </div>
        </div>
      </div>
    </div>

  </AppLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, RouterLink } from 'vue-router'
import { useSessionsStore } from '@/stores/sessions'
import { supabase } from '@/lib/supabase'
import AppLayout from '@/components/AppLayout.vue'

const { t: $t } = useI18n()
const router = useRouter()
const sessionsStore = useSessionsStore()

const showCreateModal = ref(false)
const newCode = ref('')
const newType = ref('standard_intern')
const newCompany = ref('')
const newOwnReference = ref('')
const createError = ref('')

// Meetings per session: { sessionId: [meeting, ...] }
const meetingsMap = reactive({})

onMounted(async () => {
  await sessionsStore.fetchSessions()
  await fetchAllMeetings()
})

async function fetchAllMeetings() {
  const sessionIds = sessionsStore.sessions.map(s => s.id)
  if (sessionIds.length === 0) return

  const { data } = await supabase
    .from('meetings')
    .select('id, grading_session_id, meeting_number, overall_grade, status, student_token, reviewer_token, is_end_grade')
    .in('grading_session_id', sessionIds)
    .order('meeting_number', { ascending: true })

  // Group by session
  for (const meeting of (data || [])) {
    if (!meetingsMap[meeting.grading_session_id]) {
      meetingsMap[meeting.grading_session_id] = []
    }
    meetingsMap[meeting.grading_session_id].push(meeting)
  }
}

function getMeetings(sessionId) {
  return meetingsMap[sessionId] || []
}

function getMeetingClass(overallGrade) {
  switch (overallGrade) {
    case 'bad':
      return 'bg-error border border-error-border text-white hover:bg-error-dark'
    case 'go_but_needs_attention':
      return 'bg-warning border border-warning-border text-white hover:bg-warning-dark'
    case 'all_good':
      return 'bg-success border border-success-border text-white hover:bg-success-dark'
    default:
      return 'bg-hover border border-border text-text-tertiary hover:bg-active'
  }
}

function closeModal() {
  showCreateModal.value = false
  newCode.value = ''
  newType.value = 'standard_intern'
  newCompany.value = ''
  newOwnReference.value = ''
  createError.value = ''
}

async function handleCreate() {
  createError.value = ''
  
  const { data, error } = await sessionsStore.createSession({
    code: newCode.value.trim() || null,
    type: newType.value,
    company: newCompany.value.trim(),
    ownReference: newOwnReference.value.trim(),
  })
  
  if (error) {
    createError.value = error
  } else {
    closeModal()
    if (data) {
      router.push(`/session/${data.id}`)
    }
  }
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString()
}

function getTypeClass(type) {
  const classes = {
    standard_intern: 'bg-info-light text-info-text border border-info-border',
    graduation: 'bg-primary-light text-primary-text border border-primary',
  }
  return classes[type] || classes.standard_intern
}

</script>
