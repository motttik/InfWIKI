import { useState, useEffect, useCallback, useRef } from 'react'
import { streamDefinition, generateAsciiArt, getRandomTopic } from '../services/geminiService'
import type { AsciiArtData, Language } from '../types'
import { useNavigationHistory } from './useNavigationHistory'
import { useBookmarks } from './useBookmarks'

interface UseWikiOptions {
  initialTopic?: string
  language?: Language
}

export function useWiki({ initialTopic = 'Hypertext', language = 'en' }: UseWikiOptions = {}) {
  const [currentTopic, setCurrentTopic] = useState<string>(initialTopic)
  const [content, setContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [asciiArt, setAsciiArt] = useState<AsciiArtData | null>(null)
  const [generationTime, setGenerationTime] = useState<number | null>(null)

  const isCancelledRef = useRef(false)
  const { pushToHistory, goBack, goForward, canGoBack, canGoForward } = useNavigationHistory()
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks()

  useEffect(() => {
    if (!currentTopic) return

    isCancelledRef.current = false

    const fetchContentAndArt = async () => {
      setIsLoading(true)
      setError(null)
      setContent('')
      setAsciiArt(null)
      setGenerationTime(null)
      const startTime = performance.now()

      // Generate ASCII art
      generateAsciiArt(currentTopic, language)
        .then((art) => {
          if (!isCancelledRef.current) {
            setAsciiArt(art)
          }
        })
        .catch((err) => {
          if (!isCancelledRef.current) {
            console.error('Failed to generate ASCII art:', err)
            const fallbackArt = createFallbackArt(currentTopic)
            setAsciiArt(fallbackArt)
          }
        })

      // Stream content
      let accumulatedContent = ''
      try {
        for await (const chunk of streamDefinition(currentTopic, language)) {
          if (isCancelledRef.current) break

          if (chunk.startsWith('Error:')) {
            throw new Error(chunk)
          }
          accumulatedContent += chunk
          if (!isCancelledRef.current) {
            setContent(accumulatedContent)
          }
        }

        // Push to history after successful load
        pushToHistory(currentTopic, accumulatedContent)
      } catch (e: unknown) {
        if (!isCancelledRef.current) {
          const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred'
          setError(errorMessage)
          setContent('')
          console.error(e)
        }
      } finally {
        if (!isCancelledRef.current) {
          const endTime = performance.now()
          setGenerationTime(endTime - startTime)
          setIsLoading(false)
        }
      }
    }

    fetchContentAndArt()

    return () => {
      isCancelledRef.current = true
    }
  }, [currentTopic, language, pushToHistory])

  const handleTopicChange = useCallback((topic: string) => {
    const newTopic = topic.trim()
    if (newTopic && newTopic.toLowerCase() !== currentTopic.toLowerCase()) {
      setCurrentTopic(newTopic)
    }
  }, [currentTopic])

  const handleRandom = useCallback(() => {
    setIsLoading(true)
    setError(null)
    setContent('')
    setAsciiArt(null)

    const randomTopic = getRandomTopic(language)
    if (randomTopic.toLowerCase() !== currentTopic.toLowerCase()) {
      setCurrentTopic(randomTopic)
    } else {
      // If same topic, get another random one
      const topics = language === 'ru' 
        ? ['Баланс', 'Гармония', 'Спираль', 'Квант', 'Поток']
        : ['Balance', 'Harmony', 'Spiral', 'Quantum', 'Flow']
      const differentTopic = topics.find(t => t.toLowerCase() !== currentTopic.toLowerCase()) || topics[0]
      setCurrentTopic(differentTopic)
    }
  }, [currentTopic, language])

  const handleBack = useCallback(() => {
    const prev = goBack()
    if (prev) {
      setCurrentTopic(prev.topic)
      setContent(prev.content || '')
    }
  }, [goBack])

  const handleForward = useCallback(() => {
    const next = goForward()
    if (next) {
      setCurrentTopic(next.topic)
      setContent(next.content || '')
    }
  }, [goForward])

  const handleToggleBookmark = useCallback(() => {
    if (isBookmarked(currentTopic)) {
      removeBookmark(currentTopic)
    } else {
      addBookmark(currentTopic, content)
    }
  }, [currentTopic, content, isBookmarked, addBookmark, removeBookmark])

  const createFallbackArt = (topic: string): AsciiArtData => {
    const displayableTopic = topic.length > 20 ? topic.substring(0, 17) + '...' : topic
    const paddedTopic = ` ${displayableTopic} `
    const topBorder = `┌${'─'.repeat(paddedTopic.length)}┐`
    const middle = `│${paddedTopic}│`
    const bottomBorder = `└${'─'.repeat(paddedTopic.length)}┘`
    return {
      art: `${topBorder}\n${middle}\n${bottomBorder}`,
    }
  }

  return {
    currentTopic,
    content,
    isLoading,
    error,
    asciiArt,
    generationTime,
    handleTopicChange,
    handleRandom,
    handleBack,
    handleForward,
    handleToggleBookmark,
    canGoBack,
    canGoForward,
    isBookmarked: isBookmarked(currentTopic),
  }
}
