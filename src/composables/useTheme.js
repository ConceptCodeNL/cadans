import { ref, watch, onMounted } from 'vue'

// Shared theme state across the whole app
const theme = ref('light')
let initialized = false
let mediaListenerAttached = false

function applyTheme(newTheme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (newTheme === 'dark') {
    root.classList.add('dark')
    root.setAttribute('data-theme', 'dark')
  } else {
    root.classList.remove('dark')
    root.setAttribute('data-theme', 'light')
  }
}

function initThemeOnce() {
  if (initialized || typeof window === 'undefined') return

  const saved = localStorage.getItem('theme')
  const prefersDark = window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches

  theme.value = saved || (prefersDark ? 'dark' : 'light')
  applyTheme(theme.value)
  initialized = true

  if (!mediaListenerAttached && window.matchMedia) {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => {
      if (!localStorage.getItem('theme')) {
        theme.value = e.matches ? 'dark' : 'light'
        applyTheme(theme.value)
      }
    }
    if (media.addEventListener) {
      media.addEventListener('change', handler)
    } else if (media.addListener) {
      // Safari fallback
      media.addListener(handler)
    }
    mediaListenerAttached = true
  }
}

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', theme.value)
  }
  applyTheme(theme.value)
}

function setTheme(newTheme) {
  theme.value = newTheme
  if (typeof window !== 'undefined') {
    localStorage.setItem('theme', newTheme)
  }
  applyTheme(newTheme)
}

// Keep DOM theme in sync whenever the ref changes
watch(theme, (newTheme) => {
  applyTheme(newTheme)
})

export function useTheme() {
  // Ensure initialization happens once on first composable use
  onMounted(() => {
    initThemeOnce()
  })

  return {
    theme,
    toggleTheme,
    setTheme,
  }
}

