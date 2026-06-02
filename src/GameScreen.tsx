import { useReducer, useEffect } from 'react'
import { useRenderer } from '@opentui/react'
import { Grid } from './Grid'
import { Keyboard } from './Keyboard'
import { Timer } from './Timer'
import { WinOverlay } from './WinOverlay'
import { LossOverlay } from './LossOverlay'
import { evaluateGuess, accumulateLetterStates, calculateScore, type LetterState } from './wordle'
import { getRandomWord, isValidWord } from './dictionary'
import type { GameMode } from './storage'

type GameStatus = 'playing' | 'won' | 'lost' | 'giving-up'

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
  | { type: 'GIVE_UP' }
  | { type: 'CONFIRM_GIVE_UP' }
  | { type: 'CANCEL_GIVE_UP' }

function getInitialTime(mode: GameMode): number {
  switch (mode) {
    case 'zen': return 0
    case 'relaxed': return 300
    case 'normal': return 180
    case 'hard': return 90
    case 'insane': return 30
    case 'custom': return 120
  }
}

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
    timeRemaining: getInitialTime(mode),
    streak: 0,
    score: 0,
    lastScoreEarned: 0,
  }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  const metaActions = ['CLEAR_ERROR', 'NEW_ROUND', 'GIVE_UP', 'CONFIRM_GIVE_UP', 'CANCEL_GIVE_UP']
  if (state.status !== 'playing' && !metaActions.includes(action.type)) return state

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
      const newStreak = won ? state.streak + 1 : state.streak
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
        timeRemaining: won ? (state.mode === 'zen' ? 0 : state.timeRemaining + getInitialTime(state.mode)) : state.timeRemaining,
        lastScoreEarned: scoreEarned,
      }
    }

    case 'GIVE_UP':
      if (state.status !== 'playing') return state
      return { ...state, status: 'giving-up' }

    case 'CONFIRM_GIVE_UP':
      if (state.status !== 'giving-up') return state
      return { ...state, status: 'lost' }

    case 'CANCEL_GIVE_UP':
      if (state.status !== 'giving-up') return state
      return { ...state, status: 'playing' }

    case 'CLEAR_ERROR':
      return { ...state, error: '' }

    case 'TICK':
      if (state.status !== 'playing') return state
      if (state.mode === 'zen') return state
      if (state.timeRemaining <= 1) {
        return { ...state, timeRemaining: 0, status: 'lost' }
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
        timeRemaining: state.status === 'lost' ? getInitialTime(state.mode) : state.timeRemaining,
        streak: state.status === 'lost' ? 0 : state.streak,
        score: state.status === 'lost' ? 0 : state.score,
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
      if (state.status === 'giving-up') {
        if (key.sequence === 'y' || key.sequence === 'Y') {
          dispatch({ type: 'CONFIRM_GIVE_UP' })
          return
        }
        if (key.sequence === 'n' || key.sequence === 'N' || key.name === 'escape') {
          dispatch({ type: 'CANCEL_GIVE_UP' })
          return
        }
        return
      }
      if (state.status === 'lost') {
        if (key.sequence === 'p' || key.sequence === 'P') {
          dispatch({ type: 'NEW_ROUND' })
          return
        }
        if (key.sequence === 'h' || key.sequence === 'H') {
          console.log('High Scores')
          return
        }
        if (key.name === 'escape') {
          onQuit()
          return
        }
        return
      }
      if (state.status === 'won') {
        if (mode === 'zen') {
          if (key.sequence === 'p' || key.sequence === 'P') {
            dispatch({ type: 'NEW_ROUND' })
            return
          }
          if (key.sequence === 'h' || key.sequence === 'H') {
            console.log('High Scores')
            return
          }
          if (key.name === 'escape') {
            onQuit()
            return
          }
        }
        // Block all input during timed-mode win overlay
        return
      }
      if (key.name === 'escape') {
        dispatch({ type: 'GIVE_UP' })
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
  }, [renderer, onQuit, state.status, mode])

  useEffect(() => {
    if (state.status !== 'playing') return
    const interval = setInterval(() => {
      dispatch({ type: 'TICK' })
    }, 1000)
    return () => clearInterval(interval)
  }, [state.status])

  useEffect(() => {
    if (state.status !== 'won' || mode === 'zen') return
    const timeout = setTimeout(() => {
      dispatch({ type: 'NEW_ROUND' })
    }, 2000)
    return () => clearTimeout(timeout)
  }, [state.status, mode])

  const message = state.error || ''
  const messageColor = state.error ? '#ff6b6b' : '#ff6b6b'

  if (state.status === 'giving-up') {
    return (
      <box flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1} gap={1}>
        <text>Give up?</text>
        <text fg="#888">[Y] Yes</text>
        <text fg="#888">[N] No</text>
      </box>
    )
  }

  if (state.status === 'won') {
    return (
      <WinOverlay
        mode={mode}
        scoreEarned={state.lastScoreEarned}
        streak={state.streak}
        totalScore={state.score}
        hiddenWord={state.hiddenWord}
        timeBonus={getInitialTime(mode)}
        onPlayAgain={() => dispatch({ type: 'NEW_ROUND' })}
        onHighScores={() => console.log('High Scores')}
        onQuit={onQuit}
      />
    )
  }

  if (state.status === 'lost') {
    return (
      <LossOverlay
        mode={mode}
        totalScore={state.score}
        streak={state.streak}
        hiddenWord={state.hiddenWord}
        onPlayAgain={() => dispatch({ type: 'NEW_ROUND' })}
        onHighScores={() => console.log('High Scores')}
        onQuit={onQuit}
      />
    )
  }

  return (
    <box flexDirection="column" alignItems="center" justifyContent="center" flexGrow={1} gap={2}>
      <box flexDirection="row" gap={3} alignItems="center">
        {mode !== 'zen' && <text>Score: {state.score}</text>}
        <text>SCHMORDLE - {mode.toUpperCase()}</text>
        {mode !== 'zen' && <Timer timeRemaining={state.timeRemaining} streak={state.streak} />}
      </box>
      <text fg={messageColor} height={1}>{message}</text>
      <Grid grid={state.grid} states={state.states} />
      <Keyboard letterStates={state.letterStates} />
      <text fg="#888">[Esc] Back</text>
    </box>
  )
}
