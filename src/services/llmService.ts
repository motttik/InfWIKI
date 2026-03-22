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
    
    const promptRu = `Дай краткое, энциклопедическое определение термина "${topic}". Будь информативным и нейтральным. Не используй markdown, заголовки или специальное форматирование. Ответь только текстом определения.`
    const promptEn = `Provide a concise, encyclopedia-style definition for the term: "${topic}". Be informative and neutral. Do not use markdown, titles, or special formatting. Respond with only the definition text.`
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
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.'
      yield `Error: Could not generate content for "${topic}". ${errorMessage}`
      throw new Error(errorMessage)
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

  constructor() {
    this.baseUrl = getOllamaBaseUrl()
    this.model = getOllamaModel()
  }

  async *streamDefinition(topic: string, language: Language = 'en'): AsyncGenerator<string, void, undefined> {
    const promptRu = `Дай краткое, энциклопедическое определение термина "${topic}". Будь информативным и нейтральным. Не используй markdown, заголовки или специальное форматирование. Ответь только текстом определения.`
    const promptEn = `Provide a concise, encyclopedia-style definition for the term: "${topic}". Be informative and neutral. Do not use markdown, titles, or special formatting. Respond with only the definition text.`
    const prompt = language === 'ru' ? promptRu : promptEn

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: true,
        }),
      })

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
              if (json.response) {
                yield json.response
              }
            } catch {
              // Skip invalid JSON lines
            }
          }
        }
      }
    } catch (error) {
      console.error('Error streaming from Ollama:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.'
      yield `Error: Could not generate content for "${topic}". ${errorMessage}`
      throw new Error(errorMessage)
    }
  }

  async getRandomWord(language: Language = 'en'): Promise<string> {
    const promptRu = `Назови одно случайное интересное русское слово или концепцию из двух слов. Только само слово, без лишнего текста.`
    const promptEn = `Generate a single, random, interesting English word or two-word concept. Only the word itself, no extra text.`
    const prompt = language === 'ru' ? promptRu : promptEn

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: false,
        }),
      })

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`)
      }

      const json = await response.json()
      return json.response?.trim() || getRandomTopic(language)
    } catch (error) {
      console.error('Error getting random word from Ollama:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.'
      throw new Error(`Could not get random word: ${errorMessage}`)
    }
  }

  async generateAsciiArt(topic: string, _language: Language = 'en'): Promise<AsciiArtData> {
    const artPrompt = `Create ASCII art visualization of the word "${topic}".
  - Palette: │─┌┐└┘├┤┬┴┼►◄▲▼○●◐◑░▒▓█▀▄■□▪▫★☆♦♠♣♥⟨⟩/\\_|
  - Shape mirrors concept - make the visual form embody the word's essence
  - Return ONLY the ASCII art as a single string with newlines, no additional text`

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt: artPrompt,
          stream: false,
        }),
      })

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`)
      }

      const json = await response.json()
      const art = json.response?.trim() || ''

      if (!art) {
        throw new Error('Empty response from Ollama')
      }

      return { art }
    } catch (error) {
      console.error('Error generating ASCII art from Ollama:', error)
      throw new Error(`Could not generate ASCII art: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

/**
 * Фабрика LLM сервисов
 */
export function createLLMService(config?: LLMProviderConfig): LLMService {
  const provider = config?.provider || 'gemini'
  
  switch (provider) {
    case 'ollama':
      return new OllamaService()
    case 'gemini':
    default:
      return new GeminiService()
  }
}

/**
 * LLM сервис по умолчанию (Gemini)
 */
export const llmService = createLLMService({ provider: 'gemini' })

/**
 * Экспорт для обратной совместимости
 */
export const streamDefinition = llmService.streamDefinition.bind(llmService)
export const getRandomWord = llmService.getRandomWord.bind(llmService)
export const generateAsciiArt = llmService.generateAsciiArt.bind(llmService)
