import { describe, test, expect } from 'bun:test'
import { gameReducer, createInitialState } from './GameScreen'

describe('Timer logic', () => {
  test('TICK decrements timeRemaining', () => {
    const state = createInitialState({ mode: 'normal' })
    const result = gameReducer(state, { type: 'TICK' })
    expect(result.timeRemaining).toBe(179)
  })

  test('TICK does not decrement below 0', () => {
    const state = { ...createInitialState({ mode: 'normal' }), timeRemaining: 0 }
    const result = gameReducer(state, { type: 'TICK' })
    expect(result.timeRemaining).toBe(0)
  })

  test('TICK sets status to lost when time runs out', () => {
    const state = { ...createInitialState({ mode: 'normal' }), timeRemaining: 1, streak: 3 }
    const result = gameReducer(state, { type: 'TICK' })
    expect(result.timeRemaining).toBe(0)
    expect(result.status).toBe('lost')
    expect(result.streak).toBe(3)
  })

  test('TICK is no-op in zen mode', () => {
    const state = createInitialState({ mode: 'zen' })
    const result = gameReducer(state, { type: 'TICK' })
    expect(result.timeRemaining).toBe(0)
    expect(result.status).toBe('playing')
  })

  test('TICK does not decrement when game is over', () => {
    const state = { ...createInitialState({ mode: 'normal' }), status: 'won' as const, timeRemaining: 50 }
    const result = gameReducer(state, { type: 'TICK' })
    expect(result.timeRemaining).toBe(50)
  })

  test('streak increments on win', () => {
    const state = { ...createInitialState({ mode: 'normal' }), streak: 2, hiddenWord: 'APPLE' }
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

  test('normal win adds 180s time bonus', () => {
    const state = { ...createInitialState({ mode: 'normal' }), hiddenWord: 'APPLE', timeRemaining: 50 }
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
    expect(result.timeRemaining).toBe(230)
  })

  test('insane win adds 30s time bonus', () => {
    const state = { ...createInitialState({ mode: 'insane' }), hiddenWord: 'APPLE', timeRemaining: 10 }
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
    expect(result.timeRemaining).toBe(40)
  })

  test('zen win does not add time bonus', () => {
    const state = { ...createInitialState({ mode: 'zen' }), hiddenWord: 'APPLE' }
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
    expect(result.timeRemaining).toBe(0)
  })

  test('streak preserved on loss, reset on NEW_ROUND', () => {
    const state = { ...createInitialState({ mode: 'normal' }), streak: 5, currentRow: 5, hiddenWord: 'APPLE' }
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
    expect(result.streak).toBe(5)
    const newRound = gameReducer(result, { type: 'NEW_ROUND' })
    expect(newRound.streak).toBe(0)
  })
})
