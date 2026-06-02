import type { GameMode } from './storage'

interface WinOverlayProps {
  mode?: GameMode
  totalScore: number
  scoreEarned: number
  streak: number
  hiddenWord: string
  timeBonus?: number
  onPlayAgain?: () => void
  onHighScores?: () => void
  onQuit?: () => void
}

export function WinOverlay({ mode, scoreEarned, streak, totalScore, hiddenWord, timeBonus, onPlayAgain, onHighScores, onQuit }: WinOverlayProps) {
  const formatTime = (seconds: number) => {
    if (seconds >= 60) {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return secs === 0 ? `${mins}:00` : `${mins}:${secs.toString().padStart(2, '0')}`
    }
    return `${seconds}s`
  }

  if (mode === 'zen') {
    return (
      <box flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1} gap={1}>
        <text fg="#538d4e">Beautifully Solved</text>
        <text>The word was: {hiddenWord}</text>
        <text fg="#888">[P] Play Again</text>
        <text fg="#888">[H] High Scores</text>
        <text fg="#888">[Esc] Quit</text>
      </box>
    )
  }

  return (
    <box flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1} gap={1}>
      <text fg="#538d4e">Correct!</text>
      <text>+{scoreEarned} points</text>
      <text>Streak: {streak}</text>
      <text>Total Score: {totalScore}</text>
      <text fg="#b59f3b">{`+${formatTime(timeBonus ?? 0)} time bonus`}</text>
    </box>
  )
}
