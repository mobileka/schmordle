import { describe, test, expect, vi } from 'bun:test'
import { LossOverlay } from './LossOverlay'
import { extractAllTexts } from './testHelpers'

const defaultProps = {
  totalScore: 150,
  streak: 0,
  hiddenWord: 'APPLE',
  onPlayAgain: vi.fn(),
  onHighScores: vi.fn(),
  onQuit: vi.fn(),
}

describe('LossOverlay', () => {
  test('renders game over message and action prompts', () => {
    const texts = extractAllTexts(LossOverlay(defaultProps))
    expect(texts).toContain('[P] Play Again')
    expect(texts).toContain('[H] High Scores')
    expect(texts).toContain('[Esc] Quit')
  })

  test('zen mode renders word without scores', () => {
    const texts = extractAllTexts(LossOverlay({ ...defaultProps, mode: 'zen', totalScore: 0 }))
    expect(texts).toContain('Game Over!')
    expect(texts).toContain('The word was: ')
    expect(texts).toContain('APPLE')
    expect(texts).not.toContain('Final Score: ')
    expect(texts).not.toContain('Streak: ')
  })

  test('non-zen mode renders scores', () => {
    const texts = extractAllTexts(LossOverlay({ ...defaultProps, mode: 'normal', streak: 3 }))
    expect(texts).toContain('Final Score: ')
    expect(texts).toContain('Streak: ')
  })
})
