export interface WikiArticle {
  topic: string
  content: string
  timestamp: number
  source?: 'gemini' | 'wikipedia' | 'manual'
}

export interface NavigationHistoryItem {
  topic: string
  timestamp: number
  content?: string
}

export interface Bookmark {
  id: string
  topic: string
  addedAt: number
  content?: string
  tags?: string[]
}

export interface AsciiArtData {
  art: string
  color?: string
}

export type Theme = 'light' | 'dark' | 'cyberpunk'

export type Language = 'ru' | 'en'

export interface AppState {
  currentTopic: string
  content: string
  isLoading: boolean
  error: string | null
  asciiArt: AsciiArtData | null
  generationTime: number | null
  history: NavigationHistoryItem[]
  historyIndex: number
  bookmarks: Bookmark[]
  theme: Theme
  language: Language
  showAscii: boolean
  fontSize: 'normal' | 'large'
}

export interface WikiServiceConfig {
  apiKey: string
  language?: Language
  maxRetries?: number
  timeout?: number
}

export interface StreamChunk {
  type: 'content' | 'error' | 'done'
  data: string
}
