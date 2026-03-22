/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ILLMProvider, Language, AsciiArtData, LLMProviderConfig } from '../types'
import { OLLAMA_DEFAULT_CONFIG } from '../config/llmConfig'

/**
 * Структура ответа Ollama API
 */
interface OllamaGenerateResponse {
  response: string
  done: boolean
}

/**
 * Реализация провайдера Ollama
 * Поддерживает локальные LLM через Ollama API
 */
export class OllamaProvider implements ILLMProvider {
  private readonly config: LLMProviderConfig
  private readonly baseUrl: string

  constructor(config?: Partial<LLMProviderConfig>) {
    this.config = {
      ...OLLAMA_DEFAULT_CONFIG,
      ...config,
      provider: 'ollama',
    }
    this.baseUrl = this.config.baseUrl || OLLAMA_DEFAULT_CONFIG.baseUrl!
  }

  async *streamDefinition(
    topic: string,
    language: Language = 'en'
  ): AsyncGenerator<string, void, undefined> {
    const promptRu = `Дай краткое, энциклопедическое определение термина "${topic}". Будь информативным и нейтральным. Не используй markdown, заголовки или специальное форматирование. Ответь только текстом определения.`
    const promptEn = `Provide a concise, encyclopedia-style definition for the term: "${topic}". Be informative and neutral. Do not use markdown, titles, or special formatting. Respond with only the definition text.`

    const prompt = language === 'ru' ? promptRu : promptEn

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.textModel,
          prompt: prompt,
          stream: true,
          options: {
            temperature: 0.7,
          },
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Ollama API error: ${response.status} - ${errorText}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('Response body is not readable')
      }

      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        // Ollama возвращает JSON строки, разделённые новыми строками
        const lines = chunk.split('\n').filter((line) => line.trim())

        for (const line of lines) {
          try {
            const data = JSON.parse(line) as OllamaGenerateResponse
            if (data.response) {
              yield data.response
            }
          } catch {
            // Игнорируем невалидный JSON
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.config.textModel,
          prompt: prompt,
          stream: false,
          options: {
            temperature: 0.8,
          },
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Ollama API error: ${response.status} - ${errorText}`)
      }

      const data = (await response.json()) as OllamaGenerateResponse
      return data.response.trim() || this.getRandomTopicFallback(language)
    } catch (error) {
      console.error('Error getting random word from Ollama:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.'
      throw new Error(`Could not get random word: ${errorMessage}`)
    }
  }

  async generateAsciiArt(topic: string, _language: Language = 'en'): Promise<AsciiArtData> {
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

    const maxRetries = this.config.maxRetries || 3

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(`${this.baseUrl}/api/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: this.config.artModel,
            prompt: prompt,
            stream: false,
            format: 'json',
            options: {
              temperature: 0.7,
            },
          }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(`Ollama API error: ${response.status} - ${errorText}`)
        }

        const data = (await response.json()) as OllamaGenerateResponse
        let jsonStr = data.response.trim()

        // Удаляем markdown fence если есть
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

        return {
          art: parsedData.art,
        }
      } catch (error) {
        const lastError = error instanceof Error ? error : new Error('Unknown error occurred')
        console.warn(`Attempt ${attempt}/${maxRetries} failed:`, lastError.message)

        if (attempt === maxRetries) {
          console.error('All retry attempts failed for ASCII art generation')
          throw new Error(`Could not generate ASCII art after ${maxRetries} attempts: ${lastError.message}`)
        }
      }
    }

    throw new Error('All retry attempts failed')
  }

  getConfig(): LLMProviderConfig {
    return this.config
  }

  /**
   * Fallback для случайного слова при ошибке API
   */
  private getRandomTopicFallback(language: Language = 'en'): string {
    const topicsRu = [
      'Баланс', 'Гармония', 'Диссонанс', 'Единство', 'Фрагментация', 'Ясность', 'Неопределённость',
      'Присутствие', 'Отсутствие', 'Творение', 'Разрушение', 'Свет', 'Тень', 'Начало', 'Конец',
      'Спираль', 'Волны', 'Зигзаг', 'Вибрация', 'Гравитация', 'Импульс', 'Инерция',
      'Фрактал', 'Квант', 'Энтропия', 'Вихрь', 'Резонанс', 'Равновесие', 'Поток', 'Тишина'
    ]

    const topicsEn = [
      'Balance', 'Harmony', 'Discord', 'Unity', 'Fragmentation', 'Clarity', 'Ambiguity', 'Presence', 'Absence',
      'Creation', 'Destruction', 'Light', 'Shadow', 'Beginning', 'Ending', 'Rising', 'Falling',
      'Spiral', 'Waves', 'Zigzag', 'Vibration', 'Gravity', 'Momentum', 'Inertia',
      'Fractal', 'Quantum', 'Entropy', 'Vortex', 'Resonance', 'Equilibrium', 'Stream', 'Silence'
    ]

    const topics = language === 'ru' ? topicsRu : topicsEn
    return topics[Math.floor(Math.random() * topics.length)]
  }
}
