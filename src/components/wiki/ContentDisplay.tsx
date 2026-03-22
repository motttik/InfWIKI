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
    // Разбиваем на слова и пробелы, сохраняя всё
    const words = content.split(/(\s+)/)
    return words.map((word, index) => {
      // Очищаем слово от знаков препинания для клика
      const cleanWord = word.trim().replace(/[.,!?;:()[\]{}"«»]/g, '')
      
      // Делаем кликабельными ВСЕ слова (кроме пробелов и пустых строк)
      if (cleanWord.length > 0 && !/^\s*$/.test(word)) {
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
            title={`Клик: ${cleanWord}`}
          >
            {word}
          </span>
        )
      }
      // Возвращаем пробелы как есть
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
