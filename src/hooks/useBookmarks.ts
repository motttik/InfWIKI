import { useState, useEffect, useCallback } from 'react'
import type { Bookmark } from '../types'
import { saveToStorage, loadFromStorage, generateId } from '../utils'

const BOOKMARKS_STORAGE_KEY = 'infwiki_bookmarks'

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() =>
    loadFromStorage<Bookmark[]>(BOOKMARKS_STORAGE_KEY, [])
  )

  useEffect(() => {
    saveToStorage(BOOKMARKS_STORAGE_KEY, bookmarks)
  }, [bookmarks])

  const addBookmark = useCallback((topic: string, content?: string) => {
    setBookmarks((prev) => {
      const exists = prev.find((b) => b.topic.toLowerCase() === topic.toLowerCase())
      if (exists) return prev

      const newBookmark: Bookmark = {
        topic,
        addedAt: Date.now(),
        content,
        id: generateId(),
      }
      return [newBookmark, ...prev]
    })
  }, [])

  const removeBookmark = useCallback((topic: string) => {
    setBookmarks((prev) =>
      prev.filter((b) => b.topic.toLowerCase() !== topic.toLowerCase())
    )
  }, [])

  const isBookmarked = useCallback(
    (topic: string) => {
      return bookmarks.some((b) => b.topic.toLowerCase() === topic.toLowerCase())
    },
    [bookmarks]
  )

  const clearBookmarks = useCallback(() => {
    setBookmarks([])
  }, [])

  const exportBookmarks = useCallback(() => {
    const dataStr = JSON.stringify(bookmarks, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `infwiki-bookmarks-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(link.href)
  }, [bookmarks])

  const importBookmarks = useCallback((jsonString: string) => {
    try {
      const imported = JSON.parse(jsonString) as Bookmark[]
      if (Array.isArray(imported)) {
        setBookmarks((prev) => {
          const existingTopics = new Set(prev.map((b) => b.topic.toLowerCase()))
          const newBookmarks = imported.filter(
            (b) => !existingTopics.has(b.topic.toLowerCase())
          )
          return [...newBookmarks, ...prev]
        })
        return true
      }
      return false
    } catch {
      return false
    }
  }, [])

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    clearBookmarks,
    exportBookmarks,
    importBookmarks,
  }
}
