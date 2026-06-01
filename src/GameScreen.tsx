import { useReducer, useEffect } from 'react'
import { useRenderer } from '@opentui/react'
import { Grid } from './Grid'
import { Keyboard } from './Keyboard'
import { Timer } from './Timer'
import { WinOverlay } from './WinOverlay'
import { evaluateGuess, accumulateLetterStates, calculateScore, type LetterState } from './wordle'
import { getRandomWord, isValidWord } from './dictionary'
import type { GameMode } from './storage'

type GameStatus = 'playing' | 'won' | 'lost'

type GameState = {
  mode: GameMode
  grid: (string | null)[][]
  states: (LetterState | null)[][]
  currentRow: number
  currentCol: number
  hiddenWord: string
  status: GameStatus
  error: string
  letterStates: Map<string, LetterState>
  timeRemaining: number
  streak: number
  score: number
  lastScoreEarned: number
}

type GameAction =
  | { type: 'TYPE_LETTER'; letter: string }
  | { type: 'BACKSPACE' }
  | { type: 'SUBMIT' }
  | { type: 'CLEAR_ERROR' }
  | { type: 'TICK' }
  | { type: 'NEW_ROUND' }

export function createInitialState(mode: GameMode): GameState {
  return {
    mode,
    grid: Array(6).fill(null).map(() => Array(5).fill(null)),
    states: Array(6).fill(null).map(() => Array(5).fill(null)),
    currentRow: 0,
    currentCol: 0,
    hiddenWord: getRandomWord(),
    status: 'playing',
    error: '',
    letterStates: new Map(),
    timeRemaining: 120,
    streak: 0,
    score: 0,
    lastScoreEarned: 0,
  }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (state.status !== 'playing' && action.type !== 'CLEAR_ERROR' && action.type !== 'NEW_ROUND') return state

  switch (action.type) {
    case 'TYPE_LETTER': {
      if (state.currentCol >= 5) return state
      const newGrid = state.grid.map(row => [...row])
      const row = newGrid[state.currentRow]
      if (!row) return state
      row[state.currentCol] = action.letter.toUpperCase()
      return {
        ...state,
        grid: newGrid,
        currentCol: state.currentCol + 1,
        error: '',
      }
    }

    case 'BACKSPACE': {
      if (state.currentCol === 0) return state
      const newGrid = state.grid.map(row => [...row])
      const row = newGrid[state.currentRow]
      if (!row) return state
      row[state.currentCol - 1] = null
      return {
        ...state,
        grid: newGrid,
        currentCol: state.currentCol - 1,
        error: '',
      }
    }

    case 'SUBMIT': {
      if (state.currentCol < 5) return { ...state, error: 'Word must be 5 letters' }

      const currentRow = state.grid[state.currentRow]
      if (!currentRow) return state
      const guess = currentRow.join('')
      if (!isValidWord(guess)) {
        return { ...state, error: 'Not in dictionary' }
      }

      const result = evaluateGuess(guess, state.hiddenWord)
      const newStates = state.states.map(row => [...row])
      newStates[state.currentRow] = result

      const won = result.every(s => s === 'correct')
      const lost = !won && state.currentRow === 5
      const newStreak = won ? state.streak + 1 : lost ? 0 : state.streak
      const scoreEarned = won ? (newStreak * state.timeRemaining) : 0

      return {
        ...state,
        states: newStates,
        currentRow: state.currentRow + 1,
        currentCol: 0,
        status: won ? 'won' : lost ? 'lost' : 'playing',
        error: '',
        letterStates: accumulateLetterStates(state.letterStates, guess, result),
        streak: newStreak,
        score: won ? calculateScore(state.score, newStreak, state.timeRemaining) : state.score,
        timeRemaining: won ? state.timeRemaining + 60 : state.timeRemaining,
        lastScoreEarned: scoreEarned,
      }
    }

    case 'CLEAR_ERROR':
      return { ...state, error: '' }

    case 'TICK':
      if (state.status !== 'playing') return state
      if (state.timeRemaining <= 1) {
        return { ...state, timeRemaining: 0, status: 'lost', streak: 0 }
      }
      return { ...state, timeRemaining: state.timeRemaining - 1 }

    case 'NEW_ROUND':
      return {
        ...state,
        grid: Array(6).fill(null).map(() => Array(5).fill(null)),
        states: Array(6).fill(null).map(() => Array(5).fill(null)),
        currentRow: 0,
        currentCol: 0,
        hiddenWord: getRandomWord(),
        status: 'playing',
        error: '',
        letterStates: new Map(),
      }

    default:
      return state
  }
}

interface GameScreenProps {
  mode: GameMode
  onQuit: () => void
}

export function GameScreen({ mode, onQuit }: GameScreenProps) {
  const [state, dispatch] = useReducer(gameReducer, mode, createInitialState)
  const renderer = useRenderer()

  useEffect(() => {
    const handler = (key: any) => {
      if (key.name === 'escape') {
        onQuit()
        return
      }
      if (key.name === 'return') {
        dispatch({ type: 'SUBMIT' })
        return
      }
      if (key.name === 'backspace') {
        dispatch({ type: 'BACKSPACE' })
        return
      }
      if (key.sequence && key.sequence.length === 1 && /[a-zA-Z]/.test(key.sequence)) {
        dispatch({ type: 'TYPE_LETTER', letter: key.sequence })
      }
    }

    renderer.keyInput.on('keypress', handler)
    return () => { renderer.keyInput.off('keypress', handler) }
  }, [renderer, onQuit])

  useEffect(() => {
    if (state.status !== 'playing') return
    const interval = setInterval(() => {
      dispatch({ type: 'TICK' })
    }, 1000)
    return () => clearInterval(interval)
  }, [state.status])

  useEffect(() => {
    if (state.status !== 'won') return
    const timeout = setTimeout(() => {
      dispatch({ type: 'NEW_ROUND' })
    }, 2000)
    return () => clearTimeout(timeout)
  }, [state.status])

  const message = state.error || (state.status === 'lost' ? `Game over! Word was: ${state.hiddenWord}` : '')
  const messageColor = state.error ? '#ff6b6b' : '#ff6b6b'

  if (state.status === 'won') {
    return (
      <WinOverlay scoreEarned={state.lastScoreEarned} streak={state.streak} totalScore={state.score} />
    )
  }

  return (
    <box flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1} gap={2}>
      <box flexDirection="row" gap={3} alignItems="center">
        <text>Score: {state.score}</text>
        <text>SCHMORDLE - {mode.toUpperCase()}</text>
        <Timer timeRemaining={state.timeRemaining} streak={state.streak} />
      </box>
      <text fg={messageColor} height={1}>{message}</text>
      <Grid grid={state.grid} states={state.states} />
      <Keyboard letterStates={state.letterStates} />
      <text fg="#888">[Esc] Back</text>
    </box>
  )
}
