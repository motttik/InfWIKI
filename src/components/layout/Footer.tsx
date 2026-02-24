import React from 'react'
import { useTranslation } from 'react-i18next'
import { formatDuration } from '../../utils'
import './Footer.css'

interface FooterProps {
  generationTime: number | null
}

export const Footer: React.FC<FooterProps> = ({ generationTime }) => {
  const { t } = useTranslation()

  return (
    <footer className="app-footer">
      <p className="footer-text">
        {t('footer.author')}{' '}
        <a
          href="https://github.com/motttik"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          motttik
        </a>
        {' · '}
        {t('footer.poweredBy')}{' '}
        <span className="footer-accent">Gemini 2.5 Flash</span>
        {generationTime && (
          <>
            {' · '}
            <span className="footer-time">
              {t('footer.generatedIn')} {formatDuration(generationTime)}
            </span>
          </>
        )}
      </p>
    </footer>
  )
}
