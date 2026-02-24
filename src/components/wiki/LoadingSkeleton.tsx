import React from 'react'
import { useTranslation } from 'react-i18next'
import './LoadingSkeleton.css'

export const LoadingSkeleton: React.FC = () => {
  const { t } = useTranslation()

  return (
    <div className="loading-skeleton" aria-label={t('loading.generating')}>
      <div className="skeleton-line skeleton-line-1" />
      <div className="skeleton-line skeleton-line-2" />
      <div className="skeleton-line skeleton-line-3" />
      <div className="skeleton-line skeleton-line-4" />
      <div className="skeleton-text">{t('loading.generating')}</div>
    </div>
  )
}
