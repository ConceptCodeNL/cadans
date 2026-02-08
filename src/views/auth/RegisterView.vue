<template>
  <div class="min-h-screen flex items-center justify-center bg-surface p-4">
    <div class="w-full max-w-md bg-surface-elevated rounded-2xl p-8 shadow-lg">
      <div class="text-center mb-8">
        <span class="font-heading text-4xl tracking-wide">CADANS</span>
        <h1 class="font-heading text-3xl mb-2">{{ $t('auth.register') }}</h1>
        <p class="text-text-secondary">{{ $t('app.tagline') }}</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium mb-2">
            {{ $t('auth.email') }}
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium mb-2">
            {{ $t('auth.password') }}
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div v-if="error" class="text-error text-sm">
          {{ error }}
        </div>

        <div v-if="success" class="text-success text-sm">
          Registration successful! Please check your email.
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full px-4 py-3 bg-primary text-primary-text rounded-lg font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50"
        >
          {{ loading ? $t('common.loading') : $t('auth.register') }}
        </button>

        <div class="text-center">
          <RouterLink to="/login" class="text-sm text-primary-dark hover:underline font-semibold">
            Already have an account? Login
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const success = ref(false)
const loading = ref(false)

async function handleRegister() {
  error.value = ''
  success.value = false
  loading.value = true
  
  const { user, error: authError } = await authStore.signUp(email.value, password.value)
  
  if (authError) {
    error.value = authError
  } else if (user) {
    success.value = true
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }
  
  loading.value = false
}
</script>

