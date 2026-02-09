<template>
  <button
    @click="toggleLocale"
    :aria-label="`Switch language to ${locale === 'en' ? 'Dutch' : 'English'}`"
    class="px-3 py-2 rounded-lg hover:bg-hover transition-colors font-semibold"
  >
    {{ locale.toUpperCase() }}
  </button>
</template>

<script setup>
import { useI18n } from '@/composables/useI18n'

const { locale, toggleLocale } = useI18n()
</script>


