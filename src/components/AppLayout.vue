<template>
  <div class="min-h-screen bg-bg flex flex-col">
    <header class="border-b border-border bg-surface sticky top-0 z-40">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <RouterLink to="/sessions" class="flex items-center">
            <span class="font-heading text-3xl tracking-wide">CADANS</span>
          </RouterLink>
          
          <nav class="flex items-center gap-4">
            <RouterLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="text-text-secondary hover:text-text-primary transition-colors"
              :class="{ 'text-primary-dark font-semibold': $route.path === item.path || $route.path.startsWith(item.activePrefix || item.path) }"
            >
              {{ $t(item.label) }}
            </RouterLink>
            
            <LanguageSwitcher />
            <ThemeToggle />
            
            <button
              v-if="authStore.user"
              @click="handleLogout"
              class="text-text-secondary hover:text-text-primary transition-colors"
            >
              {{ $t('auth.logout') }}
            </button>
          </nav>
        </div>
      </div>
    </header>

    <main class="flex-1 container mx-auto px-4 py-8">
      <slot />
    </main>

    <CookieConsent />

    <!-- Floating feedback button on the left side (only when logged in) -->
    <button
      v-if="authStore.user"
      type="button"
      class="fixed left-3 bottom-24 z-40 px-2 py-3 bg-info text-white rounded-full text-xs font-semibold shadow-lg hover:bg-info-dark hover:shadow-xl transition-all flex flex-col items-center gap-1"
      @click="openFeedbackModal"
    >
      <!-- Cool sparkles chat icon -->
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 8h10M7 12h6m3 8l-4-4H7a4 4 0 01-4-4V8a4 4 0 014-4h10a4 4 0 014 4v4a4 4 0 01-4 4M6 3l1-1m10 1l1-1m0 10l1 1m-14-1l-1 1"
        />
      </svg>
      <span class="writing-vertical text-[10px] tracking-wide">
        {{ $t('common.feedback') }}
      </span>
    </button>

    <!-- Feedback Modal -->
    <Teleport to="body">
      <div
        v-if="showFeedbackModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div class="absolute inset-0 bg-black/50" @click="closeFeedbackModal"></div>
        <div class="relative bg-surface rounded-xl border border-border shadow-xl w-full max-w-lg mx-auto max-h-[80vh] flex flex-col">
          <div class="flex items-center justify-between p-4 border-b border-border">
            <h2 class="font-heading text-xl">{{ $t('feedback.title') }}</h2>
            <button
              type="button"
              class="p-1 text-text-tertiary hover:text-text-primary rounded hover:bg-hover transition-colors"
              @click="closeFeedbackModal"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="p-4 flex-1 flex flex-col gap-3">
            <p class="text-sm text-text-secondary">
              {{ $t('feedback.description') }}
            </p>
            <textarea
              v-model="feedbackMessage"
              rows="5"
              class="w-full flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-surface-elevated text-sm"
              :placeholder="$t('feedback.placeholder')"
            />
            <p v-if="feedbackError" class="text-xs text-error">{{ feedbackError }}</p>
            <div v-else-if="feedbackSuccess" class="space-y-1">
              <p class="text-xs text-success">
                {{ $t('feedback.success') }} ({{ feedbackCountdown }}s)
              </p>
              <div class="w-full h-1.5 bg-border rounded-full overflow-hidden">
                <div
                  class="h-full bg-success transition-all duration-200"
                  :style="{ width: `${feedbackProgress}%` }"
                ></div>
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-2 p-4 border-t border-border">
            <button
              type="button"
              class="px-4 py-2 text-sm text-text-secondary hover:text-text-primary rounded-lg hover:bg-hover transition-colors"
              @click="closeFeedbackModal"
            >
              {{ $t('common.cancel') }}
            </button>
            <button
              type="button"
              class="px-4 py-2 bg-primary text-primary-text rounded-lg font-semibold text-sm hover:bg-primary-hover transition-colors disabled:opacity-50"
              :disabled="feedbackSaving || !feedbackMessage.trim()"
              @click="submitFeedback"
            >
              {{ feedbackSaving ? $t('common.loading') : $t('feedback.submit') }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useFeedbackStore } from '@/stores/feedback'
import ThemeToggle from './ThemeToggle.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import CookieConsent from './CookieConsent.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const feedbackStore = useFeedbackStore()
const { t: $t } = useI18n()

const navItems = [
  { path: '/sessions', label: 'navigation.sessions', activePrefix: '/session' },
  { path: '/settings', label: 'navigation.settings' },
]

const showFeedbackModal = ref(false)
const feedbackMessage = ref('')
const feedbackSaving = ref(false)
const feedbackError = ref('')
const feedbackSuccess = ref(false)
const feedbackCountdown = ref(0)
const feedbackProgress = ref(0)
let feedbackIntervalId = null

async function handleLogout() {
  await authStore.signOut()
  router.push('/login')
}

function openFeedbackModal() {
  feedbackError.value = ''
  feedbackSuccess.value = false
  feedbackCountdown.value = 0
  feedbackProgress.value = 0
  showFeedbackModal.value = true
}

function closeFeedbackModal() {
  if (feedbackSaving.value) return
  feedbackSuccess.value = false
  feedbackCountdown.value = 0
  feedbackProgress.value = 0
  if (feedbackIntervalId) {
    clearInterval(feedbackIntervalId)
    feedbackIntervalId = null
  }
  showFeedbackModal.value = false
}

async function submitFeedback() {
  if (!feedbackMessage.value.trim() || !authStore.user) return
  feedbackSaving.value = true
  feedbackError.value = ''
  feedbackSuccess.value = false

  const { error } = await feedbackStore.createFeedback({
    message: feedbackMessage.value.trim(),
    path: route.fullPath,
  })

  feedbackSaving.value = false

  if (error) {
    feedbackError.value = error
    return
  }

  feedbackMessage.value = ''
  feedbackSuccess.value = true
  feedbackCountdown.value = 4
  feedbackProgress.value = 100

  if (feedbackIntervalId) {
    clearInterval(feedbackIntervalId)
  }
  const totalMs = 4000
  const start = Date.now()
  const end = start + totalMs

  feedbackIntervalId = setInterval(() => {
    const now = Date.now()
    const remaining = Math.max(0, end - now)
    feedbackProgress.value = (remaining / totalMs) * 100
    feedbackCountdown.value = Math.ceil(remaining / 1000)

    if (remaining <= 0) {
      clearInterval(feedbackIntervalId)
      feedbackIntervalId = null
      feedbackSuccess.value = false
      feedbackCountdown.value = 0
      feedbackProgress.value = 0
      showFeedbackModal.value = false
    }
  }, 50)
}
</script>

<style scoped>
.writing-vertical {
  writing-mode: vertical-rl;
  text-orientation: mixed;
}
</style>
