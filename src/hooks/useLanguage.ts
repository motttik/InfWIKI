import { useTranslation } from 'react-i18next'
import type { Language } from '../types'

export function useLanguage() {
  const { i18n } = useTranslation()

  const language = (i18n.language.startsWith('ru') ? 'ru' : 'en') as Language

  const setLanguage = (lang: Language) => {
    i18n.changeLanguage(lang)
  }

  const toggleLanguage = () => {
    setLanguage(language === 'ru' ? 'en' : 'ru')
  }

  return {
    language,
    setLanguage,
    toggleLanguage,
    isRussian: language === 'ru',
  }
}
