/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Языки поддерживаемые приложением
 */
export type Language = 'ru' | 'en'

/**
 * Типы поддерживаемых LLM-провайдеров
 */
export type LLMProviderType = 'gemini' | 'ollama'

/**
 * Конфигурация LLM-провайдера
 */
export interface LLMProviderConfig {
  /** Тип провайдера */
  provider: LLMProviderType
  /** API ключ (для облачных провайдеров) */
  apiKey?: string
  /** URL эндпоинта (для локальных провайдеров) */
  baseUrl?: string
  /** Модель для генерации текста */
  textModel: string
  /** Модель для генерации ASCII-арта */
  artModel: string
  /** Таймаут запроса в миллисекундах */
  timeout?: number
  /** Максимальное количество попыток */
  maxRetries?: number
}

/**
 * Данные ASCII-арта
 */
export interface AsciiArtData {
  /** ASCII-визуализация */
  art: string
  /** Опциональный текст описания */
  text?: string
}

/**
 * Результат стриминга контента
 */
export interface StreamResult {
  /** Накопленный контент */
  content: string
  /** Время генерации в миллисекундах */
  generationTime: number
}

/**
 * Ошибка LLM-сервиса
 */
export class LLMError extends Error {
  constructor(
    message: string,
    public readonly provider: LLMProviderType,
    public readonly cause?: unknown
  ) {
    super(message)
    this.name = 'LLMError'
  }
}

/**
 * Интерфейс LLM-провайдера
 * Определяет контракт для всех реализаций провайдеров
 */
export interface ILLMProvider {
  /**
   * Стримит определение термина
   * @param topic - Термин для определения
   * @param language - Язык ответа
   * @returns AsyncGenerator чанков текста
   */
  streamDefinition(topic: string, language: Language): AsyncGenerator<string, void, undefined>

  /**
   * Генерирует случайное слово/концепцию
   * @param language - Язык ответа
   * @returns Случайное слово
   */
  getRandomWord(language: Language): Promise<string>

  /**
   * Генерирует ASCII-арт для термина
   * @param topic - Термин для визуализации
   * @param language - Язык запроса
   * @returns Данные ASCII-арта
   */
  generateAsciiArt(topic: string, language: Language): Promise<AsciiArtData>

  /**
   * Получает конфигурацию провайдера
   */
  getConfig(): LLMProviderConfig
}
