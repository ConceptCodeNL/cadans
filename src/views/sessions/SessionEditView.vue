<template>
  <AppLayout>
    <div v-if="loading" class="text-center py-12">
      <p class="text-text-secondary">{{ $t('common.loading') }}</p>
    </div>

    <div v-else-if="!session" class="text-center py-12">
      <p class="text-text-secondary">Session not found</p>
      <RouterLink :to="`/session/${route.params.id}`" class="text-primary-text hover:underline mt-4 inline-block">
        ← {{ $t('common.back') }}
      </RouterLink>
    </div>

    <div v-else>
      <!-- Header -->
      <div class="mb-8">
        <RouterLink
          :to="`/session/${session.id}`"
          class="text-text-secondary hover:text-text-primary mb-4 inline-block"
        >
          ← {{ $t('common.back') }}
        </RouterLink>

        <div class="flex items-center gap-4 mt-4 flex-wrap">
          <h1 class="font-heading text-4xl">
            {{ session.code }}
          </h1>
          <span
            class="inline-block px-3 py-1 rounded-full text-xs font-semibold"
            :class="getTypeClass(session.type)"
          >
            {{ $t(`sessions.types.${session.type}`) }}
          </span>
          <span
            class="inline-block px-3 py-1 rounded-full text-xs font-semibold"
            :class="getStatusClass(form.status)"
          >
            {{ $t(`sessions.${form.status}`) }}
          </span>
        </div>
      </div>

      <!-- Edit form -->
      <form class="space-y-6 max-w-3xl" @submit.prevent="handleSave">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface rounded-xl p-6 border border-border">
          <div class="md:col-span-2 flex justify-end">
            <button
              type="button"
              class="inline-flex items-center gap-2 px-3 py-1.5 bg-surface-elevated border border-error/30 rounded-lg text-xs font-semibold text-error hover:bg-error/10 hover:border-error transition-colors"
              @click="showDeleteConfirm = true"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {{ $t('common.delete') }}
            </button>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-xs text-text-tertiary uppercase tracking-wide mb-1">
                {{ $t('sessions.code') }}
              </label>
              <p class="font-mono text-sm font-bold tracking-widest">
                {{ session.code }}
              </p>
            </div>

            <div>
              <label class="block text-xs text-text-tertiary uppercase tracking-wide mb-1">
                {{ $t('sessions.type') }}
              </label>
              <p class="text-sm text-text-primary">
                {{ $t(`sessions.types.${session.type}`) }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">
                {{ $t('sessions.company') }}
              </label>
              <input
                v-model="form.company"
                type="text"
                :placeholder="$t('sessions.companyPlaceholder')"
                class="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">
                {{ $t('sessions.ownReference') }}
              </label>
              <input
                v-model="form.own_reference"
                type="text"
                :placeholder="$t('sessions.ownReferencePlaceholder')"
                class="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">
                {{ $t('sessions.startDate') }}
              </label>
              <input
                v-model="form.start_date"
                type="date"
                class="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">
                {{ $t('sessions.endDate') }}
              </label>
              <input
                v-model="form.end_date"
                type="date"
                class="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">
                {{ $t('sessions.status') }}
              </label>
              <select
                v-model="form.status"
                class="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface"
              >
                <option value="active">{{ $t('sessions.active') }}</option>
                <option value="completed">{{ $t('sessions.completed') }}</option>
                <option value="archived">{{ $t('sessions.archived') }}</option>
              </select>
            </div>
          </div>
        </div>

        <div v-if="saveError" class="text-error text-sm">
          {{ saveError }}
        </div>

        <div class="flex gap-4">
          <button
            type="button"
            class="flex-1 px-4 py-3 border border-border rounded-lg font-semibold hover:bg-hover transition-colors"
            @click="router.push(`/session/${session.id}`)"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="flex-1 px-4 py-3 bg-primary text-primary-text rounded-lg font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            {{ saving ? $t('common.loading') : $t('common.save') }}
          </button>
        </div>
      </form>
    </div>

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
      v-model="showDeleteConfirm"
      :title="$t('common.confirm')"
      :message="session ? session.code + ' — ' + $t('sessions.deleteConfirm') : ''"
      :confirm-text="$t('common.delete')"
      :cancel-text="$t('common.cancel')"
      variant="danger"
      @confirm="confirmDelete"
    />
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSessionsStore } from '@/stores/sessions'
import AppLayout from '@/components/AppLayout.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

const { t: $t } = useI18n()
const route = useRoute()
const router = useRouter()
const sessionsStore = useSessionsStore()

const loading = ref(true)
const saving = ref(false)
const saveError = ref('')
const session = ref(null)
const showDeleteConfirm = ref(false)

const form = ref({
  company: '',
  own_reference: '',
  start_date: '',
  end_date: '',
  status: 'active',
})

onMounted(async () => {
  const sessionId = route.params.id
  const { data } = await sessionsStore.fetchSession(sessionId)
  session.value = data
  if (data) {
    form.value.company = data.company || ''
    form.value.own_reference = data.own_reference || ''
    form.value.start_date = data.start_date ? data.start_date.substring(0, 10) : ''
    form.value.end_date = data.end_date ? data.end_date.substring(0, 10) : ''
    form.value.status = data.status || 'active'
  }
  loading.value = false
})

async function handleSave() {
  if (!session.value) return
  saving.value = true
  saveError.value = ''

  const updates = {
    company: form.value.company.trim(),
    own_reference: form.value.own_reference.trim(),
    start_date: form.value.start_date || null,
    end_date: form.value.end_date || null,
    status: form.value.status,
  }

  const { error } = await sessionsStore.updateSession(session.value.id, updates)
  if (error) {
    saveError.value = error
  } else {
    router.push(`/session/${session.value.id}`)
  }
  saving.value = false
}

async function confirmDelete() {
  if (!session.value) return
  await sessionsStore.deleteSession(session.value.id)
  router.push('/sessions')
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
    active: 'bg-success-light text-success-text',
    completed: 'bg-success-light text-success-text',
    archived: 'bg-muted text-muted-text',
  }
  return classes[status] || classes.active
}
</script>

