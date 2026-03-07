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
</script>

