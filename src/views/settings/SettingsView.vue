<template>
  <AppLayout>
    <h1 class="font-heading text-4xl mb-8">{{ $t('navigation.settings') }}</h1>

    <div class="space-y-8">
      <div v-if="isAdmin" class="bg-surface rounded-xl p-6 border border-border">
        <h2 class="font-heading text-2xl mb-4">Competencies</h2>
        <p class="text-text-secondary mb-4">Manage competency templates</p>
        <button class="px-4 py-2 bg-primary text-primary-text rounded-lg font-semibold hover:bg-primary-hover transition-colors">
          Manage Competencies
        </button>
      </div>

      <div class="bg-surface rounded-xl p-6 border border-border">
        <h2 class="font-heading text-2xl mb-4">Theme</h2>
        <div class="flex items-center gap-4">
          <span class="text-text-secondary">Current theme: {{ theme }}</span>
          <ThemeToggle />
        </div>
      </div>

      <div class="bg-surface rounded-xl p-6 border border-border">
        <h2 class="font-heading text-2xl mb-4">Language</h2>
        <LanguageSwitcher />
      </div>

      <!-- Import / Export -->
      <div class="bg-surface rounded-xl p-6 border border-border">
        <h2 class="font-heading text-2xl mb-2">Import / Export</h2>
        <p class="text-text-secondary text-sm mb-4">Export all your sessions to a JSON file, or import sessions from a previously exported file. Duplicate session codes will be suffixed with "(imported)".</p>

        <p v-if="importExportError" class="text-error text-sm mb-3">{{ importExportError }}</p>
        <p v-if="importSuccess" class="text-success-text text-sm mb-3">{{ importSuccess }}</p>

        <div class="flex flex-wrap gap-3">
          <button
            @click="handleExport"
            :disabled="exporting"
            class="px-4 py-2 bg-primary text-primary-text rounded-lg font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50"
          >
            {{ exporting ? 'Exporting…' : 'Export sessions' }}
          </button>

          <label class="px-4 py-2 bg-surface-elevated border border-border rounded-lg font-semibold hover:border-text-secondary transition-colors cursor-pointer">
            {{ importing ? 'Importing…' : 'Import sessions' }}
            <input
              type="file"
              accept=".json"
              class="hidden"
              :disabled="importing"
              @change="handleImport"
            />
          </label>
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="bg-surface rounded-xl p-6 border border-error-border">
        <h2 class="font-heading text-2xl mb-2 text-error">{{ $t('settings.dangerZone') }}</h2>
        <p class="text-text-secondary text-sm mb-4">{{ $t('settings.deleteAccountDescription') }}</p>
        <button
          @click="showConfirm = true"
          class="px-4 py-2 bg-error text-white rounded-lg font-semibold hover:bg-error-dark transition-colors"
        >
          {{ $t('settings.deleteAccount') }}
        </button>
      </div>
    </div>

    <!-- Confirm Delete Modal -->
    <div
      v-if="showConfirm"
      class="fixed inset-0 flex items-center justify-center z-50 p-4"
      style="background-color: rgba(0,0,0,0.5);"
      @click.self="showConfirm = false"
    >
      <div class="bg-surface-elevated rounded-2xl p-8 max-w-sm w-full">
        <h2 class="font-heading text-2xl mb-3">{{ $t('settings.deleteAccountConfirmTitle') }}</h2>
        <p class="text-text-secondary text-sm mb-6">{{ $t('settings.deleteAccountConfirmText') }}</p>
        <p v-if="deleteError" class="text-error text-sm mb-4">{{ deleteError }}</p>
        <div class="flex gap-3">
          <button
            @click="showConfirm = false"
            class="flex-1 px-4 py-3 border border-border rounded-lg font-semibold hover:bg-hover transition-colors"
          >
            {{ $t('common.cancel') }}
          </button>
          <button
            @click="handleDeleteAccount"
            :disabled="deleting"
            class="flex-1 px-4 py-3 bg-error text-white rounded-lg font-semibold hover:bg-error-dark transition-colors disabled:opacity-50"
          >
            {{ deleting ? $t('common.loading') : $t('settings.deleteAccountConfirmButton') }}
          </button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTheme } from '@/composables/useTheme'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'
