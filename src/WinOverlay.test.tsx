import { describe, it, expect, vi } from 'bun:test'
import { WinOverlay } from './WinOverlay'

describe('WinOverlay', () => {
  it('zen mode renders "Beautifully Solved", word, and action prompts', () => {
    const result = WinOverlay({
      mode: 'zen',
      totalScore: 0,
      scoreEarned: 0,
      streak: 0,
      hiddenWord: 'APPLE',
      onPlayAgain: vi.fn(),
      onHighScores: vi.fn(),
      onQuit: vi.fn(),
    })

    expect(result).toBeDefined()
    const children = result.props.children
    const texts = children.map((c: any) => c.props?.children).flat()
    expect(texts).toContain('Beautifully Solved')
    expect(texts).toContain('APPLE')
    expect(texts).toContain('[P] Play Again')
    expect(texts).toContain('[H] High Scores')
    expect(texts).toContain('[Esc] Quit')
  })

  it('non-zen mode renders scores', () => {
    const result = WinOverlay({
      mode: 'normal',
      totalScore: 150,
      scoreEarned: 50,
      streak: 2,
      hiddenWord: 'APPLE',
    })

    expect(result).toBeDefined()
    const children = result.props.children
    const texts = children.map((c: any) => c.props?.children).flat()
    expect(texts).toContain('Correct!')
    expect(texts).toContain('Streak: ')
  })

  it('normal mode displays +3:00 time bonus', () => {
    const result = WinOverlay({
      mode: 'normal',
      totalScore: 150,
      scoreEarned: 50,
      streak: 2,
      hiddenWord: 'APPLE',
      timeBonus: 180,
    })

    const children = result.props.children
    const texts = children.map((c: any) => c.props?.children).flat()
    expect(texts).toContain('+3:00 time bonus')
  })

  it('insane mode displays +30s time bonus', () => {
    const result = WinOverlay({
      mode: 'insane',
      totalScore: 150,
      scoreEarned: 50,
      streak: 2,
      hiddenWord: 'APPLE',
      timeBonus: 30,
    })

    const children = result.props.children
    const texts = children.map((c: any) => c.props?.children).flat()
    expect(texts).toContain('+30s time bonus')
  })

  it('hard mode displays +1:30 time bonus', () => {
    const result = WinOverlay({
      mode: 'hard',
      totalScore: 150,
      scoreEarned: 50,
      streak: 2,
      hiddenWord: 'APPLE',
      timeBonus: 90,
    })

    const children = result.props.children
    const texts = children.map((c: any) => c.props?.children).flat()
    expect(texts).toContain('+1:30 time bonus')
  })
})
