<template>
  <AppLayout>
    <h1 class="font-heading text-4xl mb-8">{{ $t('navigation.settings') }}</h1>
    
    <div class="space-y-8">
      <div class="bg-surface rounded-xl p-6 border border-border">
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
    </div>
  </AppLayout>
</template>

<script setup>
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'
import { useI18n } from '@/composables/useI18n'
import AppLayout from '@/components/AppLayout.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'

const { theme } = useTheme()
const { locale } = useI18n()
</script>

