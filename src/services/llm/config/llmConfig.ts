/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { LLMProviderConfig, LLMProviderType } from '../types'

/**
 * Конфигурация по умолчанию для Google Gemini
 */
export const GEMINI_DEFAULT_CONFIG: LLMProviderConfig = {
  provider: 'gemini',
  textModel: 'gemini-2.5-flash-lite',
  artModel: 'gemini-2.5-flash',
  timeout: 30000,
  maxRetries: 3,
}

/**
 * Конфигурация по умолчанию для Ollama
 */
export const OLLAMA_DEFAULT_CONFIG: LLMProviderConfig = {
  provider: 'ollama',
  baseUrl: 'http://localhost:11434',
  textModel: 'llama3.2',
  artModel: 'llama3.2',
  timeout: 60000,
  maxRetries: 3,
}

/**
 * Получает API ключ из environment variables
 */
export const getGeminiApiKey = (): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GEMINI_API_KEY) {
    return import.meta.env.VITE_GEMINI_API_KEY
  }
  if (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY
  }
  return ''
}

/**
 * Получает URL Ollama из environment variables
 */
export const getOllamaBaseUrl = (): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_OLLAMA_BASE_URL) {
    return import.meta.env.VITE_OLLAMA_BASE_URL
  }
  return OLLAMA_DEFAULT_CONFIG.baseUrl!
}

/**
 * Получает текущий тип провайдера из environment variables
 */
export const getCurrentProvider = (): LLMProviderType => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_LLM_PROVIDER) {
    const provider = import.meta.env.VITE_LLM_PROVIDER.toLowerCase()
    if (provider === 'ollama') return 'ollama'
    if (provider === 'gemini') return 'gemini'
  }
  // По умолчанию используем Gemini
  return 'gemini'
}

/**
 * Создаёт конфигурацию для текущего провайдера
 */
export const createProviderConfig = (): LLMProviderConfig => {
  const provider = getCurrentProvider()

  switch (provider) {
    case 'ollama':
      return {
        ...OLLAMA_DEFAULT_CONFIG,
        provider: 'ollama',
        baseUrl: getOllamaBaseUrl(),
      }

    case 'gemini':
    default:
      return {
        ...GEMINI_DEFAULT_CONFIG,
        provider: 'gemini',
        apiKey: getGeminiApiKey(),
      }
  }
}

/**
 * Проверяет, настроен ли провайдер
 */
export const isProviderConfigured = (config: LLMProviderConfig): boolean => {
  if (config.provider === 'gemini') {
    return !!config.apiKey
  }
  if (config.provider === 'ollama') {
    // Ollama локальный, проверяем URL
    return !!config.baseUrl
  }
  return false
}
