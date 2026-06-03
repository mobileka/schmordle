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
})
