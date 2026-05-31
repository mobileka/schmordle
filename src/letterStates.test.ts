import { describe, test, expect } from 'bun:test'
import { accumulateLetterStates, type LetterState } from './wordle'

describe('accumulateLetterStates', () => {
  test('adds letter states from guess result', () => {
    const existing = new Map<string, LetterState>()
    const guess = 'APPLE'
    const result: LetterState[] = ['correct', 'absent', 'present', 'absent', 'correct']
    const updated = accumulateLetterStates(existing, guess, result)
    expect(updated.get('A')).toBe('correct')
    expect(updated.get('P')).toBe('present')
    expect(updated.get('L')).toBe('absent')
    expect(updated.get('E')).toBe('correct')
  })

  test('correct state is never downgraded', () => {
    const existing = new Map<string, LetterState>([['A', 'correct']])
    const guess = 'AUDIO'
    const result: LetterState[] = ['present', 'absent', 'absent', 'absent', 'absent']
    const updated = accumulateLetterStates(existing, guess, result)
    expect(updated.get('A')).toBe('correct')
  })

  test('present state is upgraded to correct', () => {
    const existing = new Map<string, LetterState>([['A', 'present']])
    const guess = 'APPLE'
    const result: LetterState[] = ['correct', 'absent', 'absent', 'absent', 'absent']
    const updated = accumulateLetterStates(existing, guess, result)
    expect(updated.get('A')).toBe('correct')
  })

  test('absent state is upgraded to present', () => {
    const existing = new Map<string, LetterState>([['A', 'absent']])
    const guess = 'AUDIO'
    const result: LetterState[] = ['present', 'absent', 'absent', 'absent', 'absent']
    const updated = accumulateLetterStates(existing, guess, result)
    expect(updated.get('A')).toBe('present')
  })
})
