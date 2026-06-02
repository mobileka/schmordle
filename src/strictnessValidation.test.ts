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

describe('Strictness validation', () => {
  describe('relaxed mode', () => {
    test('no restrictions on guesses', () => {
      const state = createInitialState({ mode: 'normal', strictness: 'relaxed' })
      const result = submitGuess(state, 'RADIO')
      expect(result.error).toBe('')
      expect(result.status).toBe('playing')
    })
  })

  describe('strict mode', () => {
    test('rejects guess missing required letter', () => {
      const state = { ...createInitialState({ mode: 'normal', strictness: 'strict' }), hiddenWord: 'AUDIO' }
      const afterFirst = submitGuess(state, 'APPLE')
      expect(afterFirst.currentRow).toBe(1)
      expect(afterFirst.states[0]).toEqual(['correct', 'absent', 'absent', 'absent', 'absent'])
      const result = submitGuess(afterFirst, 'HOUSE')
      expect(result.error).toBe('Must use revealed letters')
      expect(result.currentRow).toBe(1)
    })

    test('accepts guess containing all required letters', () => {
      const state = { ...createInitialState({ mode: 'normal', strictness: 'strict' }), hiddenWord: 'AUDIO' }
      const afterFirst = submitGuess(state, 'APPLE')
      expect(afterFirst.currentRow).toBe(1)
      const result = submitGuess(afterFirst, 'RADIO')
      expect(result.error).toBe('')
      expect(result.currentRow).toBe(2)
    })
  })

  describe('very-strict mode', () => {
    test('rejects guess when correct letter moved to wrong position', () => {
      const state = { ...createInitialState({ mode: 'normal', strictness: 'very-strict' }), hiddenWord: 'CHAIR' }
      const afterFirst = submitGuess(state, 'FLAME')
      expect(afterFirst.currentRow).toBe(1)
      expect(afterFirst.states[0]).toEqual(['absent', 'absent', 'correct', 'absent', 'absent'])
      const result = submitGuess(afterFirst, 'APPLE')
      expect(result.error).toBe('Correct letters must stay in position')
    })

    test('accepts guess with correct letters in position and all required letters', () => {
      const state = { ...createInitialState({ mode: 'normal', strictness: 'very-strict' }), hiddenWord: 'CHAIR' }
      const afterFirst = submitGuess(state, 'FLAME')
      expect(afterFirst.currentRow).toBe(1)
      const result = submitGuess(afterFirst, 'GRAPE')
      expect(result.error).toBe('')
      expect(result.currentRow).toBe(2)
    })

    test('also enforces strict requirement for present/correct letters', () => {
      const state = { ...createInitialState({ mode: 'normal', strictness: 'very-strict' }), hiddenWord: 'AUDIO' }
      const afterFirst = submitGuess(state, 'APPLE')
      expect(afterFirst.currentRow).toBe(1)
      const result = submitGuess(afterFirst, 'HOUSE')
      expect(result.error).toBe('Must use revealed letters')
    })
  })
})
