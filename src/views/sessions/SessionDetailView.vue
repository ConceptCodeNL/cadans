<template>
  <AppLayout>
    <div v-if="loading" class="text-center py-12">
      <p class="text-text-secondary">{{ $t('common.loading') }}</p>
    </div>

    <div v-else-if="!session" class="text-center py-12">
      <p class="text-text-secondary">Session not found</p>
      <RouterLink to="/sessions" class="text-primary-text hover:underline mt-4 inline-block">
        ← {{ $t('common.back') }}
      </RouterLink>
    </div>

    <div v-else>
      <!-- Header -->
      <div class="mb-8">
        <RouterLink
          to="/sessions"
          class="text-text-secondary hover:text-text-primary mb-4 inline-block"
        >
          ← {{ $t('common.back') }}
        </RouterLink>

        <div class="flex items-center gap-4 mt-4">
          <h1 class="font-heading text-4xl">{{ session.code }}</h1>
          <span
            class="inline-block px-3 py-1 rounded-full text-xs font-semibold"
            :class="getTypeClass(session.type)"
          >
            {{ $t(`sessions.types.${session.type}`) }}
          </span>
          <span
            class="inline-block px-3 py-1 rounded-full text-xs font-semibold"
            :class="getStatusClass(session.status)"
          >
            {{ $t(`sessions.${session.status}`) }}
          </span>
        </div>

        <!-- Session details -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 bg-surface rounded-xl p-6 border border-border">
          <div class="space-y-3">
            <div v-if="session.company">
              <p class="text-xs text-text-tertiary uppercase tracking-wide">{{ $t('sessions.company') }}</p>
              <p class="font-medium">{{ session.company }}</p>
            </div>
            <div v-if="session.own_reference">
              <p class="text-xs text-text-tertiary uppercase tracking-wide">{{ $t('sessions.ownReference') }}</p>
              <p class="font-medium">{{ session.own_reference }}</p>
            </div>
            <div>
              <p class="text-xs text-text-tertiary uppercase tracking-wide">{{ $t('sessions.meetings') }}</p>
              <p class="font-medium">{{ session.number_of_meetings }}</p>
            </div>
          </div>
          <div class="space-y-3">
            <div>
              <p class="text-xs text-text-tertiary uppercase tracking-wide">{{ $t('sessions.startDate') }}</p>
              <p class="font-medium">{{ session.start_date ? formatDate(session.start_date) : $t('common.notSet') }}</p>
            </div>
            <div>
              <p class="text-xs text-text-tertiary uppercase tracking-wide">{{ $t('sessions.endDate') }}</p>
              <p class="font-medium">{{ session.end_date ? formatDate(session.end_date) : $t('common.notSet') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Meetings Section -->
      <div class="mb-8">
        <div class="flex justify-between items-center mb-4">
          <h2 class="font-heading text-2xl">{{ $t('meetings.title') }}</h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <RouterLink
            v-for="meeting in meetings"
            :key="meeting.id"
            :to="`/session/${session.id}/meeting/${meeting.id}`"
            class="bg-surface rounded-xl p-6 border border-border hover:border-primary transition-colors"
          >
            <h3 class="font-heading text-xl mb-2">
              {{ $t('meetings.meeting') }} {{ meeting.meeting_number }}
            </h3>
            <p class="text-sm text-text-secondary mb-2">
              {{ meeting.meeting_date ? formatDate(meeting.meeting_date) : $t('common.notSet') }}
            </p>
            <span
              class="inline-block px-3 py-1 rounded-full text-sm font-semibold"
              :class="getMeetingStatusClass(meeting.status)"
            >
              {{ $t(`meetings.${meeting.status}`) }}
            </span>
          </RouterLink>
        </div>
      </div>

      <!-- End Grade Section -->
      <div class="mb-8">
        <h2 class="font-heading text-2xl mb-4">{{ $t('endGrade.title') }}</h2>
        <RouterLink
          :to="`/session/${session.id}/end-grade`"
          class="block bg-surface rounded-xl p-6 border border-border hover:border-primary transition-colors"
        >
          <div class="flex justify-between items-center">
            <p class="text-text-secondary">{{ $t('endGrade.create') }}</p>
            <svg class="w-6 h-6 text-text-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </RouterLink>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSessionsStore } from '@/stores/sessions'
import { useMeetingsStore } from '@/stores/meetings'
import AppLayout from '@/components/AppLayout.vue'

const { t: $t } = useI18n()
const route = useRoute()
const sessionsStore = useSessionsStore()
const meetingsStore = useMeetingsStore()

const loading = ref(true)
const session = ref(null)
const meetings = ref([])

onMounted(async () => {
  const sessionId = route.params.id
  
  const [sessionResult] = await Promise.all([
    sessionsStore.fetchSession(sessionId),
    meetingsStore.fetchMeetings(sessionId),
  ])
  
  session.value = sessionResult.data
  meetings.value = meetingsStore.meetings
  loading.value = false
})

function formatDate(dateString) {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}

function getTypeClass(type) {
  const classes = {
    standard_intern: 'bg-info-light text-info-text border border-info-border',
    graduation: 'bg-primary-light text-primary-text border border-primary',
  }
  return classes[type] || classes.standard_intern
}

function getStatusClass(status) {
  const classes = {
    active: 'bg-primary-light text-primary-text',
    completed: 'bg-success-light text-success-text',
    archived: 'bg-muted text-muted-text',
  }
  return classes[status] || classes.active
}

function getMeetingStatusClass(status) {
  const classes = {
    draft: 'bg-warning-light text-warning-text',
    submitted: 'bg-success-light text-success-text',
  }
  return classes[status] || classes.draft
}
</script>
