/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai'
import type { ILLMProvider, Language, AsciiArtData, LLMProviderConfig } from '../types'
import { GEMINI_DEFAULT_CONFIG, getGeminiApiKey } from '../config/llmConfig'

/**
 * Реализация провайдера Google Gemini
 */
export class GeminiProvider implements ILLMProvider {
  private readonly ai: GoogleGenAI
  private readonly config: LLMProviderConfig
  private readonly textModelName: string
  private readonly artModelName: string

  constructor(config?: Partial<LLMProviderConfig>) {
    this.config = {
      ...GEMINI_DEFAULT_CONFIG,
      ...config,
      provider: 'gemini',
    }

    const apiKey = config?.apiKey || getGeminiApiKey()
    if (!apiKey) {
      throw new Error('Gemini API key is required')
    }

    this.ai = new GoogleGenAI({ apiKey })
    this.textModelName = this.config.textModel
    this.artModelName = this.config.artModel
  }

  async *streamDefinition(
    topic: string,
    language: Language = 'en'
  ): AsyncGenerator<string, void, undefined> {
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
      return response.text?.trim() || this.getRandomTopicFallback(language)
    } catch (error) {
      console.error('Error getting random word from Gemini:', error)
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

    const maxRetries = this.config.maxRetries || 1

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const config: { responseMimeType: string; thinkingConfig?: { thinkingBudget: number } } = {
          responseMimeType: 'application/json',
        }
        config.thinkingConfig = { thinkingBudget: 0 }

        const response = await this.ai.models.generateContent({
          model: this.artModelName,
          contents: prompt,
          config: config,
        })

        let jsonStr = response.text?.trim() || ''

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
