import { useState, useEffect } from 'react'
import { useRenderer } from '@opentui/react'
import type { HighScores } from './highScores'
import type { GameMode } from './storage'

interface HighScoresScreenProps {
  highScores: HighScores
  selectedMode?: GameMode
  onBack: () => void
}

const scoreModes: { value: GameMode; label: string }[] = [
  { value: 'relaxed', label: 'Relaxed' },
  { value: 'normal', label: 'Normal' },
  { value: 'hard', label: 'Hard' },
  { value: 'insane', label: 'Insane' },
]

export function HighScoresScreen({ highScores, selectedMode: initialMode = 'relaxed', onBack }: HighScoresScreenProps) {
  const renderer = useRenderer()
  const [selectedMode, setSelectedMode] = useState<GameMode>(initialMode)
  const hasScores = Object.values(highScores).some(scores => scores && scores.length > 0)
  const currentScores = highScores[selectedMode] || []

  useEffect(() => {
    const handler = (key: any) => {
      if (key.name === 'escape') {
        onBack()
        return
      }
      const num = parseInt(key.name)
      if (num >= 1 && num <= 4) {
        const mode = scoreModes[num - 1]
        if (mode) setSelectedMode(mode.value)
        return
      }
      if (key.name === 'left') {
        const currentIndex = scoreModes.findIndex(m => m.value === selectedMode)
        const newIndex = currentIndex > 0 ? currentIndex - 1 : scoreModes.length - 1
        const newMode = scoreModes[newIndex]
        if (newMode) setSelectedMode(newMode.value)
        return
      }
      if (key.name === 'right') {
        const currentIndex = scoreModes.findIndex(m => m.value === selectedMode)
        const newIndex = currentIndex < scoreModes.length - 1 ? currentIndex + 1 : 0
        const newMode = scoreModes[newIndex]
        if (newMode) setSelectedMode(newMode.value)
      }
    }
    renderer.keyInput.on('keypress', handler)
    return () => { renderer.keyInput.off('keypress', handler) }
  }, [renderer, onBack, selectedMode])

  return (
    <box flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1} gap={2}>
      <text fg="#fff">HIGH SCORES</text>

      <box flexDirection="row" gap={2}>
        {scoreModes.map((mode, index) => (
          <box
            key={mode.value}
            paddingLeft={1}
            paddingRight={1}
            backgroundColor={mode.value === selectedMode ? '#334455' : undefined}
          >
            <text fg={mode.value === selectedMode ? '#FFFF00' : '#888'}>
              [{index + 1}] {mode.label}
            </text>
          </box>
        ))}
      </box>

      {!hasScores && (
        <text fg="#888">No high scores yet</text>
      )}

      {hasScores && currentScores.length > 0 && (
        <box flexDirection="column" gap={1}>
          <box flexDirection="row" gap={2}>
            <text fg="#888" width={6}>Rank</text>
            <text fg="#888" width={12}>UserName</text>
            <text fg="#888" width={8}>Score</text>
            <text fg="#888" width={12}>Date</text>
            <text fg="#888" width={14}>Strictness</text>
            <text fg="#888" width={16}>Extra</text>
          </box>
          {currentScores.map((score, index) => (
            <box key={index} flexDirection="row" gap={2}>
              <text fg="#fff" width={6}>{index + 1}</text>
              <text fg="#fff" width={12}>{score.username}</text>
              <text fg="#fff" width={8}>{String(score.score)}</text>
              <text fg="#fff" width={12}>{score.date}</text>
              <text fg="#fff" width={14}>{score.strictness}</text>
              <text fg="#fff" width={16}>{score.extraChallenges.length > 0 ? score.extraChallenges.join(', ') : 'None'}</text>
            </box>
          ))}
        </box>
      )}

      {hasScores && currentScores.length === 0 && (
        <text fg="#888">No high scores for {scoreModes.find(m => m.value === selectedMode)?.label} mode</text>
      )}

      <box flexDirection="row" gap={4}>
        <text fg="#555">[←→] Navigate</text>
        <text fg="#555">[Esc] Back</text>
      </box>
    </box>
  )
}
