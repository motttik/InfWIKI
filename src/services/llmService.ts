/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Language } from '../types'

/**
 * Конфигурация LLM провайдера
 */
export interface LLMProviderConfig {
  provider: 'gemini' | 'ollama'
  apiKey?: string
  baseUrl?: string
  model?: string
  artModel?: string
}

/**
 * Данные ASCII арта
 */
export interface AsciiArtData {
  art: string
  text?: string
}

/**
 * Базовый интерфейс LLM сервиса
 */
export interface LLMService {
  streamDefinition(topic: string, language: Language): AsyncGenerator<string, void, undefined>
  getRandomWord(language: Language): Promise<string>
  generateAsciiArt(topic: string, language: Language): Promise<AsciiArtData>
}

/**
 * Тема по умолчанию
 */
const TOPICS_RU = [
  'Баланс', 'Гармония', 'Диссонанс', 'Единство', 'Фрагментация', 'Ясность', 'Неопределённость',
  'Присутствие', 'Отсутствие', 'Творение', 'Разрушение', 'Свет', 'Тень', 'Начало', 'Конец',
  'Восход', 'Падение', 'Связь', 'Изоляция', 'Надежда', 'Отчаяние',
  'Порядок и хаос', 'Свет и тень', 'Звук и тишина', 'Форма и бесформенность',
  'Бытие и небытие', 'Движение и покой', 'Конечное и бесконечное',
  'Память и забвение', 'Вопрос и ответ', 'Поиск и обретение', 'Путь и цель',
  'Сон и реальность', 'Время и вечность', 'Я и другой', 'Известное и неизвестное',
  'Зигзаг', 'Волны', 'Спираль', 'Вибрация', 'Гравитация', 'Импульс', 'Инерция',
  'Турбулентность', 'Давление', 'Напряжение', 'Фрактал', 'Квант', 'Энтропия',
  'Вихрь', 'Резонанс', 'Равновесие', 'Упругость', 'Вязкость', 'Каскад',
  'Лиминальный', 'Эфемерный', 'Парадокс', 'Метаморфоза', 'Синестезия', 'Рекурсия',
  'Возникновение', 'Диалектика', 'Пустота', 'Возвышенное', 'Химера', 'Бездна',
  'Экзистенциальный', 'Нигилизм', 'Феноменология', 'Деконструкция', 'Абсурдизм',
  'Катарсис', 'Озарение', 'Меланхолия', 'Ностальгия', 'Тоска', 'Мечтание',
  'Логос', 'Мифос', 'Анамнесис', 'Интертекстуальность', 'Поток', 'Тишина'
]

const TOPICS_EN = [
  'Balance', 'Harmony', 'Discord', 'Unity', 'Fragmentation', 'Clarity', 'Ambiguity', 'Presence', 'Absence',
  'Creation', 'Destruction', 'Light', 'Shadow', 'Beginning', 'Ending', 'Rising', 'Falling',
  'Connection', 'Isolation', 'Hope', 'Despair', 'Order and chaos', 'Light and shadow',
  'Sound and silence', 'Form and formlessness', 'Being and nonbeing', 'Motion and stillness',
  'Finite and infinite', 'Memory and forgetting', 'Question and answer', 'Search and discovery',
  'Journey and destination', 'Dream and reality', 'Time and eternity', 'Self and other',
  'Zigzag', 'Waves', 'Spiral', 'Vibration', 'Gravity', 'Momentum', 'Inertia', 'Turbulence',
  'Pressure', 'Tension', 'Fractal', 'Quantum', 'Entropy', 'Vortex', 'Resonance', 'Equilibrium',
  'Liminal', 'Ephemeral', 'Paradox', 'Metamorphosis', 'Synesthesia', 'Recursion', 'Emergence',
  'Dialectic', 'Void', 'Sublime', 'Chimera', 'Abyssal', 'Existential', 'Nihilism',
  'Phenomenology', 'Deconstruction', 'Absurdism', 'Catharsis', 'Epiphany', 'Melancholy',
  'Nostalgia', 'Longing', 'Reverie', 'Logos', 'Mythos', 'Anamnesis', 'Intertextuality', 'Stream'
]

export function getRandomTopic(language: Language = 'en'): string {
  const topics = language === 'ru' ? TOPICS_RU : TOPICS_EN
  return topics[Math.floor(Math.random() * topics.length)]
}

/**
 * Получение API ключа из переменных окружения
 */
const getApiKey = (): string => {
  return import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || ''
}

