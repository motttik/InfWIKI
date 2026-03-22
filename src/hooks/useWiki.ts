import { useState, useEffect, useCallback, useRef } from 'react'
import { createLLMService, createLLMServiceAsync, getRandomTopic, type LLMProviderConfig } from '../services/llmService'
import type { AsciiArtData, Language } from '../types'
import { useNavigationHistory } from './useNavigationHistory'
import { useBookmarks } from './useBookmarks'

interface UseWikiOptions {
  initialTopic?: string
  language?: Language
  llmConfig?: LLMProviderConfig
  autoDetectProvider?: boolean  // Авто-определение провайдера при инициализации
}

export function useWiki({
  initialTopic = 'Гармония',
  language = 'ru',
  llmConfig,
  autoDetectProvider = true  // По умолчанию включено авто-определение
}: UseWikiOptions = {}) {
  const [currentTopic, setCurrentTopic] = useState<string>(initialTopic)
  const [content, setContent] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [asciiArt, setAsciiArt] = useState<AsciiArtData | null>(null)
  const [generationTime, setGenerationTime] = useState<number | null>(null)
  // _providerStatus можно использовать для UI индикатора
  const [_providerStatus, setProviderStatus] = useState<string>('Инициализация...')

  // Ref для защиты от race conditions
  const currentTopicRef = useRef<string>(currentTopic)
  const requestedTopicRef = useRef<string>(initialTopic)
  
  // Кэш ASCII артов — чтобы не перегенерировать
  const asciiArtCache = useRef<Map<string, AsciiArtData>>(new Map())

  // Создаём LLM сервис с нужной конфигурацией
  const llmServiceRef = useRef<ReturnType<typeof createLLMService> | null>(null)
  
  const isCancelledRef = useRef(false)
  const { pushToHistory, goBack, goForward, canGoBack, canGoForward } = useNavigationHistory()
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks()

  // Инициализация LLM сервиса с авто-определением
  useEffect(() => {
    let cancelled = false
    
    const initLLMService = async () => {
      try {
        if (autoDetectProvider) {
          // Асинхронная инициализация с проверкой доступности
          const service = await createLLMServiceAsync(llmConfig)
          if (!cancelled) {
            llmServiceRef.current = service
            setProviderStatus('Готов')
          }
        } else {
          // Синхронная инициализация (быстрая, без проверки)
          const service = createLLMService(llmConfig)
          if (!cancelled) {
            llmServiceRef.current = service
            setProviderStatus('Готов (без проверки)')
          }
        }
      } catch (err) {
        console.error('Failed to initialize LLM service:', err)
        if (!cancelled) {
          // Fallback на demo режим
          const { createLLMService } = await import('../services/llmService')
          llmServiceRef.current = createLLMService({ provider: 'gemini' })
          setProviderStatus('Demo режим')
        }
      }
    }
    
    initLLMService()
    
    return () => {
      cancelled = true
    }
  }, [autoDetectProvider, llmConfig])

  // Обновляем ref при смене темы
  useEffect(() => {
    currentTopicRef.current = currentTopic
  }, [currentTopic])

  useEffect(() => {
    if (!currentTopic || !currentTopic.trim()) {
      setIsLoading(false)
      setError('Тема не может быть пустой')
      return
    }

    // Проверка что LLM сервис инициализирован
    if (!llmServiceRef.current) {
      console.warn('LLM service not initialized yet, waiting...')
      return
    }

    const requestedTopic = currentTopic
    requestedTopicRef.current = requestedTopic
    isCancelledRef.current = false

    const llmService = llmServiceRef.current  // Сохраняем ссылку для использования

    const fetchContentAndArt = async () => {
      setIsLoading(true)
      setError(null)
      setGenerationTime(null)
      const startTime = performance.now()

      // Проверяем кэш ASCII артов
      const cachedArt = asciiArtCache.current.get(currentTopic)
      if (cachedArt) {
        setAsciiArt(cachedArt)
      } else {
        // Генерируем новый и кэшируем
        try {
          const art = await llmService.generateAsciiArt(currentTopic, language)
          if (!isCancelledRef.current && currentTopicRef.current === requestedTopic) {
            setAsciiArt(art)
            asciiArtCache.current.set(currentTopic, art)
          }
        } catch (err) {
          if (!isCancelledRef.current && currentTopicRef.current === requestedTopic) {
            console.error('Failed to generate ASCII art:', err)
            const fallbackArt = createFallbackArt(currentTopic)
            setAsciiArt(fallbackArt)
            asciiArtCache.current.set(currentTopic, fallbackArt)
          }
        }
      }

      // Стримим контент
      let accumulatedContent = ''
      try {
        for await (const chunk of llmService.streamDefinition(currentTopic, language)) {
          if (isCancelledRef.current) break

          const cleanChunk = chunk.replace('Error:', '').trim()
          if (cleanChunk) {
            accumulatedContent += cleanChunk
            if (!isCancelledRef.current && currentTopicRef.current === requestedTopic) {
              setContent(accumulatedContent)
            }
          }
        }

        // Финальная очистка от мусора
        if (!isCancelledRef.current && currentTopicRef.current === requestedTopic) {
          const cleanedContent = cleanContent(accumulatedContent)
          setContent(cleanedContent)
          pushToHistory(currentTopic, cleanedContent)
        }
      } catch (e: unknown) {
        if (!isCancelledRef.current && currentTopicRef.current === requestedTopic) {
          const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred'
          setError(errorMessage)
          setContent('')
          console.error(e)
        }
      } finally {
        if (!isCancelledRef.current && currentTopicRef.current === requestedTopic) {
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

  /**
   * Очистка контента от markdown и артефактов
   */
  const cleanContent = (content: string): string => {
    let cleaned = content
    
    // Удаляем markdown заголовки
    cleaned = cleaned.replace(/^#+\s+/gm, '')
    
    // Удаляем markdown списки
    cleaned = cleaned.replace(/^[\-\*•]\s+/gm, '')
    
    // Удаляем markdown bold/italic
    cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1')
    cleaned = cleaned.replace(/\*([^*]+)\*/g, '$1')
    cleaned = cleaned.replace(/__([^_]+)__/g, '$1')
    cleaned = cleaned.replace(/_([^_]+)_/g, '$1')
    
    // Удаляем markdown code blocks
    cleaned = cleaned.replace(/```[\s\S]*?```/g, '')
    cleaned = cleaned.replace(/`([^`]+)`/g, '$1')
    
    // Удаляем markdown ссылки
    cleaned = cleaned.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    
    // Удаляем markdown изображения
    cleaned = cleaned.replace(/!\[([^\]]*)\]\([^\)]+\)/g, '')
    
    // Удаляем HTML теги
    cleaned = cleaned.replace(/<[^>]+>/g, '')
    
    // Нормализуем множественные пробелы (но сохраняем одиночные!)
    cleaned = cleaned.replace(/[ \t]+/g, ' ')
    
    // Удаляем лишние новые строки (но сохраняем структуру)
    cleaned = cleaned.replace(/\n\s*\n/g, '\n')
    cleaned = cleaned.trim()
    
    // Удаляем повторяющиеся слова (артефакты генерации)
    cleaned = cleaned.replace(/\b(\w+)\s+\1\b/gi, '$1')
    
    return cleaned
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
