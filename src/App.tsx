/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react'
import { useTranslation } from 'react-i18next'
import { useWiki } from './hooks/useWiki'
import { useTheme } from './hooks/useTheme'
import { useLanguage } from './hooks/useLanguage'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { SearchBar } from './components/wiki/SearchBar'
import { AsciiArtDisplay } from './components/wiki/AsciiArtDisplay'
import { ContentDisplay } from './components/wiki/ContentDisplay'
import { LoadingSkeleton } from './components/wiki/LoadingSkeleton'
import './App.css'

const App: React.FC = () => {
  const { t } = useTranslation()
  const [theme, setTheme] = useTheme()
  const { language, toggleLanguage } = useLanguage()
  const {
    currentTopic,
    content,
    isLoading,
    error,
    asciiArt,
    generationTime,
    handleTopicChange,
    handleRandom,
    handleBack,
    handleForward,
    handleToggleBookmark,
    canGoBack,
    canGoForward,
    isBookmarked,
  } = useWiki({ initialTopic: 'Гармония', language })

  return (
    <div className={`app app--${theme}`} data-theme={theme}>
      <Header
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        isBookmarked={isBookmarked}
        onBack={handleBack}
        onForward={handleForward}
        onToggleBookmark={handleToggleBookmark}
        onToggleTheme={() => {
          const themes = ['light', 'dark', 'cyberpunk'] as const
          const currentIndex = themes.indexOf(theme)
          const nextTheme = themes[(currentIndex + 1) % themes.length]
          setTheme(nextTheme)
        }}
        onToggleLanguage={toggleLanguage}
        theme={theme}
        language={language}
      />

      <main className="app-main">
        <SearchBar
          onSearch={handleTopicChange}
          onRandom={handleRandom}
          isLoading={isLoading}
        />

        <section className="content-section">
          <h2 className="topic-title">{currentTopic}</h2>

          <AsciiArtDisplay artData={asciiArt} topic={currentTopic} />

          {error && (
            <div className="error-message" role="alert">
              <p className="error-title">⚠️ {t('error.title')}</p>
              <p className="error-details">{error}</p>
              <button 
                className="btn btn-primary" 
                onClick={handleRandom}
                style={{ marginTop: '1rem', padding: '0.75rem 1.5rem' }}
              >
                {t('search.random')}
              </button>
            </div>
          )}

          {isLoading && content.length === 0 && !error && (
            <LoadingSkeleton />
          )}

          {content.length > 0 && !error && (
            <ContentDisplay
              content={content}
              isLoading={isLoading}
              onWordClick={handleTopicChange}
            />
          )}

          {!isLoading && !error && content.length === 0 && (
            <div className="no-content">
              <p>{t('error.noContent')}</p>
            </div>
          )}
        </section>
      </main>

      <Footer generationTime={generationTime} />
    </div>
  )
}

export default App
