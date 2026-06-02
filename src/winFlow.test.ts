import { describe, expect, test } from 'bun:test'
import { gameReducer, createInitialState } from './GameScreen'

describe('Win flow', () => {
  test('win adds mode-specific time bonus (normal: +180s)', () => {
    const state = { ...createInitialState({ mode: 'normal' }), timeRemaining: 50, hiddenWord: 'APPLE' }
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
    expect(result.timeRemaining).toBe(230) // 50 + 180
  })

  test('win tracks lastScoreEarned', () => {
    const state = { ...createInitialState({ mode: 'normal' }), timeRemaining: 50, streak: 2, hiddenWord: 'APPLE' }
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
    // streak bumps to 3, score = (3) * 50 = 150
    expect(result.lastScoreEarned).toBe(150)
  })

  test('NEW_ROUND resets grid but keeps score/streak/time', () => {
    const state = {
      ...createInitialState({ mode: 'normal' }),
      score: 500,
      streak: 3,
      timeRemaining: 80,
      status: 'won' as const,
      lastScoreEarned: 150,
    }
    const result = gameReducer(state, { type: 'NEW_ROUND' })
    expect(result.status).toBe('playing')
    expect(result.score).toBe(500)
    expect(result.streak).toBe(3)
    expect(result.timeRemaining).toBe(80)
    expect(result.currentRow).toBe(0)
    expect(result.currentCol).toBe(0)
    expect(result.grid[0]).toEqual([null, null, null, null, null])
  })
})
