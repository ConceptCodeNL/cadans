<template>
  <Teleport to="body">
    <Transition name="confirm-overlay">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div class="absolute inset-0 bg-black/50" @click="handleCancel"></div>
        <Transition name="confirm-content">
          <div
            v-if="modelValue"
            class="relative bg-surface rounded-xl border border-border shadow-xl w-full max-w-sm mx-auto"
          >
            <!-- Icon -->
            <div class="pt-6 pb-2 text-center">
              <div
                class="inline-flex items-center justify-center w-12 h-12 rounded-full mx-auto"
                :class="variant === 'danger' ? 'bg-error/10' : 'bg-primary/10'"
              >
                <svg
                  v-if="variant === 'danger'"
                  class="w-6 h-6 text-error"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <svg
                  v-else
                  class="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <!-- Content -->
            <div class="px-6 pb-2 text-center">
              <h3 class="font-heading text-lg mb-2">{{ title }}</h3>
              <p class="text-sm text-text-secondary">{{ message }}</p>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 p-4 pt-4">
              <button
                type="button"
                class="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm font-semibold hover:bg-hover transition-colors"
                @click="handleCancel"
              >
                {{ cancelText }}
              </button>
              <button
                type="button"
                class="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
                :class="variant === 'danger'
                  ? 'bg-error text-white hover:bg-error-dark'
                  : 'bg-primary text-primary-text hover:bg-primary-hover'"
                @click="handleConfirm"
              >
                {{ confirmText }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  message: { type: String, default: '' },
  confirmText: { type: String, default: 'OK' },
  cancelText: { type: String, default: 'Cancel' },
  variant: { type: String, default: 'danger' }, // 'danger' | 'default'
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])

function handleConfirm() {
  emit('confirm')
  emit('update:modelValue', false)
}

function handleCancel() {
  emit('cancel')
  emit('update:modelValue', false)
}
</script>

<style scoped>
.confirm-overlay-enter-active {
  transition: opacity 0.2s ease;
}
.confirm-overlay-leave-active {
  transition: opacity 0.15s ease;
}
.confirm-overlay-enter-from,
.confirm-overlay-leave-to {
  opacity: 0;
}

.confirm-content-enter-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.confirm-content-leave-active {
  transition: all 0.15s ease;
}
.confirm-content-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(8px);
}
.confirm-content-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>