/**
 * Получение базового URL для Ollama
 */
const getOllamaBaseUrl = (): string => {
  return import.meta.env.VITE_OLLAMA_BASE_URL || process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
}

/**
 * Получение модели Ollama из переменных окружения
 */
const getOllamaModel = (): string => {
  return import.meta.env.VITE_OLLAMA_MODEL || process.env.OLLAMA_MODEL || 'llama3.2:3b'
}

/**
 * Gemini LLM Service
 */
class GeminiService implements LLMService {
  private ai: any
  private textModelName: string
  private artModelName: string
  private readonly ENABLE_THINKING_FOR_ASCII_ART = false

  constructor() {
    const apiKey = getApiKey()
    if (!apiKey) {
      console.warn('GEMINI_API_KEY environment variable is not set.')
    }
    
    this.ai = null
    this.textModelName = 'gemini-2.5-flash-lite'
    this.artModelName = 'gemini-2.5-flash'
  }

  private async initAI() {
    if (!this.ai) {
      const { GoogleGenAI } = await import('@google/genai')
      this.ai = new GoogleGenAI({ apiKey: getApiKey() })
    }
  }

  async *streamDefinition(topic: string, language: Language = 'en'): AsyncGenerator<string, void, undefined> {
    await this.initAI()

    // Усиленный промпт с явным указанием языка
    const promptRu = `Дай краткое, энциклопедическое определение термина "${topic}". Будь информативным и нейтральным. ОТВЕЧАЙ СТРОГО НА РУССКОМ ЯЗЫКЕ. Не используй markdown, заголовки или специальное форматирование. Ответь только текстом определения. НЕ ИСПОЛЬЗУЙ АНГЛИЙСКИЕ СЛОВА.`
    const promptEn = `Provide a concise, encyclopedia-style definition for the term: "${topic}". Be informative and neutral. Respond ONLY in English. Do not use markdown, titles, or special formatting. Respond with only the definition text. NO RUSSIAN WORDS.`
    const prompt = language === 'ru' ? promptRu : promptEn

    try {
      const response = await this.ai.models.generateContentStream({
        model: this.textModelName,
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 0 },
        },
      })

      for await (const chunk of response) {
        if (chunk.text) {
          yield chunk.text
        }
      }
    } catch (error) {
      console.error('Error streaming from Gemini:', error)
      
      // Специфичная обработка ошибок
      let errorMessage = 'An unknown error occurred.'
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('API key')) {
          errorMessage = 'Невалидный API ключ. Проверьте GEMINI_API_KEY в .env файле.'
        } else if (error.message.includes('403')) {
          errorMessage = 'Доступ запрещён. Проверьте квоты API.'
        } else if (error.message.includes('429')) {
          errorMessage = 'Превышен лимит запросов. Подождите немного.'
        } else if (error.message.includes('500')) {
          errorMessage = 'Сервер Gemini недоступен. Попробуйте позже.'
        } else {
          errorMessage = error.message
        }
      }
      
      yield `Error: ${errorMessage}`
      // Не выбрасываем ошибку после yield
    }
  }

  async getRandomWord(language: Language = 'en'): Promise<string> {
    await this.initAI()
    
    const promptRu = `Назови одно случайное интересное русское слово или концепцию из двух слов. Только само слово, без лишнего текста.`
    const promptEn = `Generate a single, random, interesting English word or two-word concept. Only the word itself, no extra text.`
    const prompt = language === 'ru' ? promptRu : promptEn

    try {
      const response = await this.ai.models.generateContent({
        model: this.textModelName,
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 0 },
        },
      })
      return response.text?.trim() || getRandomTopic(language)
    } catch (error) {
      console.error('Error getting random word from Gemini:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.'
      throw new Error(`Could not get random word: ${errorMessage}`)
    }
  }

  async generateAsciiArt(topic: string, _language: Language = 'en'): Promise<AsciiArtData> {
    await this.initAI()
    
    const artPromptPart = `1. "art": meta ASCII visualization of the word "${topic}":
  - Palette: │─┌┐└┘├┤┬┴┼►◄▲▼○●◐◑░▒▓█▀▄■□▪▫★☆♦♠♣♥⟨⟩/\\_|
  - Shape mirrors concept - make the visual form embody the word's essence
  - Examples:
    * "explosion" → radiating lines from center
    * "hierarchy" → pyramid structure
    * "flow" → curved directional lines
  - Return as single string with \\n for line breaks`

    const prompt = `For "${topic}", create a JSON object with one key: "art".
${artPromptPart}

Return ONLY the raw JSON object, no additional text. The response must start with "{" and end with "}" and contain only the art property.`

    const maxRetries = 1
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const config: { responseMimeType: string; thinkingConfig?: { thinkingBudget: number } } = {
          responseMimeType: 'application/json',
        }
        if (!this.ENABLE_THINKING_FOR_ASCII_ART) {
          config.thinkingConfig = { thinkingBudget: 0 }
        }

        const response = await this.ai.models.generateContent({
          model: this.artModelName,
          contents: prompt,
          config: config,
        })

        let jsonStr = response.text?.trim() || ''

        const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s
        const match = jsonStr.match(fenceRegex)
        if (match && match[1]) {
          jsonStr = match[1].trim()
        }

        if (!jsonStr.startsWith('{') || !jsonStr.endsWith('}')) {
          throw new Error('Response is not a valid JSON object')
        }

        const parsedData = JSON.parse(jsonStr) as { art: string }

        if (typeof parsedData.art !== 'string' || parsedData.art.trim().length === 0) {
          throw new Error('Invalid or empty ASCII art in response')
        }

        return { art: parsedData.art }
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error occurred')
        console.warn(`Attempt ${attempt}/${maxRetries} failed:`, lastError.message)

        if (attempt === maxRetries) {
          console.error('All retry attempts failed for ASCII art generation')
          throw new Error(`Could not generate ASCII art after ${maxRetries} attempts: ${lastError.message}`)
        }
      }
    }

    throw lastError || new Error('All retry attempts failed')
  }
}

