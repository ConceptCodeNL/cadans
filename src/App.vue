<template>
  <div id="app" :data-theme="theme">
    <RouterView />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTheme } from './composables/useTheme'

const { theme } = useTheme()

onMounted(() => {
  // Apply theme on mount
  const root = document.documentElement
  if (theme.value === 'dark') {
    root.classList.add('dark')
    root.setAttribute('data-theme', 'dark')
  } else {
    root.classList.remove('dark')
    root.setAttribute('data-theme', 'light')
  }
})
</script>

<style>
#app {
  min-height: 100vh;
  background-color: var(--color-bg);
  color: var(--color-text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}
</style>


