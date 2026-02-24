import { useState, useEffect, useCallback } from 'react'
import type { Theme } from '../types'
import { saveToStorage, loadFromStorage } from '../utils'

const THEME_STORAGE_KEY = 'infwiki_theme'
const THEMES: Theme[] = ['light', 'dark', 'cyberpunk']

export function useTheme(): [Theme, (theme: Theme) => void, () => void] {
  const [theme, setTheme] = useState<Theme>(() =>
    loadFromStorage<Theme>(THEME_STORAGE_KEY, 'light')
  )

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    saveToStorage(THEME_STORAGE_KEY, theme)
  }, [theme])

  const setThemeSafe = useCallback((newTheme: Theme) => {
    if (THEMES.includes(newTheme)) {
      setTheme(newTheme)
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const currentIndex = THEMES.indexOf(prev)
      const nextIndex = (currentIndex + 1) % THEMES.length
      return THEMES[nextIndex]
    })
  }, [])

  return [theme, setThemeSafe, toggleTheme]
}
