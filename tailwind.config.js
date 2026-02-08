/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['Anton', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          hover: 'var(--color-primary-hover)',
          active: 'var(--color-primary-active)',
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
          text: 'var(--color-primary-text)',
        },
        bg: 'var(--color-bg)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          elevated: 'var(--color-surface-elevated)',
        },
        border: 'var(--color-border)',
        'text-primary': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-tertiary': 'var(--color-text-tertiary)',
        'text-disabled': 'var(--color-text-disabled)',
        success: {
          DEFAULT: 'var(--color-success)',
          light: 'var(--color-success-light)',
          border: 'var(--color-success-border)',
          dark: 'var(--color-success-dark)',
          text: 'var(--color-success-text)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          light: 'var(--color-warning-light)',
          border: 'var(--color-warning-border)',
          dark: 'var(--color-warning-dark)',
          text: 'var(--color-warning-text)',
        },
        error: {
          DEFAULT: 'var(--color-error)',
          light: 'var(--color-error-light)',
          border: 'var(--color-error-border)',
          dark: 'var(--color-error-dark)',
          text: 'var(--color-error-text)',
        },
        info: {
          DEFAULT: 'var(--color-info)',
          light: 'var(--color-info-light)',
          border: 'var(--color-info-border)',
          dark: 'var(--color-info-dark)',
          text: 'var(--color-info-text)',
        },
        hover: 'var(--color-hover)',
        active: 'var(--color-active)',
        muted: {
          DEFAULT: 'var(--color-muted)',
          border: 'var(--color-muted-border)',
          text: 'var(--color-muted-text)',
        },
      },
    },
  },
  plugins: [],
}
