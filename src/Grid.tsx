import type { LetterState } from './wordle'

interface GridProps {
  grid: (string | null)[][]
  states: (LetterState | null)[][]
}

const colors: Record<LetterState, string> = {
  absent: '#3a3a3a',
  present: '#b59f3b',
  correct: '#538d4e',
}

export function Grid({ grid, states }: GridProps) {
  return (
    <box flexDirection="column" gap={1} alignItems="center">
      {grid.map((row, rowIdx) => (
        <box key={rowIdx} flexDirection="row" gap={1}>
          {row.map((letter, colIdx) => {
            const state = states[rowIdx]?.[colIdx]
            const bg = state ? colors[state] : undefined
            return (
              <box
                key={colIdx}
                width={5}
                height={3}
                justifyContent="center"
                alignItems="center"
                backgroundColor={bg}
                style={{ border: true }}
              >
                <text>{letter || ''}</text>
              </box>
            )
          })}
        </box>
      ))}
    </box>
  )
}
