import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import './ContentDisplay.css'

interface ContentDisplayProps {
  content: string
  isLoading: boolean
  onWordClick: (word: string) => void
}

export const ContentDisplay: React.FC<ContentDisplayProps> = ({
  content,
  isLoading,
  onWordClick,
}) => {
  const { t } = useTranslation()

  const processedContent = useMemo(() => {
    const words = content.split(/(\s+)/)
    return words.map((word, index) => {
      const cleanWord = word.trim().replace(/[.,!?;:()[\]{}]/g, '')
      if (cleanWord.length > 2 && !/^\d+$/.test(cleanWord)) {
        return (
          <span
            key={index}
            className="interactive-word"
            onClick={() => onWordClick(cleanWord)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onWordClick(cleanWord)
              }
            }}
            aria-label={`${t('words.clickToExplore')}: ${cleanWord}`}
          >
            {word}
          </span>
        )
      }
      return <span key={index}>{word}</span>
    })
  }, [content, onWordClick, t])

  return (
    <div className={`content-display ${isLoading ? 'loading' : ''}`}>
      <div className="content-text">{processedContent}</div>
      {isLoading && (
        <span className="blinking-cursor" aria-hidden="true">
          ▋
        </span>
      )}
    </div>
  )
}
