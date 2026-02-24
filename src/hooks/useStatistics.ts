import { useState, useEffect, useCallback } from 'react'
import { saveToStorage, loadFromStorage } from '../utils'

export interface UsageStats {
  totalViews: number
  totalSearches: number
  totalBookmarks: number
  averageSessionTime: number
  favoriteTopics: string[]
  lastUsed: number
  streak: number
  totalTopicsViewed: number
}

const STATS_STORAGE_KEY = 'infwiki_stats'
const SESSION_START_KEY = 'infwiki_session_start'

export function useStatistics() {
  const [stats, setStats] = useState<UsageStats>(() =>
    loadFromStorage<UsageStats>(STATS_STORAGE_KEY, {
      totalViews: 0,
      totalSearches: 0,
      totalBookmarks: 0,
      averageSessionTime: 0,
      favoriteTopics: [],
      lastUsed: Date.now(),
      streak: 1,
      totalTopicsViewed: 0,
    })
  )

  const [sessionStart] = useState<number>(() => Date.now())

  useEffect(() => {
    saveToStorage(STATS_STORAGE_KEY, stats)
  }, [stats])

  useEffect(() => {
    // Сохраняем время начала сессии
    saveToStorage(SESSION_START_KEY, sessionStart)

    // Обновляем lastUsed при монтировании
    setStats((prev) => ({ ...prev, lastUsed: Date.now() }))

    // Проверяем стрик
    const lastUsed = stats.lastUsed
    const now = Date.now()
    const daysSinceLastUse = Math.floor((now - lastUsed) / (1000 * 60 * 60 * 24))

    if (daysSinceLastUse === 1) {
      setStats((prev) => ({ ...prev, streak: prev.streak + 1 }))
    } else if (daysSinceLastUse > 1) {
      setStats((prev) => ({ ...prev, streak: 1 }))
    }
  }, [])

  const trackView = useCallback(() => {
    setStats((prev) => ({
      ...prev,
      totalViews: prev.totalViews + 1,
      totalTopicsViewed: prev.totalTopicsViewed + 1,
    }))
  }, [])

  const trackSearch = useCallback(() => {
    setStats((prev) => ({
      ...prev,
      totalSearches: prev.totalSearches + 1,
    }))
  }, [])

  const trackBookmark = useCallback(() => {
    setStats((prev) => ({
      ...prev,
      totalBookmarks: prev.totalBookmarks + 1,
    }))
  }, [])

  const addFavoriteTopic = useCallback((topic: string) => {
    setStats((prev) => {
      const newFavorites = prev.favoriteTopics.filter((t) => t !== topic)
      newFavorites.unshift(topic)
      return {
        ...prev,
        favoriteTopics: newFavorites.slice(0, 10),
      }
    })
  }, [])

  const getSessionDuration = useCallback(() => {
    return Date.now() - sessionStart
  }, [sessionStart])

  const endSession = useCallback(() => {
    const duration = getSessionDuration()
    setStats((prev) => ({
      ...prev,
      averageSessionTime:
        (prev.averageSessionTime * prev.totalViews + duration) /
        (prev.totalViews + 1),
    }))
  }, [getSessionDuration])

  useEffect(() => {
    return () => {
      endSession()
    }
  }, [endSession])

  return {
    stats,
    trackView,
    trackSearch,
    trackBookmark,
    addFavoriteTopic,
    getSessionDuration,
  }
}
