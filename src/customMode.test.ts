import { describe, expect, test } from 'bun:test'
import { gameReducer, createInitialState } from './GameScreen'

describe('Custom mode', () => {
  test('createInitialState uses customTime for timeRemaining', () => {
    const state = createInitialState({ mode: 'custom', customTime: 45 })
    expect(state.timeRemaining).toBe(45)
  })

  test('win adds customTime to timeRemaining (not hardcoded 120)', () => {
    const state = { ...createInitialState({ mode: 'custom', customTime: 45 }), timeRemaining: 20, hiddenWord: 'APPLE' }
    const grid = state.grid.map(row => [...row])
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
    expect(result.timeRemaining).toBe(65) // 20 + 45
  })

  test('NEW_ROUND after loss resets time to customTime', () => {
    const state = {
      ...createInitialState({ mode: 'custom', customTime: 60 }),
      status: 'lost' as const,
      score: 500,
      streak: 3,
      timeRemaining: 0,
    }
    const result = gameReducer(state, { type: 'NEW_ROUND' })
    expect(result.timeRemaining).toBe(60)
    expect(result.status).toBe('playing')
    expect(result.score).toBe(0)
    expect(result.streak).toBe(0)
  })
})
