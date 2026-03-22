import { useState, useEffect, useCallback } from 'react'
import type { NavigationHistoryItem } from '../types'
import { saveToStorage, loadFromStorage } from '../utils'

const HISTORY_STORAGE_KEY = 'infwiki_history'
const MAX_HISTORY_LENGTH = 20

export function useNavigationHistory() {
  const [history, setHistory] = useState<NavigationHistoryItem[]>(() =>
    loadFromStorage<NavigationHistoryItem[]>(HISTORY_STORAGE_KEY, [])
  )
  const [currentIndex, setCurrentIndex] = useState<number>(() => {
    // Инициализируем currentIndex на основе сохранённой истории
    const savedHistory = loadFromStorage<NavigationHistoryItem[]>(HISTORY_STORAGE_KEY, [])
    return savedHistory.length > 0 ? savedHistory.length - 1 : -1
  })

  useEffect(() => {
    saveToStorage(HISTORY_STORAGE_KEY, history)
  }, [history])

  useEffect(() => {
    // Синхронизируем currentIndex если история загрузилась позже
    if (history.length > 0 && currentIndex === -1) {
      setCurrentIndex(history.length - 1)
    }
  }, [history, currentIndex])

  const pushToHistory = useCallback((topic: string, content?: string) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, currentIndex + 1)

      const lastItem = newHistory[newHistory.length - 1]
      if (lastItem && lastItem.topic.toLowerCase() === topic.toLowerCase()) {
        return prev
      }

      const newItem: NavigationHistoryItem = {
        topic,
        timestamp: Date.now(),
        content,
      }

      const updated = [...newHistory, newItem]
      if (updated.length > MAX_HISTORY_LENGTH) {
        updated.shift()
      }

      return updated
    })
    setCurrentIndex((prev) => Math.min(prev + 1, MAX_HISTORY_LENGTH - 1))
  }, [currentIndex])

  const goBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
      return history[currentIndex - 1]
    }
    return null
  }, [history, currentIndex])

  const goForward = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      return history[currentIndex + 1]
    }
    return null
  }, [history, currentIndex])

  const clearHistory = useCallback(() => {
    setHistory([])
    setCurrentIndex(-1)
  }, [])

  const canGoBack = currentIndex > 0
  const canGoForward = currentIndex < history.length - 1

  return {
    history,
    currentIndex,
    pushToHistory,
    goBack,
    goForward,
    clearHistory,
    canGoBack,
    canGoForward,
    current: history[currentIndex] || null,
  }
}
