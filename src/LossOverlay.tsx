import type { GameMode } from './storage'

interface LossOverlayProps {
  mode?: GameMode
  totalScore: number
  streak: number
  hiddenWord: string
  onPlayAgain: () => void
  onHighScores: () => void
  onQuit: () => void
}

export function LossOverlay({ mode, totalScore, streak, hiddenWord, onPlayAgain, onHighScores, onQuit }: LossOverlayProps) {
  if (mode === 'zen') {
    return (
      <box flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1} gap={1}>
        <text fg="#ff6b6b">Game Over!</text>
        <text>The word was: {hiddenWord}</text>
        <box flexDirection="row" gap={4}>
          <text fg="#888">[P] Play Again</text>
          <text fg="#888">[H] High Scores</text>
          <text fg="#888">[Esc] Quit</text>
        </box>
      </box>
    )
  }

  return (
    <box flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1} gap={1}>
      <text fg="#ff6b6b">Game Over!</text>
      <text>The word was: {hiddenWord}</text>
      <text>Final Score: {totalScore}</text>
      <text>Streak: {streak}</text>
      <box flexDirection="row" gap={4}>
        <text fg="#888">[P] Play Again</text>
        <text fg="#888">[H] High Scores</text>
        <text fg="#888">[Esc] Quit</text>
      </box>
    </box>
  )
}
