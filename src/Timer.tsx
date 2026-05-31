interface TimerProps {
  timeRemaining: number
  streak: number
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function Timer({ timeRemaining, streak }: TimerProps) {
  return (
    <box flexDirection="row" gap={2}>
      <text>{formatTime(timeRemaining)}</text>
      {streak > 0 && <text>🔥 {streak}</text>}
    </box>
  )
}
