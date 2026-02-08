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
  </div>
</template>

<script setup>
import { useRouter, RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import ThemeToggle from './ThemeToggle.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import CookieConsent from './CookieConsent.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { t: $t } = useI18n()

const navItems = [
  { path: '/sessions', label: 'navigation.sessions', activePrefix: '/session' },
  { path: '/settings', label: 'navigation.settings' },
]

async function handleLogout() {
  await authStore.signOut()
  router.push('/login')
}
</script>