/**
 * Ollama LLM Service
 */
class OllamaService implements LLMService {
  private baseUrl: string
  private model: string
  private readonly DEFAULT_TIMEOUT = 30000 // 30 секунд

  constructor() {
    this.baseUrl = getOllamaBaseUrl()
    this.model = getOllamaModel()
  }

  /**
   * Создаёт AbortController с таймаутом
   */
  private createTimeoutController(): { controller: AbortController; timeoutId: NodeJS.Timeout } {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.DEFAULT_TIMEOUT)
    return { controller, timeoutId }
  }

  /**
   * Форматирует ошибку для пользователя
   */
  private formatErrorMessage(error: unknown, context: string): string {
    if (error instanceof TypeError) {
      // Network errors: connection refused, DNS failure, etc.
      if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        return `Не удалось подключиться к Ollama. Убедитесь, что сервер запущен на ${this.baseUrl}`
      }
      if (error.message.includes('ECONNREFUSED')) {
        return `Ollama не запущен. Запустите: ollama serve`
      }
      if (error.message.includes('ETIMEDOUT') || error.message.includes('timeout')) {
        return `Превышено время ожидания ответа от Ollama (>${this.DEFAULT_TIMEOUT}мс)`
      }
    }

    if (error instanceof Error) {
      if (error.message.includes('404')) {
        return `Модель "${this.model}" не найдена. Установите: ollama pull ${this.model}`
      }
      if (error.message.includes('503')) {
        return `Ollama перегружен. Попробуйте позже.`
      }
      return `${context}: ${error.message}`
    }

    return `${context}: Неизвестная ошибка`
  }

  async *streamDefinition(topic: string, language: Language = 'en'): AsyncGenerator<string, void, undefined> {
    // Усиленный промпт с явным указанием языка
    const promptRu = `Дай краткое, энциклопедическое определение термина "${topic}". Будь информативным и нейтральным. ОТВЕЧАЙ СТРОГО НА РУССКОМ ЯЗЫКЕ. Не используй markdown, заголовки или специальное форматирование. Ответь только текстом определения. НЕ ИСПОЛЬЗУЙ АНГЛИЙСКИЕ СЛОВА.`
    const promptEn = `Provide a concise, encyclopedia-style definition for the term: "${topic}". Be informative and neutral. Respond ONLY in English. Do not use markdown, titles, or special formatting. Respond with only the definition text. NO RUSSIAN WORDS.`
    const prompt = language === 'ru' ? promptRu : promptEn

    const { controller, timeoutId } = this.createTimeoutController()

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: true,
          // Ollama options для лучшего качества
          options: {
            temperature: 0.3,  // Более детерминированный ответ
            top_p: 0.9,
          },
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.trim()) {
            try {
              const json = JSON.parse(line)

              // Проверяем флаг завершения
              if (json.done === true) {
                return
              }

              // Поддержка обоих форматов: /api/generate (response) и /api/chat (message.content)
              const chunk = json.response ?? json.message?.content
              if (chunk) {
                yield chunk
              }
            } catch {
              // Skip invalid JSON lines
            }
          }
        }
      }
    } catch (error) {
      clearTimeout(timeoutId)
      console.error('Error streaming from Ollama:', error)

      const userMessage = this.formatErrorMessage(error, 'Ошибка генерации определения')
      yield userMessage
      throw new Error(userMessage)
    }
  }

  async getRandomWord(language: Language = 'en'): Promise<string> {
    const promptRu = `Назови одно случайное интересное русское слово или концепцию из двух слов. Только само слово, без лишнего текста.`
    const promptEn = `Generate a single, random, interesting English word or two-word concept. Only the word itself, no extra text.`
    const prompt = language === 'ru' ? promptRu : promptEn

    const { controller, timeoutId } = this.createTimeoutController()

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: false,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`)
      }

      const json = await response.json()
      return json.response?.trim() || json.message?.content?.trim() || getRandomTopic(language)
    } catch (error) {
      clearTimeout(timeoutId)
      console.error('Error getting random word from Ollama:', error)

      const userMessage = this.formatErrorMessage(error, 'Ошибка получения случайного слова')
      throw new Error(userMessage)
    }
  }

  async generateAsciiArt(topic: string, _language: Language = 'en'): Promise<AsciiArtData> {
    const artPrompt = `Create ASCII art visualization of the word "${topic}".
  - Palette: │─┌┐└┘├┤┬┴┼►◄▲▼○●◐◑░▒▓█▀▄■□▪▫★☆♦♠♣♥⟨⟩/\\_|
  - Shape mirrors concept - make the visual form embody the word's essence
  - Return ONLY the ASCII art as a single string with newlines, no additional text`

    const { controller, timeoutId } = this.createTimeoutController()

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt: artPrompt,
          stream: false,
        }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`)
      }

      const json = await response.json()
      const art = json.response?.trim() || json.message?.content?.trim() || ''

      if (!art) {
        throw new Error('Empty response from Ollama')
      }

      return { art }
    } catch (error) {
      clearTimeout(timeoutId)
      console.error('Error generating ASCII art from Ollama:', error)

      const userMessage = this.formatErrorMessage(error, 'Ошибка генерации ASCII арта')
      throw new Error(userMessage)
    }
  }
}

