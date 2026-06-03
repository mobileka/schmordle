import { describe, expect, test } from 'bun:test'
import { gameReducer, createInitialState } from './GameScreen'
import { submitGuess } from './testHelpers'

describe('Win flow', () => {
  test('streak increments on win', () => {
    const state = { ...createInitialState({ mode: 'normal' }), streak: 2, hiddenWord: 'APPLE' }
    const result = submitGuess(state, 'APPLE')
    expect(result.streak).toBe(3)
  })

  test('win adds mode-specific time bonus (normal: +180s)', () => {
    const state = { ...createInitialState({ mode: 'normal' }), timeRemaining: 50, hiddenWord: 'APPLE' }
    const result = submitGuess(state, 'APPLE')
    expect(result.timeRemaining).toBe(230)
  })

  test('insane win adds 30s time bonus', () => {
    const state = { ...createInitialState({ mode: 'insane' }), hiddenWord: 'APPLE', timeRemaining: 10 }
    const result = submitGuess(state, 'APPLE')
    expect(result.timeRemaining).toBe(40)
  })

  test('zen win does not add time bonus', () => {
    const state = { ...createInitialState({ mode: 'zen' }), hiddenWord: 'APPLE' }
    const result = submitGuess(state, 'APPLE')
    expect(result.timeRemaining).toBe(0)
  })

  test('win tracks lastScoreEarned', () => {
    const state = { ...createInitialState({ mode: 'normal' }), timeRemaining: 50, streak: 2, hiddenWord: 'APPLE' }
    const result = submitGuess(state, 'APPLE')
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
