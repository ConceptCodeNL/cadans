<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <h1 class="font-heading text-6xl mb-4">404</h1>
      <p class="text-xl text-text-secondary mb-8">Page not found</p>
      <RouterLink to="/" class="px-6 py-3 bg-primary text-primary-text rounded-lg font-semibold hover:bg-primary-hover transition-colors">
        Go Home
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

