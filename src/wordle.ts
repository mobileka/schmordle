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
