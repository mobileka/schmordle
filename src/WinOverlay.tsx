interface WinOverlayProps {
  scoreEarned: number
  streak: number
}

export function WinOverlay({ scoreEarned, streak }: WinOverlayProps) {
  return (
    <box flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1} gap={1}>
      <text fg="#538d4e">Correct!</text>
      <text>+{scoreEarned} points</text>
      <text>Streak: {streak}</text>
      <text fg="#b59f3b">+1:00 time bonus</text>
    </box>
  )
}
