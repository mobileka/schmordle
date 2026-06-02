import { describe, expect, test } from 'bun:test'
import { gameReducer, createInitialState } from './GameScreen'

describe('Loss flow', () => {
  test('loss on 6th incorrect guess sets status to lost', () => {
    const state = { ...createInitialState({ mode: 'normal' }), hiddenWord: 'APPLE', currentRow: 5 }
    const grid = state.grid.map(row => [...row])
    const row = grid[5]
    if (row) {
      row[0] = 'G'
      row[1] = 'R'
      row[2] = 'A'
      row[3] = 'P'
      row[4] = 'E'
    }
    const stateWithGuess = { ...state, grid, currentCol: 5 }
    const result = gameReducer(stateWithGuess, { type: 'SUBMIT' })
    expect(result.status).toBe('lost')
  })

  test('loss preserves streak for overlay display', () => {
    const state = { ...createInitialState({ mode: 'normal' }), hiddenWord: 'APPLE', currentRow: 5, streak: 3 }
    const grid = state.grid.map(row => [...row])
    const row = grid[5]
    if (row) {
      row[0] = 'G'
      row[1] = 'R'
      row[2] = 'A'
      row[3] = 'P'
      row[4] = 'E'
    }
    const stateWithGuess = { ...state, grid, currentCol: 5 }
    const result = gameReducer(stateWithGuess, { type: 'SUBMIT' })
    expect(result.streak).toBe(3)
  })

  test('loss on time expiry sets status to lost', () => {
    const state = { ...createInitialState({ mode: 'normal' }), timeRemaining: 1 }
    const result = gameReducer(state, { type: 'TICK' })
    expect(result.status).toBe('lost')
    expect(result.timeRemaining).toBe(0)
  })

  test('loss on time expiry preserves streak', () => {
    const state = { ...createInitialState({ mode: 'normal' }), timeRemaining: 1, streak: 5 }
    const result = gameReducer(state, { type: 'TICK' })
    expect(result.streak).toBe(5)
  })

  test('NEW_ROUND after loss resets game state including streak and score', () => {
    const state = {
      ...createInitialState({ mode: 'normal' }),
      score: 100,
      streak: 3,
      timeRemaining: 50,
      status: 'lost' as const,
    }
    const result = gameReducer(state, { type: 'NEW_ROUND' })
    expect(result.status).toBe('playing')
    expect(result.score).toBe(0)
    expect(result.streak).toBe(0)
    expect(result.timeRemaining).toBe(180)
    expect(result.currentRow).toBe(0)
    expect(result.currentCol).toBe(0)
    expect(result.grid[0]).toEqual([null, null, null, null, null])
  })
})
