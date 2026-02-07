# Theme Design System

## Overview

CADANS supports both light and dark themes with a comprehensive design system that ensures consistency, accessibility, and a great user experience across both modes.

## Color Palettes

### Light Theme

#### Primary Colors (Pastel Green)
- **Primary**: `#86efac` (Green-300) - Main brand color, buttons, links
- **Primary Hover**: `#6ee7b7` (Emerald-300)
- **Primary Active**: `#4ade80` (Green-400)
- **Primary Light**: `#a7f3d0` (Emerald-200) - Subtle accents
- **Primary Dark**: `#34d399` (Emerald-400) - For text on light backgrounds

#### Background Colors
- **Background**: `#ffffff` (White)
- **Surface**: `#f8fafc` (Slate-50) - Cards, panels
- **Surface Elevated**: `#ffffff` (White) - Elevated cards, modals
- **Border**: `#e2e8f0` (Slate-200) - Borders, dividers

#### Text Colors
- **Text Primary**: `#1e293b` (Slate-800) - Main text
- **Text Secondary**: `#475569` (Slate-600) - Secondary text
- **Text Tertiary**: `#64748b` (Slate-500) - Helper text, labels
- **Text Disabled**: `#94a3b8` (Slate-400) - Disabled text

#### Semantic Colors
- **Success**: `#10b981` (Emerald-500)
- **Success Light**: `#d1fae5` (Emerald-100)
- **Warning**: `#f59e0b` (Amber-500)
- **Warning Light**: `#fef3c7` (Amber-100)
- **Error**: `#ef4444` (Red-500)
- **Error Light**: `#fee2e2` (Red-100)
- **Info**: `#3b82f6` (Blue-500)
- **Info Light**: `#dbeafe` (Blue-100)

#### Interactive States
- **Hover**: `#f1f5f9` (Slate-100)
- **Active**: `#e2e8f0` (Slate-200)
- **Focus Ring**: `#86efac` (Green-300) with opacity

### Dark Theme

#### Primary Colors (Pastel Green)
- **Primary**: `#6ee7b7` (Emerald-300) - Main brand color, buttons, links
- **Primary Hover**: `#86efac` (Green-300)
- **Primary Active**: `#34d399` (Emerald-400)
- **Primary Light**: `#a7f3d0` (Emerald-200) - Subtle accents
- **Primary Dark**: `#10b981` (Emerald-500) - For emphasis

#### Background Colors
- **Background**: `#0f172a` (Slate-900) - Main background
- **Surface**: `#1e293b` (Slate-800) - Cards, panels
- **Surface Elevated**: `#334155` (Slate-700) - Elevated cards, modals
- **Border**: `#334155` (Slate-700) - Borders, dividers

#### Text Colors
- **Text Primary**: `#f1f5f9` (Slate-100) - Main text
- **Text Secondary**: `#cbd5e1` (Slate-300) - Secondary text
- **Text Tertiary**: `#94a3b8` (Slate-400) - Helper text, labels
- **Text Disabled**: `#64748b` (Slate-500) - Disabled text

#### Semantic Colors
- **Success**: `#34d399` (Emerald-400)
- **Success Light**: `#064e3b` (Emerald-900)
- **Warning**: `#fbbf24` (Amber-400)
- **Warning Light**: `#78350f` (Amber-900)
- **Error**: `#f87171` (Red-400)
- **Error Light**: `#7f1d1d` (Red-900)
- **Info**: `#60a5fa` (Blue-400)
- **Info Light**: `#1e3a8a` (Blue-900)

#### Interactive States
- **Hover**: `#334155` (Slate-700)
- **Active**: `#475569` (Slate-600)
- **Focus Ring**: `#6ee7b7` (Emerald-300) with opacity

## CSS Variables Implementation

### Root Variables

```css
:root {
  /* Light theme (default) - Pastel Green */
  --color-primary: #86efac;
  --color-primary-hover: #6ee7b7;
  --color-primary-active: #4ade80;
  --color-primary-light: #a7f3d0;
  --color-primary-dark: #34d399;
  
  --color-bg: #ffffff;
  --color-surface: #f8fafc;
  --color-surface-elevated: #ffffff;
  --color-border: #e2e8f0;
  
  --color-text-primary: #1e293b;
  --color-text-secondary: #475569;
  --color-text-tertiary: #64748b;
  --color-text-disabled: #94a3b8;
  
  --color-success: #10b981;
  --color-success-light: #d1fae5;
  --color-warning: #f59e0b;
  --color-warning-light: #fef3c7;
  --color-error: #ef4444;
  --color-error-light: #fee2e2;
  --color-info: #3b82f6;
  --color-info-light: #dbeafe;
  
  --color-hover: #f1f5f9;
  --color-active: #e2e8f0;
  --color-focus-ring: rgba(134, 239, 172, 0.5);
}

[data-theme="dark"] {
  /* Dark theme - Pastel Green */
  --color-primary: #6ee7b7;
  --color-primary-hover: #86efac;
  --color-primary-active: #34d399;
  --color-primary-light: #a7f3d0;
  --color-primary-dark: #10b981;
  
  --color-bg: #0f172a;
  --color-surface: #1e293b;
  --color-surface-elevated: #334155;
  --color-border: #334155;
  
  --color-text-primary: #f1f5f9;
  --color-text-secondary: #cbd5e1;
  --color-text-tertiary: #94a3b8;
  --color-text-disabled: #64748b;
  
  --color-success: #34d399;
  --color-success-light: #064e3b;
  --color-warning: #fbbf24;
  --color-warning-light: #78350f;
  --color-error: #f87171;
  --color-error-light: #7f1d1d;
  --color-info: #60a5fa;
  --color-info-light: #1e3a8a;
  
  --color-hover: #334155;
  --color-active: #475569;
  --color-focus-ring: rgba(110, 231, 183, 0.5);
}
```

