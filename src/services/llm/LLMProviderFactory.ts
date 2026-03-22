/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ILLMProvider, LLMProviderType } from './types'
import { GeminiProvider } from './providers/gemini'
import { OllamaProvider } from './providers/ollama'
import { createProviderConfig } from './config/llmConfig'

/**
 * Фабрика LLM-провайдеров
 * Создаёт и кэширует экземпляр провайдера на основе конфигурации
 */
export class LLMProviderFactory {
  private static instance: LLMProviderFactory
  private provider: ILLMProvider | null = null
  private providerType: LLMProviderType | null = null

  private constructor() {}

  /**
   * Получает единственный экземпляр фабрики
   */
  static getInstance(): LLMProviderFactory {
    if (!LLMProviderFactory.instance) {
      LLMProviderFactory.instance = new LLMProviderFactory()
    }
    return LLMProviderFactory.instance
  }

  /**
   * Создаёт или получает кэшированный экземпляр провайдера
   * @param forceType - Принудительно указать тип провайдера (опционально)
   * @returns Экземпляр ILLMProvider
   */
  getProvider(forceType?: LLMProviderType): ILLMProvider {
    const targetType = forceType || this.resolveProviderType()

    // Возвращаем кэшированный провайдер если тип совпадает
    if (this.provider && this.providerType === targetType) {
      return this.provider
    }

    // Создаём новый провайдер
    this.provider = this.createProvider(targetType)
    this.providerType = targetType

    return this.provider
  }

  /**
   * Создаёт новый экземпляр провайдера
   * @param type - Тип провайдера
   * @returns Экземпляр ILLMProvider
   */
  createProvider(type: LLMProviderType): ILLMProvider {
    const config = createProviderConfig()

    switch (type) {
      case 'ollama':
        return new OllamaProvider(config)

      case 'gemini':
      default:
        return new GeminiProvider(config)
    }
  }

  /**
   * Определяет тип провайдера на основе конфигурации
   */
  private resolveProviderType(): LLMProviderType {
    // Проверяем environment variable
    if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_LLM_PROVIDER) {
      const provider = import.meta.env.VITE_LLM_PROVIDER.toLowerCase()
      if (provider === 'ollama') return 'ollama'
      if (provider === 'gemini') return 'gemini'
    }

    // По умолчанию используем Gemini
    return 'gemini'
  }

  /**
   * Сбрасывает кэш провайдера
   * Полезно при переключении провайдера в runtime
   */
  reset(): void {
    this.provider = null
    this.providerType = null
  }

  /**
   * Переключает провайдер на указанный тип
   * @param type - Новый тип провайдера
   * @returns Новый экземпляр провайдера
   */
  switchProvider(type: LLMProviderType): ILLMProvider {
    this.reset()
    return this.getProvider(type)
  }

  /**
   * Проверяет доступность провайдера
   * @returns Promise<boolean>
   */
  async checkAvailability(): Promise<boolean> {
    try {
      const provider = this.getProvider()
      const config = provider.getConfig()

      if (config.provider === 'ollama') {
        // Проверяем доступность Ollama сервера
        const response = await fetch(`${config.baseUrl}/api/tags`, {
          method: 'GET',
          signal: AbortSignal.timeout(config.timeout || 5000),
        })
        return response.ok
      }

      if (config.provider === 'gemini') {
        // Проверяем наличие API ключа
        return !!config.apiKey
      }

      return false
    } catch {
      return false
    }
  }
}

/**
 * Утилита для получения провайдера
 */
export const getLLMProvider = (forceType?: LLMProviderType): ILLMProvider => {
  return LLMProviderFactory.getInstance().getProvider(forceType)
}

/**
 * Утилита для переключения провайдера
 */
export const switchLLMProvider = (type: LLMProviderType): ILLMProvider => {
  return LLMProviderFactory.getInstance().switchProvider(type)
}
