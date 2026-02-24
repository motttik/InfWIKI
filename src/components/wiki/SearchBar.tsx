import React, { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { useVoiceInput } from '../../hooks/useVoiceInput'
import './SearchBar.css'

interface SearchBarProps {
  onSearch: (query: string) => void
  onRandom: () => void
  isLoading?: boolean
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onRandom,
  isLoading = false,
}) => {
  const { t } = useTranslation()
  const [query, setQuery] = useState('')

  const handleVoiceTranscript = useCallback((transcript: string) => {
    setQuery(transcript)
    onSearch(transcript)
  }, [onSearch])

  const { isListening, startListening, stopListening, isSupported } = useVoiceInput(
    t('search.placeholder').includes('Введите') ? 'ru-RU' : 'en-US',
    handleVoiceTranscript
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (query.trim()) {
        onSearch(query.trim())
        setQuery('')
      }
    },
    [query, onSearch]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(e.target.value)
    },
    []
  )

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="search-form">
        <Input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={t('search.placeholder')}
          disabled={isLoading}
          aria-label={t('search.placeholder')}
        />
      </form>
      
      <div className="search-buttons">
        {isSupported && (
          <Button
            variant="icon"
            onClick={isListening ? stopListening : startListening}
            disabled={isLoading}
            aria-label="Голосовой ввод"
            className={`voice-button ${isListening ? 'listening' : ''}`}
            title="Голосовой ввод"
          >
            🎤
          </Button>
        )}
        
        <Button
          variant="ghost"
          onClick={onRandom}
          disabled={isLoading}
          aria-label={t('search.random')}
          className="random-button"
        >
          {t('search.random')}
        </Button>
      </div>
    </div>
  )
}
