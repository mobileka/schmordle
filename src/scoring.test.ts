import { describe, expect, test } from 'bun:test'
import { calculateScore } from './wordle'

describe('calculateScore', () => {
  test('first win: streak=1 × remaining seconds', () => {
    expect(calculateScore(0, 1, 60)).toBe(60)
    expect(calculateScore(0, 1, 30)).toBe(30)
  })

  test('accumulates: currentScore + streak × remaining seconds', () => {
    expect(calculateScore(60, 2, 50)).toBe(160)
    expect(calculateScore(100, 3, 10)).toBe(130)
  })

  test('handles zero time remaining', () => {
    expect(calculateScore(100, 5, 0)).toBe(100)
  })

  test('handles zero streak (should never happen, but defensive)', () => {
    expect(calculateScore(0, 0, 60)).toBe(0)
  })
})
