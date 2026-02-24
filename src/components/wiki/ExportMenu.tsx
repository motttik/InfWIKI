import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../ui/Button'
import { downloadPDF } from '../../services/pdfExport'
import { copyToClipboard, exportToMarkdown } from '../../utils'
import './ExportMenu.css'

interface ExportMenuProps {
  topic: string
  content: string
  onExportComplete?: () => void
}

export const ExportMenu: React.FC<ExportMenuProps> = ({
  topic,
  content,
  onExportComplete,
}) => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const handleMarkdownExport = async () => {
    setIsExporting(true)
    try {
      exportToMarkdown(topic, content)
      onExportComplete?.()
    } catch (error) {
      console.error('Markdown export failed:', error)
    } finally {
      setIsExporting(false)
      setIsOpen(false)
    }
  }

  const handlePDFExport = async () => {
    setIsExporting(true)
    try {
      await downloadPDF(
        {
          title: topic,
          content,
          language: t('search.placeholder').includes('Введите') ? 'ru' : 'en',
        },
        `${topic}.pdf`
      )
      onExportComplete?.()
    } catch (error) {
      console.error('PDF export failed:', error)
    } finally {
      setIsExporting(false)
      setIsOpen(false)
    }
  }

  const handleCopyToClipboard = async () => {
    setIsExporting(true)
    try {
      const success = await copyToClipboard(`${topic}\n\n${content}`)
      if (success) {
        alert(t('export.copied'))
      }
      onExportComplete?.()
    } catch (error) {
      console.error('Copy to clipboard failed:', error)
    } finally {
      setIsExporting(false)
      setIsOpen(false)
    }
  }

  return (
    <div className="export-menu">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
      >
        📤 {t('export.title')}
      </Button>

      {isOpen && (
        <div className="export-dropdown">
          <button onClick={handleMarkdownExport} disabled={isExporting}>
            📝 {t('export.markdown')}
          </button>
          <button onClick={handlePDFExport} disabled={isExporting}>
            📄 {t('export.pdf')}
          </button>
          <button onClick={handleCopyToClipboard} disabled={isExporting}>
            📋 {t('export.copy')}
          </button>
        </div>
      )}
    </div>
  )
}
