export interface PDFExportOptions {
  title: string
  content: string
  author?: string
  includeAsciiArt?: boolean
  includeMetadata?: boolean
  language?: 'ru' | 'en'
}

export function exportToPDF(options: PDFExportOptions): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      const {
        title,
        content,
        author = 'InfWIKI',
        includeAsciiArt = true,
        includeMetadata = true,
        language = 'ru',
      } = options

      // Создаем HTML для печати
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        reject(new Error('Failed to open print window'))
        return
      }

      const metadata = includeMetadata
        ? `
        <div class="metadata">
          <p><strong>${language === 'ru' ? 'Сгенерировано:' : 'Generated:'}</strong> ${new Date().toLocaleDateString(language)}</p>
          <p><strong>${language === 'ru' ? 'Источник:' : 'Source:'}</strong> InfWIKI AI</p>
          <p><strong>${language === 'ru' ? 'Автор:' : 'Author:'}</strong> ${author}</p>
        </div>
      `
        : ''

      const html = `
        <!DOCTYPE html>
        <html lang="${language}">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title} - InfWIKI</title>
          <style>
            @page {
              margin: 2cm;
              size: A4;
            }
            
            @media print {
              body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }
              
              .no-print {
                display: none !important;
              }
              
              .page-break {
                page-break-before: always;
              }
            }
            
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Georgia', 'Times New Roman', serif;
              font-size: 12pt;
              line-height: 1.6;
              color: #1a1a2e;
              background: #fff;
              padding: 2cm;
            }
            
            .header {
              text-align: center;
              margin-bottom: 2rem;
              padding-bottom: 1rem;
              border-bottom: 3px solid #667eea;
            }
            
            .header h1 {
              font-size: 24pt;
              font-weight: bold;
              color: #667eea;
              margin-bottom: 0.5rem;
            }
            
            .header .subtitle {
              font-size: 10pt;
              color: #666;
              font-style: italic;
            }
            
            .ascii-art {
              font-family: 'Courier New', monospace;
              font-size: 8pt;
              white-space: pre;
              text-align: center;
              margin: 1.5rem 0;
              padding: 1rem;
              background: #f5f5f5;
              border-radius: 8px;
              overflow-x: auto;
            }
            
            .content {
              text-align: justify;
              margin: 1.5rem 0;
            }
            
            .content p {
              margin-bottom: 1rem;
            }
            
            .metadata {
              margin-top: 3rem;
              padding-top: 1rem;
              border-top: 1px solid #ddd;
              font-size: 9pt;
              color: #666;
            }
            
            .footer {
              position: fixed;
              bottom: 0;
              left: 0;
              right: 0;
              text-align: center;
              font-size: 8pt;
              color: #999;
              padding: 1cm;
            }
            
            .interactive-word {
              color: #667eea;
              text-decoration: underline;
            }
            
            h1, h2, h3, h4, h5, h6 {
              font-family: 'Arial', sans-serif;
              color: #1a1a2e;
              margin-top: 1.5rem;
              margin-bottom: 0.5rem;
            }
            
            a {
              color: #667eea;
              text-decoration: none;
            }
            
            a:hover {
              text-decoration: underline;
            }
            
            .print-button {
              position: fixed;
              top: 20px;
              right: 20px;
              padding: 10px 20px;
              background: #667eea;
              color: white;
              border: none;
              border-radius: 8px;
              cursor: pointer;
              font-size: 14px;
              font-weight: bold;
              box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
            }
            
            .print-button:hover {
              background: #5568d3;
            }
          </style>
        </head>
        <body>
          <button class="print-button no-print" onclick="window.print()">
            ${language === 'ru' ? '📄 Печать / Сохранить в PDF' : '📄 Print / Save as PDF'}
          </button>
          
          <div class="header">
            <h1>${escapeHtml(title)}</h1>
            <div class="subtitle">InfWIKI — ${language === 'ru' ? 'Бесконечная Энциклопедия' : 'Infinite Encyclopedia'}</div>
          </div>
          
          ${includeAsciiArt ? '<div class="ascii-art" id="ascii-art"></div>' : ''}
          
          <div class="content" id="content">
            ${formatContent(content)}
          </div>
          
          ${metadata}
          
          <div class="footer">
            ${language === 'ru' ? 'Сгенерировано InfWIKI AI' : 'Generated by InfWIKI AI'} • ${new Date().toLocaleDateString(language)}
          </div>
          
          <script>
            // Автоматическая печать после загрузки
            window.onload = function() {
              // Можно автоматически вызвать print(), но лучше дать пользователю выбор
              console.log('Document ready for print');
            };
          </script>
        </body>
        </html>
      `

      printWindow.document.write(html)
      printWindow.document.close()

      // Создаем blob с HTML для сохранения
      const blob = new Blob([html], { type: 'text/html' })
      resolve(blob)
    } catch (error) {
      reject(error)
    }
  })
}

function escapeHtml(text: string): string {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

function formatContent(content: string): string {
  // Базовое форматирование контента
  return content
    .split('\n')
    .map((paragraph) => `<p>${paragraph.trim()}</p>`)
    .join('')
}

export async function downloadPDF(
  options: PDFExportOptions,
  filename?: string
): Promise<void> {
  const blob = await exportToPDF(options)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename || `${options.title.replace(/[^a-zа-яё0-9]/gi, '_')}.pdf`
  link.click()
  URL.revokeObjectURL(url)
}

export function printPDF(options: PDFExportOptions): void {
  exportToPDF(options).then(() => {
    // Печать будет вызвана через кнопку в открывшемся окне
  })
}
