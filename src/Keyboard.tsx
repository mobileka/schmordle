import type { LetterState } from './wordle'

interface KeyboardProps {
  letterStates: Map<string, LetterState>
}

const colors: Record<LetterState, string> = {
  absent: '#3a3a3a',
  present: '#b59f3b',
  correct: '#538d4e',
}

const rows = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
]

export function Keyboard({ letterStates }: KeyboardProps) {
  return (
    <box flexDirection="column" gap={1} alignItems="center">
      {rows.map((row, rowIdx) => (
        <box key={rowIdx} flexDirection="row" gap={1}>
          {row.map((letter) => {
            const state = letterStates.get(letter)
            const bg = state ? colors[state] : undefined
            return (
              <box
                key={letter}
                width={3}
                height={1}
                justifyContent="center"
                alignItems="center"
                backgroundColor={bg}
              >
                <text>{letter}</text>
              </box>
            )
          })}
        </box>
      ))}
    </box>
  )
}
