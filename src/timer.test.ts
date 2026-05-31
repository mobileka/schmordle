import { describe, test, expect } from 'bun:test'
import { gameReducer, createInitialState } from './GameScreen'

describe('Timer logic', () => {
  test('TICK decrements timeRemaining', () => {
    const state = createInitialState('normal')
    const result = gameReducer(state, { type: 'TICK' })
    expect(result.timeRemaining).toBe(119)
  })

  test('TICK does not decrement below 0', () => {
    const state = { ...createInitialState('normal'), timeRemaining: 0 }
    const result = gameReducer(state, { type: 'TICK' })
    expect(result.timeRemaining).toBe(0)
  })

  test('TICK sets status to lost when time runs out', () => {
    const state = { ...createInitialState('normal'), timeRemaining: 1, streak: 3 }
    const result = gameReducer(state, { type: 'TICK' })
    expect(result.timeRemaining).toBe(0)
    expect(result.status).toBe('lost')
    expect(result.streak).toBe(0)
  })

  test('TICK does not decrement when game is over', () => {
    const state = { ...createInitialState('normal'), status: 'won' as const, timeRemaining: 50 }
    const result = gameReducer(state, { type: 'TICK' })
    expect(result.timeRemaining).toBe(50)
  })

  test('streak increments on win', () => {
    const state = { ...createInitialState('normal'), streak: 2, hiddenWord: 'APPLE' }
    const grid = state.grid.map((row: (string | null)[]) => [...row])
    const row = grid[0]
    if (row) {
      row[0] = 'A'
      row[1] = 'P'
      row[2] = 'P'
      row[3] = 'L'
      row[4] = 'E'
    }
    const stateWithGuess = { ...state, grid, currentCol: 5 }
    const result = gameReducer(stateWithGuess, { type: 'SUBMIT' })
    expect(result.streak).toBe(3)
  })

  test('streak resets on loss', () => {
    const state = { ...createInitialState('normal'), streak: 5, currentRow: 5, hiddenWord: 'APPLE' }
    const grid = state.grid.map((row: (string | null)[]) => [...row])
    const row = grid[5]
    if (row) {
      row[0] = 'R'
      row[1] = 'A'
      row[2] = 'D'
      row[3] = 'I'
      row[4] = 'O'
    }
    const stateWithGuess = { ...state, grid, currentCol: 5 }
    const result = gameReducer(stateWithGuess, { type: 'SUBMIT' })
    expect(result.streak).toBe(0)
  })
})
