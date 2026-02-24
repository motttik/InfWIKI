import { useState, useCallback } from 'react'
import { loadFromStorage } from '../utils'

export interface Tag {
  id: string
  name: string
  color: string
  count: number
}

export interface Category {
  id: string
  name: string
  nameRu: string
  icon: string
  topicCount: number
}

const TAGS_STORAGE_KEY = 'infwiki_tags'
const CATEGORIES_STORAGE_KEY = 'infwiki_categories'

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'science', name: 'Science', nameRu: 'Наука', icon: '🔬', topicCount: 0 },
  { id: 'technology', name: 'Technology', nameRu: 'Технологии', icon: '💻', topicCount: 0 },
  { id: 'history', name: 'History', nameRu: 'История', icon: '📜', topicCount: 0 },
  { id: 'culture', name: 'Culture', nameRu: 'Культура', icon: '🎨', topicCount: 0 },
  { id: 'philosophy', name: 'Philosophy', nameRu: 'Философия', icon: '🤔', topicCount: 0 },
  { id: 'nature', name: 'Nature', nameRu: 'Природа', icon: '🌿', topicCount: 0 },
  { id: 'space', name: 'Space', nameRu: 'Космос', icon: '🚀', topicCount: 0 },
  { id: 'math', name: 'Mathematics', nameRu: 'Математика', icon: '📐', topicCount: 0 },
]

const TOPIC_CATEGORIES: Record<string, string> = {
  'Баланс': 'philosophy', 'Гармония': 'philosophy', 'Диссонанс': 'philosophy',
  'Квант': 'science', 'Энтропия': 'science', 'Гравитация': 'science',
  'Спираль': 'math', 'Фрактал': 'math', 'Вихрь': 'nature',
  'Технология': 'technology', 'Интернет': 'technology',
  'История': 'history', 'Война': 'history', 'Революция': 'history',
  'Искусство': 'culture', 'Музыка': 'culture', 'Литература': 'culture',
  'Космос': 'space', 'Звезда': 'space', 'Галактика': 'space',
  'Дерево': 'nature', 'Океан': 'nature', 'Гора': 'nature',
}

export function useTagsAndCategories() {
  const [tags, setTags] = useState<Tag[]>(() =>
    loadFromStorage<Tag[]>(TAGS_STORAGE_KEY, [])
  )
  const [categories, setCategories] = useState<Category[]>(() =>
    loadFromStorage<Category[]>(CATEGORIES_STORAGE_KEY, DEFAULT_CATEGORIES)
  )

  const getCategoryForTopic = useCallback((topic: string): Category | null => {
    const categoryId = TOPIC_CATEGORIES[topic] ||
      Object.entries(TOPIC_CATEGORIES).find(([key]) =>
        topic.toLowerCase().includes(key.toLowerCase())
      )?.[1]

    if (!categoryId) return null
    return categories.find((c) => c.id === categoryId) || null
  }, [categories])

  const addTag = useCallback((name: string, color: string = '#667eea') => {
    setTags((prev) => {
      const existing = prev.find((t) => t.name.toLowerCase() === name.toLowerCase())
      if (existing) {
        return prev.map((t) =>
          t.id === existing.id ? { ...t, count: t.count + 1 } : t
        )
      }

      const newTag: Tag = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name,
        color,
        count: 1,
      }
      return [newTag, ...prev]
    })
  }, [])

  const removeTag = useCallback((tagId: string) => {
    setTags((prev) => prev.filter((t) => t.id !== tagId))
  }, [])

  const updateCategoryCount = useCallback((categoryId: string, delta: number = 1) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId ? { ...c, topicCount: c.topicCount + delta } : c
      )
    )
  }, [])

  const getTopicsByCategory = useCallback((categoryId: string, topics: string[]) => {
    return topics.filter((topic) => {
      const category = getCategoryForTopic(topic)
      return category?.id === categoryId
    })
  }, [getCategoryForTopic])

  const searchByCategory = useCallback((categoryId: string, allTopics: string[]) => {
    return getTopicsByCategory(categoryId, allTopics)
  }, [getTopicsByCategory])

  return {
    tags,
    categories,
    addTag,
    removeTag,
    getCategoryForTopic,
    updateCategoryCount,
    getTopicsByCategory,
    searchByCategory,
  }
}
