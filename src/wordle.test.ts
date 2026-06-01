import { describe, test, expect } from 'bun:test'
import { evaluateGuess, calculateScore } from './wordle'

describe('wordle', () => {
  test('all letters correct', () => {
    const result = evaluateGuess('AUDIO', 'AUDIO')
    expect(result).toEqual(['correct', 'correct', 'correct', 'correct', 'correct'])
  })

  test('all letters absent', () => {
    const result = evaluateGuess('RADIO', 'QUEEN')
    expect(result).toEqual(['absent', 'absent', 'absent', 'absent', 'absent'])
  })

  test('mix of present and correct', () => {
    const result = evaluateGuess('RADIO', 'AUDIO')
    expect(result).toEqual(['absent', 'present', 'correct', 'correct', 'correct'])
  })

  test('duplicate letter - one correct one present', () => {
    const result = evaluateGuess('SPEED', 'CREED')
    expect(result).toEqual(['absent', 'absent', 'correct', 'correct', 'correct'])
  })

  test('letter appears twice in guess but once in hidden word', () => {
    const result = evaluateGuess('APPLE', 'DANCE')
    expect(result).toEqual(['present', 'absent', 'absent', 'absent', 'correct'])
  })

  test('letter appears twice in guess, once correct once absent', () => {
    const result = evaluateGuess('APPLE', 'EAGLE')
    expect(result).toEqual(['present', 'absent', 'absent', 'correct', 'correct'])
  })

  test('calculates score correctly', () => {
    expect(calculateScore(0, 1, 60)).toBe(60)
    expect(calculateScore(60, 2, 50)).toBe(160)
    expect(calculateScore(100, 5, 0)).toBe(100)
    expect(calculateScore(0, 0, 60)).toBe(0)
  })
})
