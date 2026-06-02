import { describe, expect, test } from 'bun:test'
import { gameReducer, createInitialState } from './GameScreen'

describe('Give up flow', () => {
  test('GIVE_UP sets status to giving-up', () => {
    const state = createInitialState({ mode: 'normal' })
    const result = gameReducer(state, { type: 'GIVE_UP' })
    expect(result.status).toBe('giving-up')
  })

  test('CONFIRM_GIVE_UP from giving-up sets status to lost', () => {
    const state = { ...createInitialState({ mode: 'normal' }), status: 'giving-up' as const }
    const result = gameReducer(state, { type: 'CONFIRM_GIVE_UP' })
    expect(result.status).toBe('lost')
  })

  test('CANCEL_GIVE_UP from giving-up returns to playing', () => {
    const state = { ...createInitialState({ mode: 'normal' }), status: 'giving-up' as const }
    const result = gameReducer(state, { type: 'CANCEL_GIVE_UP' })
    expect(result.status).toBe('playing')
  })

  test('TICK is ignored during giving-up', () => {
    const state = { ...createInitialState({ mode: 'normal' }), timeRemaining: 60, status: 'giving-up' as const }
    const result = gameReducer(state, { type: 'TICK' })
    expect(result.timeRemaining).toBe(60)
    expect(result.status).toBe('giving-up')
  })

  test('TYPE_LETTER is ignored during giving-up', () => {
    const state = { ...createInitialState({ mode: 'normal' }), status: 'giving-up' as const }
    const result = gameReducer(state, { type: 'TYPE_LETTER', letter: 'A' })
    expect(result.grid[0]).toEqual([null, null, null, null, null])
    expect(result.status).toBe('giving-up')
  })

  test('GIVE_UP is ignored when not playing', () => {
    const state = { ...createInitialState({ mode: 'normal' }), status: 'won' as const }
    const result = gameReducer(state, { type: 'GIVE_UP' })
    expect(result.status).toBe('won')
  })
})
