import { describe, test, expect } from 'bun:test'
import { MenuScreen } from './MenuScreen'

describe('MenuScreen', () => {
  test('component exports correctly', () => {
    expect(MenuScreen).toBeDefined()
    expect(typeof MenuScreen).toBe('function')
  })
})
