import { ref, watch, onMounted } from 'vue'

export function useTheme() {
  const theme = ref('light')

  // Load theme from localStorage or system preference
  onMounted(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    theme.value = saved || (prefersDark ? 'dark' : 'light')
    applyTheme(theme.value)
  })

  // Watch for system preference changes
  if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        theme.value = e.matches ? 'dark' : 'light'
        applyTheme(theme.value)
      }
    })
  }

  function applyTheme(newTheme) {
    const root = document.documentElement
    if (newTheme === 'dark') {
      root.classList.add('dark')
      root.setAttribute('data-theme', 'dark')
    } else {
      root.classList.remove('dark')
      root.setAttribute('data-theme', 'light')
    }
  }

  function toggleTheme() {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
    applyTheme(theme.value)
  }

  function setTheme(newTheme) {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    applyTheme(newTheme)
  }

  watch(theme, (newTheme) => {
    applyTheme(newTheme)
  })

  return {
    theme,
    toggleTheme,
    setTheme,
  }
}

