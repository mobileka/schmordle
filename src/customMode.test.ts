import { describe, expect, test } from 'bun:test'
import { gameReducer, createInitialState } from './GameScreen'
import { submitGuess } from './testHelpers'

describe('Custom mode', () => {
  test('createInitialState uses customTime for timeRemaining', () => {
    const state = createInitialState({ mode: 'custom', customTime: 45 })
    expect(state.timeRemaining).toBe(45)
  })

  test('win adds customTime to timeRemaining (not hardcoded 120)', () => {
    const state = { ...createInitialState({ mode: 'custom', customTime: 45 }), timeRemaining: 20, hiddenWord: 'APPLE' }
    const result = submitGuess(state, 'APPLE')
    expect(result.timeRemaining).toBe(65)
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
