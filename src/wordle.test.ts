import { describe, test, expect } from 'bun:test'
import { evaluateGuess } from './wordle'

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
})