import AppLayout from '@/components/AppLayout.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const { t: $t } = useI18n()
const router = useRouter()
const { theme } = useTheme()
const authStore = useAuthStore()

const isAdmin = ref(false)
const showConfirm = ref(false)
const deleting = ref(false)
const deleteError = ref('')
const exporting = ref(false)
const importing = ref(false)
const importExportError = ref('')
const importSuccess = ref('')

onMounted(async () => {
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', authStore.user.id)
    .single()
  isAdmin.value = profile?.role === 'admin'
})

async function handleDeleteAccount() {
  deleting.value = true
  deleteError.value = ''
  const { error } = await authStore.deleteAccount()
  if (error) {
    deleteError.value = $t('settings.deleteAccountError')
    deleting.value = false
  } else {
    router.push('/')
  }
}

async function handleExport() {
  exporting.value = true
  importExportError.value = ''
  importSuccess.value = ''
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data: sessions, error: sessionsError } = await supabase
      .from('grading_sessions')
      .select('*')
      .eq('teacher_id', user.id)
      .order('created_at', { ascending: false })

    if (sessionsError) throw sessionsError

    const sessionIds = (sessions || []).map(s => s.id)
    let meetings = []
    if (sessionIds.length > 0) {
      const { data: meetingsData, error: meetingsError } = await supabase
        .from('meetings')
        .select('*')
        .in('grading_session_id', sessionIds)
        .order('meeting_number', { ascending: true })
      if (meetingsError) throw meetingsError
      meetings = meetingsData || []
    }

    const meetingsBySession = {}
    for (const m of meetings) {
      if (!meetingsBySession[m.grading_session_id]) meetingsBySession[m.grading_session_id] = []
      meetingsBySession[m.grading_session_id].push(m)
    }

    const exportData = {
      exportedAt: new Date().toISOString(),
      sessions: (sessions || []).map(s => ({
        ...s,
        meetings: meetingsBySession[s.id] || [],
      })),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cadans-sessions-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  } catch (err) {
    importExportError.value = `Export failed: ${err.message}`
  } finally {
    exporting.value = false
  }
}

async function handleImport(event) {
  const file = event.target.files?.[0]
  if (!file) return
  // Reset input so the same file can be re-selected
  event.target.value = ''

  importing.value = true
  importExportError.value = ''
  importSuccess.value = ''

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const text = await file.text()
    const parsed = JSON.parse(text)

    if (!parsed.sessions || !Array.isArray(parsed.sessions)) {
      throw new Error('Invalid export file format')
    }

    // Fetch existing session codes to detect duplicates
    const { data: existing } = await supabase
      .from('grading_sessions')
      .select('code')
      .eq('teacher_id', user.id)

    const existingCodes = new Set((existing || []).map(s => s.code))

    let imported = 0
    for (const sessionData of parsed.sessions) {
      const { meetings: sessionMeetings = [], id: _id, teacher_id: _tid, created_at: _ca, updated_at: _ua, ...rest } = sessionData

      let code = rest.code
      if (existingCodes.has(code)) {
        code = code + ' (imported)'
      }
      existingCodes.add(code)

      const { data: newSession, error: insertError } = await supabase
        .from('grading_sessions')
        .insert({ ...rest, code, teacher_id: user.id })
        .select()
        .single()

      if (insertError) throw new Error(`Failed to import session "${code}": ${insertError.message}`)

      if (sessionMeetings.length > 0) {
        const meetingInserts = sessionMeetings.map(({ id: _mid, grading_session_id: _gsid, student_token: _st, reviewer_token: _rt, viewer_token: _vt, created_at: _mca, updated_at: _mua, ...mRest }) => ({
          ...mRest,
          grading_session_id: newSession.id,
          graded_by: user.id,
          student_token: crypto.randomUUID(),
          reviewer_token: crypto.randomUUID(),
          viewer_token: crypto.randomUUID(),
        }))

        const { error: meetingsError } = await supabase.from('meetings').insert(meetingInserts)
        if (meetingsError) throw new Error(`Failed to import meetings for "${code}": ${meetingsError.message}`)
      }

      imported++
    }

    importSuccess.value = `Successfully imported ${imported} session${imported !== 1 ? 's' : ''}.`
  } catch (err) {
    importExportError.value = `Import failed: ${err.message}`
  } finally {
    importing.value = false
  }
}
</script>

