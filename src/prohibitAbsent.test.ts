import { describe, expect, test } from 'bun:test'
import { gameReducer, createInitialState } from './GameScreen'

function submitGuess(state: any, letters: string) {
  const grid = state.grid.map((row: (string | null)[]) => [...row])
  const row = grid[state.currentRow]
  if (row) {
    for (let i = 0; i < letters.length; i++) {
      row[i] = letters[i]!
    }
  }
  return gameReducer({ ...state, grid, currentCol: letters.length }, { type: 'SUBMIT' })
}

describe('Prohibit absent letters', () => {
  test('TYPE_LETTER blocks absent letter when prohibitAbsent is enabled', () => {
    const state = { ...createInitialState({ mode: 'normal', extraChallenges: { prohibitAbsent: true } }), hiddenWord: 'AUDIO' }
    const afterGuess = submitGuess(state, 'APPLE')
    expect(afterGuess.letterStates.get('P')).toBe('absent')
    const afterType = gameReducer(afterGuess, { type: 'TYPE_LETTER', letter: 'P' })
    expect(afterType.grid[1]).toEqual([null, null, null, null, null])
    expect(afterType.currentCol).toBe(0)
  })

  test('TYPE_LETTER allows absent letter when prohibitAbsent is disabled', () => {
    const state = { ...createInitialState({ mode: 'normal', extraChallenges: { prohibitAbsent: false } }), hiddenWord: 'AUDIO' }
    const afterGuess = submitGuess(state, 'APPLE')
    expect(afterGuess.letterStates.get('P')).toBe('absent')
    const afterType = gameReducer(afterGuess, { type: 'TYPE_LETTER', letter: 'P' })
    expect(afterType.grid[1][0]).toBe('P')
    expect(afterType.currentCol).toBe(1)
  })

  test('TYPE_LETTER allows non-absent letter when prohibitAbsent is enabled', () => {
    const state = { ...createInitialState({ mode: 'normal', extraChallenges: { prohibitAbsent: true } }), hiddenWord: 'AUDIO' }
    const afterGuess = submitGuess(state, 'APPLE')
    expect(afterGuess.letterStates.get('A')).toBe('correct')
    const afterType = gameReducer(afterGuess, { type: 'TYPE_LETTER', letter: 'A' })
    expect(afterType.grid[1][0]).toBe('A')
    expect(afterType.currentCol).toBe(1)
  })

  test('NEW_ROUND resets letterStates so absent letters become typeable', () => {
    const state = { ...createInitialState({ mode: 'normal', extraChallenges: { prohibitAbsent: true } }), hiddenWord: 'AUDIO' }
    const afterGuess = submitGuess(state, 'APPLE')
    expect(afterGuess.letterStates.get('P')).toBe('absent')
    const afterNewRound = gameReducer(afterGuess, { type: 'NEW_ROUND' })
    expect(afterNewRound.letterStates.size).toBe(0)
    const afterType = gameReducer(afterNewRound, { type: 'TYPE_LETTER', letter: 'P' })
    expect(afterType.grid[0][0]).toBe('P')
    expect(afterType.currentCol).toBe(1)
  })
})