/**
 * Mock Service для демо-режима (работает без API ключа)
 */
class MockService implements LLMService {
  private readonly DEMO_CONTENT: Record<string, string> = {
    'Гармония': 'Гармония — философская категория, выражающая соразмерность, согласованность и упорядоченность элементов целого. В древнегреческой философии гармония понималась как основа космоса и души. Гармония представляет собой единство противоположностей, баланс между порядком и хаосом.',
    'Баланс': 'Баланс — состояние равновесия, устойчивости системы. В философии и физике означает равенство действующих сил или противоположных тенденций. Баланс достигается через компенсацию противоположных воздействий и сохранение устойчивости.',
    'Спираль': 'Спираль — кривая линия, обвивающая центральную ось и постепенно удаляющаяся от неё. Символ эволюции, развития и циклического движения вперёд. Спираль отражает прогрессивное развитие через повторяющиеся циклы.',
    'Квант': 'Квант — неделимая порция физической величины. В квантовой механике означает дискретность энергии и других физических параметров. Квант представляет минимальную возможную величину взаимодействия.',
    'Поток': 'Поток — непрерывное движение, течение. В психологии — состояние полной вовлечённости в деятельность, в физике — перемещение вещества или энергии. Поток характеризует непрерывность изменения.',
    'Hypertext': 'Hypertext is text displayed on a computer or other electronic device with references (hyperlinks) to other text that the reader can immediately access. Hypertext enables non-linear navigation through information.',
    'Balance': 'Balance is a state of equilibrium where different elements are in proper proportion. In philosophy, it represents the harmony between opposing forces. Balance is achieved through compensation of opposite influences.',
    'Harmony': 'Harmony is a concept expressing agreement, coordination, and pleasant combination of elements. In music, it refers to the combination of simultaneously sounded musical notes. Harmony represents unity in diversity.',
    'Spiral': 'A spiral is a curve which emanates from a point, moving farther away as it revolves around the point. It symbolizes growth, evolution, and cosmic expansion. Spiral represents progressive development through cycles.',
    'Quantum': 'Quantum is the minimum amount of any physical entity involved in an interaction. Quantum mechanics describes the behavior of matter and energy at atomic scales. Quantum represents discrete nature of reality.',
    'Flow': 'Flow is the continuous movement or progression of something. In psychology, it describes a state of complete immersion in an activity. Flow characterizes seamless forward motion.',
  }

