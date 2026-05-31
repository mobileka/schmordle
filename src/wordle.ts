export type LetterState = 'absent' | 'present' | 'correct'

export function evaluateGuess(guess: string, hiddenWord: string): LetterState[] {
  const result: LetterState[] = Array(5).fill('absent')
  const hiddenLetters = hiddenWord.split('')
  const guessLetters = guess.split('')
  const used = Array(5).fill(false)

  for (let i = 0; i < 5; i++) {
    if (guessLetters[i] === hiddenLetters[i]) {
      result[i] = 'correct'
      used[i] = true
    }
  }

  for (let i = 0; i < 5; i++) {
    if (result[i] === 'correct') continue
    for (let j = 0; j < 5; j++) {
      if (!used[j] && guessLetters[i] === hiddenLetters[j]) {
        result[i] = 'present'
        used[j] = true
        break
      }
    }
  }

  return result
}

const priority: Record<LetterState, number> = { absent: 0, present: 1, correct: 2 }

export function accumulateLetterStates(
  existing: Map<string, LetterState>,
  guess: string,
  result: LetterState[]
): Map<string, LetterState> {
  const updated = new Map(existing)
  for (let i = 0; i < guess.length; i++) {
    const letter = guess[i]
    const newState = result[i]
    if (!letter || !newState) continue
    const current = updated.get(letter)
    if (!current || priority[newState] > priority[current]) {
      updated.set(letter, newState)
    }
  }
  return updated
}

export function calculateScore(currentScore: number, streak: number, timeRemaining: number): number {
  return currentScore + (streak + 1) * timeRemaining
}
