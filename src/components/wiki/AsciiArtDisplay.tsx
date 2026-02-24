import React from 'react'
import type { AsciiArtData } from '../../types'
import './AsciiArtDisplay.css'

interface AsciiArtDisplayProps {
  artData: AsciiArtData | null
  topic: string
}

export const AsciiArtDisplay: React.FC<AsciiArtDisplayProps> = ({
  artData,
  topic,
}) => {
  if (!artData) {
    return (
      <div className="ascii-art-container">
        <div className="ascii-art-placeholder" />
      </div>
    )
  }

  return (
    <div className="ascii-art-container">
      <pre className="ascii-art" aria-label={`ASCII art for ${topic}`}>
        {artData.art}
      </pre>
    </div>
  )
}
