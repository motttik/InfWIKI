/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from '@google/genai'
import type { Language } from '../types'

if (!import.meta.env.VITE_GEMINI_API_KEY && !process.env.GEMINI_API_KEY) {
  console.warn(
    'GEMINI_API_KEY environment variable is not set. The application will not be able to connect to the Gemini API.'
  )
}

const getApiKey = (): string => {
  return import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || ''
}

const ai = new GoogleGenAI({ apiKey: getApiKey() })
const artModelName = 'gemini-2.5-flash'
const textModelName = 'gemini-2.5-flash-lite'
const ENABLE_THINKING_FOR_ASCII_ART = false

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

export interface AsciiArtData {
  art: string;
  text?: string;
}

export async function* streamDefinition(
  topic: string,
  language: Language = 'en'
): AsyncGenerator<string, void, undefined> {
  const apiKey = getApiKey()
  if (!apiKey) {
    yield 'Error: GEMINI_API_KEY не настроен. Проверьте .env файл или используйте демо-режим.'
    return
  }

  // Усиленный промпт с явным указанием языка
  const promptRu = `Дай краткое, энциклопедическое определение термина "${topic}". Будь информативным и нейтральным. ОТВЕЧАЙ СТРОГО НА РУССКОМ ЯЗЫКЕ. Не используй markdown, заголовки или специальное форматирование. Ответь только текстом определения. НЕ ИСПОЛЬЗУЙ АНГЛИЙСКИЕ СЛОВА.`
  const promptEn = `Provide a concise, encyclopedia-style definition for the term: "${topic}". Be informative and neutral. Respond ONLY in English. Do not use markdown, titles, or special formatting. Respond with only the definition text. NO RUSSIAN WORDS.`

  const prompt = language === 'ru' ? promptRu : promptEn

  try {
    const response = await ai.models.generateContentStream({
      model: textModelName,
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
    // Не выбрасываем ошибку после yield — это вызывает unhandled promise rejection
  }
}

export async function getRandomWord(language: Language = 'en'): Promise<string> {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured.')
  }

  const promptRu = `Назови одно случайное интересное русское слово или концепцию из двух слов. Только само слово, без лишнего текста.`
  const promptEn = `Generate a single, random, interesting English word or two-word concept. Only the word itself, no extra text.`

  const prompt = language === 'ru' ? promptRu : promptEn

  try {
    const response = await ai.models.generateContent({
      model: textModelName,
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

export async function generateAsciiArt(topic: string, _language: Language = 'en'): Promise<AsciiArtData> {
  const apiKey = getApiKey()
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured.')
  }

  const artPromptPart = `1. "art": meta ASCII visualization of the word "${topic}":
  - Palette: │─┌┐└┘├┤┬┴┼►◄▲▼○●◐◑░▒▓█▀▄■□▪▫★☆♦♠♣♥⟨⟩/\\_|
  - Shape mirrors concept - make the visual form embody the word's essence
  - Examples:
    * "explosion" → radiating lines from center
    * "hierarchy" → pyramid structure
    * "flow" → curved directional lines
  - Return as single string with \\n for line breaks`

  const keysDescription = `one key: "art"`
  const promptBody = artPromptPart

  const prompt = `For "${topic}", create a JSON object with ${keysDescription}.
${promptBody}

Return ONLY the raw JSON object, no additional text. The response must start with "{" and end with "}" and contain only the art property.`

  const maxRetries = 1
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const config: { responseMimeType: string; thinkingConfig?: { thinkingBudget: number } } = {
        responseMimeType: 'application/json',
      }
      if (!ENABLE_THINKING_FOR_ASCII_ART) {
        config.thinkingConfig = { thinkingBudget: 0 }
      }

      const response = await ai.models.generateContent({
        model: artModelName,
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

      return {
        art: parsedData.art,
      }
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
