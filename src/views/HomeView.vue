<template>
  <div class="min-h-screen flex flex-col bg-bg">
    <header class="border-b border-border bg-surface">
      <div class="container mx-auto px-4 py-4 flex items-center justify-between">
        <span class="font-heading text-3xl tracking-wide">CADANS</span>
        <nav class="flex items-center gap-4">
          <LanguageSwitcher />
          <ThemeToggle />
          <RouterLink to="/login" class="text-text-secondary hover:text-text-primary">
            {{ $t('auth.login') }}
          </RouterLink>
          <RouterLink 
            to="/register" 
            class="px-4 py-2 bg-primary text-primary-text rounded-lg font-semibold hover:bg-primary-hover transition-colors"
          >
            {{ $t('auth.register') }}
          </RouterLink>
        </nav>
      </div>
    </header>

    <main class="flex-1 container mx-auto px-4 py-16">
      <div class="max-w-4xl mx-auto text-center">
        <h1 class="font-heading text-6xl mb-4">CADANS</h1>
        <p class="text-xl text-text-secondary mb-8">{{ $t('app.tagline') }}</p>
        <div class="flex gap-4 justify-center">
          <RouterLink 
            to="/register" 
            class="px-8 py-3 bg-primary text-primary-text rounded-lg font-semibold text-lg hover:bg-primary-hover transition-colors"
          >
            {{ $t('navigation.home') === 'Home' ? 'Get Started' : 'Aan de slag' }}
          </RouterLink>
        </div>
      </div>
    </main>
    
    <CookieConsent />
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import ThemeToggle from '@/components/ThemeToggle.vue'
import LanguageSwitcher from '@/components/LanguageSwitcher.vue'
import CookieConsent from '@/components/CookieConsent.vue'
</script>

