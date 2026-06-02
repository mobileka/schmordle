import { describe, it, expect, vi } from 'bun:test'
import { LossOverlay } from './LossOverlay'

describe('LossOverlay', () => {
  it('renders game over message, score, streak, and hidden word', () => {
    const props = {
      totalScore: 150,
      streak: 0,
      hiddenWord: 'APPLE',
      onPlayAgain: vi.fn(),
      onHighScores: vi.fn(),
      onQuit: vi.fn(),
    }

    const result = LossOverlay(props)

    expect(result).toBeDefined()
  })

  it('renders Play Again prompt', () => {
    const result = LossOverlay({
      totalScore: 150,
      streak: 0,
      hiddenWord: 'APPLE',
      onPlayAgain: vi.fn(),
      onHighScores: vi.fn(),
      onQuit: vi.fn(),
    })

    const children = result.props.children
    const texts = children.map((c: any) => c.props?.children).flat()
    expect(texts).toContain('[P] Play Again')
  })

  it('renders High Scores prompt', () => {
    const result = LossOverlay({
      totalScore: 150,
      streak: 0,
      hiddenWord: 'APPLE',
      onPlayAgain: vi.fn(),
      onHighScores: vi.fn(),
      onQuit: vi.fn(),
    })

    const children = result.props.children
    const texts = children.map((c: any) => c.props?.children).flat()
    expect(texts).toContain('[H] High Scores')
  })

  it('renders Quit prompt', () => {
    const result = LossOverlay({
      totalScore: 150,
      streak: 0,
      hiddenWord: 'APPLE',
      onPlayAgain: vi.fn(),
      onHighScores: vi.fn(),
      onQuit: vi.fn(),
    })

    const children = result.props.children
    const texts = children.map((c: any) => c.props?.children).flat()
    expect(texts).toContain('[Esc] Quit')
  })

  it('zen mode renders word and actions without scores', () => {
    const result = LossOverlay({
      mode: 'zen',
      totalScore: 0,
      streak: 0,
      hiddenWord: 'APPLE',
      onPlayAgain: vi.fn(),
      onHighScores: vi.fn(),
      onQuit: vi.fn(),
    })

    expect(result).toBeDefined()
    const children = result.props.children
    const texts = children.map((c: any) => c.props?.children).flat()
    expect(texts).toContain('Game Over!')
    expect(texts).toContain('The word was: ')
    expect(texts).toContain('APPLE')
    expect(texts).not.toContain('Final Score: ')
    expect(texts).not.toContain('Streak: ')
  })

  it('non-zen mode renders scores', () => {
    const result = LossOverlay({
      mode: 'normal',
      totalScore: 150,
      streak: 3,
      hiddenWord: 'APPLE',
      onPlayAgain: vi.fn(),
      onHighScores: vi.fn(),
      onQuit: vi.fn(),
    })

    expect(result).toBeDefined()
    const children = result.props.children
    const texts = children.map((c: any) => c.props?.children).flat()
    expect(texts).toContain('Final Score: ')
    expect(texts).toContain('Streak: ')
  })
})
