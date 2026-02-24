import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the GoogleGenAI module
vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    models: {
      generateContentStream: vi.fn().mockImplementation(async function* () {
        yield { text: 'Mocked content' }
      }),
      generateContent: vi.fn().mockResolvedValue({
        text: '{"art":"mocked art"}',
      }),
    },
  })),
}))

describe('Gemini Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should have tests configured', () => {
    expect(true).toBe(true)
  })

  // TODO: Add integration tests when API key is available
  // Test cases to implement:
  // - streamDefinition generates content
  // - generateAsciiArt returns valid ASCII
  // - getRandomTopic returns a topic
  // - Error handling when API key is missing
  // - Retry logic on failures
})