  private readonly ASCII_ARTS: Record<string, string> = {
    'Гармония': `
    ╭─────────────╮
    │  ГАРМОНИЯ   │
    │   ╭───╮     │
    │  ╱ ╱ ╱ ╲    │
    │ ╱ ╱ ╱   ╲   │
    │╰─╯ ╰─╯ ╰─╯  │
    ╰─────────────╯`,
    'Баланс': `
    ╭─────────────╮
    │   БАЛАНС    │
    │      △      │
    │     ╱ ╲     │
    │    ╱   ╲    │
    │   ╱─────╲   │
    ╰─────────────╯`,
    'Спираль': `
    ╭─────────────╮
    │   СПИРАЛЬ   │
    │    ╭──╮     │
    │   ╱    ╲    │
    │  ╲ ╭──╮ ╱   │
    │   ╰──╯ ╱    │
    ╰─────────────╯`,
    'Квант': `
    ╭─────────────╮
    │    КВАНТ    │
    │   ● ● ●     │
    │   ● ● ●     │
    │   ● ● ●     │
    │             │
    ╰─────────────╯`,
    'Поток': `
    ╭─────────────╮
    │    ПОТОК    │
    │  ═══════►   │
    │  ═══════►   │
    │  ═══════►   │
    │             │
    ╰─────────────╯`,
    'Hypertext': `
    ╭───────────────╮
    │  HYPERTEXT    │
    │  ┌─┐ ┌─┐ ┌─┐ │
    │  │H│─│T│─│X│ │
    │  └─┘ └─┘ └─┘ │
    ╰───────────────╯`,
    'Balance': `
    ╭───────────────╮
    │   BALANCE     │
    │      △        │
    │     ╱ ╲       │
    │    ╱   ╲      │
    │   ╱─────╲     │
    ╰───────────────╯`,
    'Harmony': `
    ╭───────────────╮
    │   HARMONY     │
    │   ♫ ♪ ♫       │
    │     ♪         │
    │   ♫ ♪ ♫       │
    │               │
    ╰───────────────╯`,
    'Spiral': `
    ╭───────────────╮
    │   SPIRAL      │
    │    ╭──╮       │
    │   ╱    ╲      │
    │  ╲ ╭──╮ ╱     │
    │   ╰──╯ ╱      │
    ╰───────────────╯`,
    'Quantum': `
    ╭───────────────╮
    │   QUANTUM     │
    │   ⚛ ⚛ ⚛      │
    │   ⚛ ⚛ ⚛      │
    │   ⚛ ⚛ ⚛      │
    ╰───────────────╯`,
    'Flow': `
    ╭───────────────╮
    │    FLOW       │
    │  ═══════►     │
    │  ═══════►     │
    │  ═══════►     │
    ╰───────────────╯`,
  }

  async *streamDefinition(topic: string, language: Language = 'en'): AsyncGenerator<string, void, undefined> {
    const demoText = this.DEMO_CONTENT[topic] ||
      (language === 'ru'
        ? `Это демо-режим. "${topic}" — концепция, требующая подключения API для полного определения. В реальном режиме здесь будет энциклопедическая информация.`
        : `This is demo mode. "${topic}" is a concept that requires API connection for full definition. In real mode, encyclopedic information will be displayed here.`)

    // Оптимизированная скорость: 15ms вместо 50ms
    const words = demoText.split(' ')
    for (const word of words) {
      yield word + ' '
      await new Promise(resolve => setTimeout(resolve, 15))
    }
  }

  async getRandomWord(language: Language = 'en'): Promise<string> {
    const topics = language === 'ru'
      ? ['Гармония', 'Баланс', 'Спираль', 'Квант', 'Поток']
      : ['Harmony', 'Balance', 'Spiral', 'Quantum', 'Flow']
    return topics[Math.floor(Math.random() * topics.length)]
  }

