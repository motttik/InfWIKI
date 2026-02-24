import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../ui/Button'
import './Header.css'

interface HeaderProps {
  canGoBack: boolean
  canGoForward: boolean
  isBookmarked: boolean
  onBack: () => void
  onForward: () => void
  onToggleBookmark: () => void
  onToggleTheme: () => void
  onToggleLanguage: () => void
  theme: string
  language: string
}

export const Header: React.FC<HeaderProps> = ({
  canGoBack,
  canGoForward,
  isBookmarked,
  onBack,
  onForward,
  onToggleBookmark,
  onToggleTheme,
  onToggleLanguage,
  theme,
  language,
}) => {
  const { t } = useTranslation()

  return (
    <header className="app-header">
      <div className="header-left">
        <Button
          variant="icon"
          onClick={onBack}
          disabled={!canGoBack}
          aria-label={t('navigation.back')}
          title={t('navigation.back')}
        >
          ←
        </Button>
        <Button
          variant="icon"
          onClick={onForward}
          disabled={!canGoForward}
          aria-label={t('navigation.forward')}
          title={t('navigation.forward')}
        >
          →
        </Button>
        <Button
          variant="icon"
          onClick={onToggleBookmark}
          aria-label={
            isBookmarked ? t('bookmarks.remove') : t('bookmarks.add')
          }
          title={isBookmarked ? t('bookmarks.remove') : t('bookmarks.add')}
        >
          {isBookmarked ? '★' : '☆'}
        </Button>
      </div>

      <div className="header-center">
        <h1 className="app-title">INFINITE WIKI</h1>
      </div>

      <div className="header-right">
        <Button
          variant="icon"
          onClick={onToggleLanguage}
          aria-label={`Switch to ${language === 'ru' ? 'English' : 'Русский'}`}
          title={`Switch to ${language === 'ru' ? 'English' : 'Русский'}`}
          className="language-button"
        >
          {language.toUpperCase()}
        </Button>
        <Button
          variant="icon"
          onClick={onToggleTheme}
          aria-label={t('settings.theme')}
          title={t('settings.theme')}
        >
          {theme === 'light' ? '☀️' : theme === 'dark' ? '🌙' : '🎨'}
        </Button>
      </div>
    </header>
  )
}
