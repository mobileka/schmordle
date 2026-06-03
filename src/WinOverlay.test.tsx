import { describe, test, expect, vi } from 'bun:test'
import { WinOverlay } from './WinOverlay'
import { extractAllTexts } from './testHelpers'

const defaultProps = {
  totalScore: 150,
  scoreEarned: 50,
  streak: 2,
  hiddenWord: 'APPLE',
  onPlayAgain: vi.fn(),
  onHighScores: vi.fn(),
  onQuit: vi.fn(),
}

describe('WinOverlay', () => {
  test('zen mode renders word and action prompts', () => {
    const texts = extractAllTexts(WinOverlay({ ...defaultProps, mode: 'zen', totalScore: 0, scoreEarned: 0, streak: 0 }))
    expect(texts).toContain('Beautifully Solved')
    expect(texts).toContain('APPLE')
    expect(texts).toContain('[P] Play Again')
    expect(texts).toContain('[H] High Scores')
    expect(texts).toContain('[Esc] Quit')
  })

  test('non-zen mode renders scores', () => {
    const texts = extractAllTexts(WinOverlay({ ...defaultProps, mode: 'normal' }))
    expect(texts).toContain('Correct!')
    expect(texts).toContain('Streak: ')
  })

  test('normal mode displays +3:00 time bonus', () => {
    const texts = extractAllTexts(WinOverlay({ ...defaultProps, mode: 'normal', timeBonus: 180 }))
    expect(texts).toContain('+3:00 time bonus')
  })

  test('insane mode displays +30s time bonus', () => {
    const texts = extractAllTexts(WinOverlay({ ...defaultProps, mode: 'insane', timeBonus: 30 }))
    expect(texts).toContain('+30s time bonus')
  })

  test('hard mode displays +1:30 time bonus', () => {
    const texts = extractAllTexts(WinOverlay({ ...defaultProps, mode: 'hard', timeBonus: 90 }))
    expect(texts).toContain('+1:30 time bonus')
  })
})
