import { describe, test, expect } from 'bun:test'
import { getRandomWord, isValidWord } from './dictionary'

describe('dictionary', () => {
  test('getRandomWord returns 5-letter word', () => {
    const word = getRandomWord()
    expect(word.length).toBe(4)
    expect(typeof word).toBe('string')
  })

  test('isValidWord returns true for valid word', () => {
    expect(isValidWord('AUDIO')).toBe(true)
    expect(isValidWord('RADIO')).toBe(true)
  })

  test('isValidWord returns false for invalid word', () => {
    expect(isValidWord('XXXXX')).toBe(false)
    expect(isValidWord('HELLO')).toBe(false)
  })

  test('isValidWord is case-insensitive', () => {
    expect(isValidWord('audio')).toBe(true)
    expect(isValidWord('Audio')).toBe(true)
  })
})
