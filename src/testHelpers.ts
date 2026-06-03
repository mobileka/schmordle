import { gameReducer, type GameState } from './GameScreen'

export function submitGuess(state: GameState, letters: string): GameState {
  const grid = state.grid.map((row: (string | null)[]) => [...row])
  const row = grid[state.currentRow]
  if (row) {
    for (let i = 0; i < letters.length; i++) {
      row[i] = letters[i]!
    }
  }
  return gameReducer({ ...state, grid, currentCol: letters.length }, { type: 'SUBMIT' })
}

export function extractAllTexts(node: any): string[] {
  if (!node) return []
  if (typeof node === 'string') return [node]
  if (typeof node === 'number') return [String(node)]
  if (Array.isArray(node)) return node.flatMap(extractAllTexts)
  const texts: string[] = []
  if (node.props?.children) {
    texts.push(...extractAllTexts(node.props.children))
  }
  return texts
}