  async generateAsciiArt(topic: string, _language: Language = 'en'): Promise<AsciiArtData> {
    // Небольшая задержка для реалистичности
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // Проверяем точное совпадение
    const exactKey = Object.keys(this.ASCII_ARTS).find(
      key => key.toLowerCase() === topic.toLowerCase()
    )
    
    if (exactKey) {
      return { art: this.ASCII_ARTS[exactKey] }
    }
    
    // Генерируем простой арт для неизвестных тем
    const displayableTopic = topic.length > 15 ? topic.substring(0, 12) + '...' : topic
    const paddedTopic = ` ${displayableTopic} `
    const width = Math.max(paddedTopic.length + 2, 15)
    const padding = Math.floor((width - paddedTopic.length) / 2)
    const centeredTopic = ' '.repeat(padding) + paddedTopic
    const topBorder = `╭${'─'.repeat(width)}╮`
    const middle = `│${centeredTopic}│`
    const bottomBorder = `╰${'─'.repeat(width)}╯`
    
    return {
      art: `\n${topBorder}\n${middle}\n${bottomBorder}`,
    }
  }
}

/**
 * Проверка доступности Ollama
 */
async function checkOllamaAvailability(baseUrl: string): Promise<boolean> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000)
    
    const response = await fetch(`${baseUrl}/api/tags`, {
      method: 'GET',
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)
    return response.ok
  } catch {
    return false
  }
}

/**
 * Умная фабрика LLM сервисов с авто-определением и fallback
 */
export function createLLMService(config?: LLMProviderConfig): LLMService {
  const apiKey = getApiKey()
  const ollamaBaseUrl = getOllamaBaseUrl()
  const ollamaModel = getOllamaModel()

  // 1. Если явно указан Ollama — используем его
  if (config?.provider === 'ollama') {
    console.log('🦙 Using Ollama provider (explicit)')
    return new OllamaService()
  }

  // 2. Если есть валидный API ключ Gemini — используем Gemini
  if (apiKey && apiKey !== 'your_api_key_here' && apiKey !== 'YOUR_API_KEY_HERE') {
    console.log('✨ Using Gemini provider')
    return new GeminiService()
  }

  // 3. API ключа Gemini нет — пробуем Ollama
  console.log('⚠️  No Gemini API key, checking Ollama...')
  
  // Проверяем Ollama синхронно (для инициализации)
  // Полная проверка будет при первом запросе
  console.log(`🦙 Ollama configured: ${ollamaBaseUrl} (model: ${ollamaModel})`)
  console.log('🔄 Auto-fallback to Ollama provider')
  return new OllamaService()
}

/**
 * Асинхронная фабрика с полной проверкой доступности
 */
export async function createLLMServiceAsync(config?: LLMProviderConfig): Promise<LLMService> {
  const apiKey = getApiKey()
  const ollamaBaseUrl = getOllamaBaseUrl()
  const ollamaModel = getOllamaModel()

  // 1. Если явно указан Ollama — используем его
  if (config?.provider === 'ollama') {
    const isAvailable = await checkOllamaAvailability(ollamaBaseUrl)
    if (isAvailable) {
      console.log('🦙 Using Ollama provider (explicit, verified)')
      return new OllamaService()
    }
    console.warn('⚠️  Ollama not available, falling back to Demo Mode')
    return new MockService()
  }

  // 2. Если есть валидный API ключ Gemini — используем Gemini
  if (apiKey && apiKey !== 'your_api_key_here' && apiKey !== 'YOUR_API_KEY_HERE') {
    console.log('✨ Using Gemini provider')
    return new GeminiService()
  }

  // 3. API ключа Gemini нет — пробуем Ollama
  console.log('⚠️  No Gemini API key, checking Ollama availability...')
  
  const isOllamaAvailable = await checkOllamaAvailability(ollamaBaseUrl)
  
  if (isOllamaAvailable) {
    console.log(`🦙 Ollama available at ${ollamaBaseUrl} (model: ${ollamaModel})`)
    console.log('🔄 Auto-fallback to Ollama provider')
    return new OllamaService()
  }

  // 4. Ни Gemini, ни Ollama недоступны — Demo режим
  console.log('⚠️  Ollama not available, falling back to Demo Mode')
  console.log('🎭 Running in Demo Mode (no API providers available)')
  return new MockService()
}

/**
 * LLM сервис по умолчанию (с авто-определением)
 */
export const llmService = createLLMService({ provider: 'gemini' })

/**
 * Экспорт для обратной совместимости
 */
export const streamDefinition = llmService.streamDefinition.bind(llmService)
export const getRandomWord = llmService.getRandomWord.bind(llmService)
export const generateAsciiArt = llmService.generateAsciiArt.bind(llmService)
