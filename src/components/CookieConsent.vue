<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0 translate-y-4"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-4"
  >
    <div
      v-if="!consented"
      class="fixed bottom-0 left-0 right-0 z-50 p-4 bg-surface border-t border-border shadow-lg"
    >
      <div class="container mx-auto max-w-4xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex-1">
          <p class="text-sm text-text-secondary">
            {{ $t('cookie.message') }}
            <RouterLink to="/privacy" class="text-primary-dark hover:underline font-semibold">
              {{ $t('cookie.learnMore') }}
            </RouterLink>
          </p>
        </div>
        <div class="flex gap-2">
          <button
            @click="acceptCookies"
            class="px-4 py-2 bg-primary text-primary-text rounded-lg font-semibold hover:bg-primary-hover transition-colors"
          >
            {{ $t('cookie.accept') }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'

const consented = ref(true)

onMounted(() => {
  const consent = localStorage.getItem('cookie-consent')
  consented.value = consent === 'accepted'
})

function acceptCookies() {
  localStorage.setItem('cookie-consent', 'accepted')
  consented.value = true
}
</script>

