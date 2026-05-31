import { describe, expect, test } from 'bun:test'
import { calculateScore } from './wordle'

describe('calculateScore', () => {
  test('score = (streak + 1) × remaining seconds', () => {
    expect(calculateScore(0, 0, 100)).toBe(100)
    expect(calculateScore(0, 2, 50)).toBe(150)
    expect(calculateScore(0, 5, 30)).toBe(180)
  })

  test('adds to current score', () => {
    expect(calculateScore(500, 2, 50)).toBe(650)
    expect(calculateScore(1000, 0, 10)).toBe(1010)
  })

  test('handles zero time remaining', () => {
    expect(calculateScore(100, 5, 0)).toBe(100)
  })

  test('handles zero streak', () => {
    expect(calculateScore(0, 0, 60)).toBe(60)
  })
})
