import { useI18n as useVueI18n } from 'vue-i18n'

export function useI18n() {
  const { locale, t, availableLocales } = useVueI18n()

  function setLocale(newLocale) {
    locale.value = newLocale
    localStorage.setItem('locale', newLocale)
  }

  function toggleLocale() {
    const currentIndex = availableLocales.indexOf(locale.value)
    const nextIndex = (currentIndex + 1) % availableLocales.length
    setLocale(availableLocales[nextIndex])
  }

  return {
    locale,
    t,
    setLocale,
    toggleLocale,
    availableLocales,
  }
}