### Tailwind CSS Configuration

```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class', // or 'media' for system preference
  theme: {
    extend: {
      colors: {
        // Light theme - Pastel Green
        primary: {
          DEFAULT: '#86efac',
          hover: '#6ee7b7',
          active: '#4ade80',
          light: '#a7f3d0',
          dark: '#34d399',
        },
        bg: {
          DEFAULT: '#ffffff',
          surface: '#f8fafc',
          elevated: '#ffffff',
        },
        text: {
          primary: '#1e293b',
          secondary: '#475569',
          tertiary: '#64748b',
          disabled: '#94a3b8',
        },
      },
    },
  },
  plugins: [],
}
```

## Theme Switching

### User Preference Storage

```typescript
// composables/useTheme.ts
import { ref, watch, onMounted } from 'vue'

type Theme = 'light' | 'dark'

const theme = ref<Theme>('light')

export function useTheme() {
  // Load theme from localStorage or system preference
  onMounted(() => {
    const saved = localStorage.getItem('theme') as Theme | null
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

  function applyTheme(newTheme: Theme) {
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

  function setTheme(newTheme: Theme) {
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
```

### Theme Toggle Component

```vue
<template>
  <button
    @click="toggleTheme"
    :aria-label="theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'"
    class="theme-toggle"
  >
    <SunIcon v-if="theme === 'light'" />
    <MoonIcon v-else />
  </button>
</template>

<script setup lang="ts">
import { useTheme } from '@/composables/useTheme'

const { theme, toggleTheme } = useTheme()
</script>
```

## Component Theming

### Card Component Example

```vue
<template>
  <div class="card">
    <h3 class="card-title">{{ title }}</h3>
    <p class="card-content">{{ content }}</p>
  </div>
</template>

<style scoped>
.card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  transition: background-color 0.2s, border-color 0.2s;
}

.card-title {
  color: var(--color-text-primary);
  font-family: var(--font-heading);
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.card-content {
  color: var(--color-text-secondary);
  font-family: var(--font-body);
}
</style>
```

### Button Component Example

```vue
<template>
  <button
    :class="['btn', `btn-${variant}`]"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<style scoped>
.btn {
  background-color: var(--color-primary);
  color: var(--color-text-primary); /* Dark text on pastel green */
  border: 2px solid var(--color-primary);
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-family: var(--font-body);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;
}

.btn:hover {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.btn:active {
  background-color: var(--color-primary-active);
  border-color: var(--color-primary-active);
}

.btn:focus {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}

/* Dark theme button adjustments */
[data-theme="dark"] .btn {
  color: var(--color-bg); /* Light text on dark background */
}
</style>
```

## Logo Usage

### Light Theme
- Use `logo-horizontal.svg` or `logo.svg`
- Use `logo-text-only.svg` for text-only version

### Dark Theme
- Use `logo-dark.svg` for full logo
- Use `logo-text-only-dark.svg` for text-only version

### Implementation

```vue
<template>
  <img
    :src="logoPath"
    alt="CADANS"
    class="logo"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { theme } = useTheme()

const logoPath = computed(() => {
  return theme.value === 'dark'
    ? '/logo-dark.svg'
    : '/logo-horizontal.svg'
})
</script>
```

## Accessibility Considerations

### Color Contrast

**Light Theme:**
- Text on background: 4.5:1 minimum (WCAG AA)
- Text on surface: 4.5:1 minimum
- Interactive elements: 3:1 minimum

**Dark Theme:**
- Text on background: 4.5:1 minimum
- Text on surface: 4.5:1 minimum
- Interactive elements: 3:1 minimum

### Focus Indicators

Both themes must have:
- Visible focus rings (2px solid, high contrast)
- Focus indicators on all interactive elements
- Keyboard navigation support

### Reduced Motion

Respect `prefers-reduced-motion`:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}
```

## Best Practices

### Do's
- ✅ Use CSS variables for all colors
- ✅ Test both themes thoroughly
- ✅ Ensure sufficient contrast in both themes
- ✅ Provide theme toggle in accessible location
- ✅ Remember user preference
- ✅ Support system preference detection
- ✅ Smooth transitions between themes

### Don'ts
- ❌ Don't hardcode colors
- ❌ Don't forget to test dark theme
- ❌ Don't use low contrast colors
- ❌ Don't force a theme (respect user choice)
- ❌ Don't forget to update logos for theme
- ❌ Don't use pure black/white (use off-colors)

## Testing Checklist

- [ ] All components render correctly in both themes
- [ ] Text is readable in both themes
- [ ] Interactive elements are clearly visible
- [ ] Focus indicators work in both themes
- [ ] Logos display correctly
- [ ] Theme preference is saved
- [ ] System preference is detected
- [ ] Theme toggle works smoothly
- [ ] No color contrast issues
- [ ] Forms are usable in both themes
- [ ] Charts/graphs are readable in both themes

## Implementation Priority

1. **Phase 1**: Set up CSS variables and base theme
2. **Phase 2**: Implement theme toggle component
3. **Phase 3**: Update all components to use theme variables
4. **Phase 4**: Test and refine both themes
5. **Phase 5**: Add smooth transitions and polish

