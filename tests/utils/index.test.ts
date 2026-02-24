import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  saveToStorage,
  loadFromStorage,
  formatDuration,
  debounce,
  throttle,
  generateId,
} from '@/utils'

describe('Utils', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('saveToStorage & loadFromStorage', () => {
    it('saves and loads data correctly', () => {
      const testData = { key: 'value', number: 42 }
      saveToStorage('test', testData)
      const loaded = loadFromStorage('test', null)
      expect(loaded).toEqual(testData)
    })

    it('returns default value when key does not exist', () => {
      const defaultValue = { default: true }
      const loaded = loadFromStorage('nonexistent', defaultValue)
      expect(loaded).toEqual(defaultValue)
    })

    it('handles errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('Storage full')
      })

      expect(() => saveToStorage('test', {})).not.toThrow()
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('formatDuration', () => {
    it('formats milliseconds', () => {
      expect(formatDuration(500)).toMatch(/\d+ms/)
    })

    it('formats seconds', () => {
      expect(formatDuration(5000)).toBe('5.0s')
    })

    it('formats minutes', () => {
      expect(formatDuration(120000)).toBe('2.0min')
    })
  })

  describe('debounce', () => {
    it('delays function execution', async () => {
      const fn = vi.fn()
      const debouncedFn = debounce(fn, 100)

      debouncedFn()
      expect(fn).not.toHaveBeenCalled()

      await new Promise((resolve) => setTimeout(resolve, 150))
      expect(fn).toHaveBeenCalledTimes(1)
    })

    it('cancels previous calls', async () => {
      const fn = vi.fn()
      const debouncedFn = debounce(fn, 100)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      await new Promise((resolve) => setTimeout(resolve, 150))
      expect(fn).toHaveBeenCalledTimes(1)
    })
  })

  describe('throttle', () => {
    it('limits function execution rate', () => {
      const fn = vi.fn()
      const throttledFn = throttle(fn, 100)

      throttledFn()
      throttledFn()
      throttledFn()

      expect(fn).toHaveBeenCalledTimes(1)
    })
  })

  describe('generateId', () => {
    it('generates unique IDs', () => {
      const id1 = generateId()
      const id2 = generateId()
      expect(id1).not.toBe(id2)
    })

    it('includes timestamp', () => {
      const id = generateId()
      const timestamp = id.split('-')[0]
      expect(parseInt(timestamp)).toBeGreaterThan(Date.now() - 1000)
    })
  })
})
