import React from 'react'
import { useTranslation } from 'react-i18next'
import { useStatistics } from '../../hooks/useStatistics'
import './StatisticsPanel.css'

export const StatisticsPanel: React.FC = () => {
  const { t } = useTranslation()
  const { stats, getSessionDuration } = useStatistics()

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const hours = Math.floor(minutes / 60)
    if (hours > 0) {
      return `${hours}ч ${minutes % 60}мин`
    }
    return `${minutes}мин`
  }

  return (
    <div className="statistics-panel">
      <h3>📊 {t('settings.title')}</h3>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👁️</div>
          <div className="stat-value">{stats.totalViews}</div>
          <div className="stat-label">Просмотров</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔍</div>
          <div className="stat-value">{stats.totalSearches}</div>
          <div className="stat-label">Поисков</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-value">{stats.totalBookmarks}</div>
          <div className="stat-label">Избранных</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-value">{stats.streak}</div>
          <div className="stat-label">Дней подряд</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-value">{stats.totalTopicsViewed}</div>
          <div className="stat-label">Тем просмотрено</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div className="stat-value">{formatTime(getSessionDuration())}</div>
          <div className="stat-label">В сессии</div>
        </div>
      </div>

      {stats.favoriteTopics.length > 0 && (
        <div className="favorite-topics">
          <h4>🔥 Популярные темы:</h4>
          <div className="topics-list">
            {stats.favoriteTopics.slice(0, 5).map((topic) => (
              <span key={topic} className="topic-tag">
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
