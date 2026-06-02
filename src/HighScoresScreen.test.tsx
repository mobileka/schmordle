import { describe, test, expect } from 'bun:test'
import { HighScoresScreen } from './HighScoresScreen'

describe('HighScoresScreen', () => {
  test('component exports correctly', () => {
    expect(HighScoresScreen).toBeDefined()
    expect(typeof HighScoresScreen).toBe('function')
  })
})
