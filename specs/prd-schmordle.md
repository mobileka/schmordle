# Schmordle — Terminal Wordle Game

## Problem Statement

I want to play a Wordle-like game in my terminal with multiple difficulty modes, scoring, and persistent high scores — without needing a browser or mobile app.

## Solution

A terminal-based Wordle clone built with OpenTUI and React, compiled to a standalone binary. The game features 6 game modes (Zen, Relaxed, Normal, Hard, Insane, Custom), a scoring system based on streaks and remaining time, persistent high scores, configurable strictness levels, and an optional "Prohibit known absent letters" challenge.

## User Stories

1. As a player, I want to see a splash screen and set my username on first launch, so that the game identifies me and my progress is saved.
   - [ ] Splash screen shows "SCHMORDLE" branding
   - [ ] Username prompt appears on first launch
   - [ ] Username is stored in `~/.config/schmordle/config.json`
   - [ ] Subsequent launches skip splash and go straight to menu

2. As a player, I want to see a main menu where I can select a game mode, access Settings, and view High Scores, so that I can navigate the game.
   - [ ] Shows all 6 game modes: Zen, Relaxed, Normal, Hard, Insane, Custom
   - [ ] Arrow keys navigate the menu
   - [ ] Hotkeys (1-6) select modes directly
   - [ ] Settings and High Scores accessible from menu
   - [ ] Quit option exits the game

3. As a player, I want to type words, see them in a grid, and see letter colors (grey/orange/green) after each guess, so that I can play the core Wordle game.
   - [ ] 5×6 grid renders (5 letters wide, 6 rows)
   - [ ] Typing fills the current row left to right
   - [ ] Backspace removes the last letter
   - [ ] Enter submits the guess
   - [ ] Letters color grey (absent), orange (present), green (correct) after submission
   - [ ] Invalid word shows an error message

4. As a player, I want to see a virtual keyboard showing which letters I've used and their states, so that I can track my progress at a glance.
   - [ ] QWERTY keyboard renders below the grid
   - [ ] Letters colored by state: grey/orange/green
   - [ ] Keyboard updates only after guess submission, not while typing

5. As a player, I want to see my remaining time and current streak during gameplay, so that I can manage my strategy.
   - [ ] Timer shows remaining time in `MM:SS` format, top-right corner
   - [ ] Streak shows current streak count next to timer
   - [ ] Timer counts down every second
   - [ ] Timer pauses during overlays (Correct, Give up)

6. As a player, I want to see a "Correct!" overlay with my score when I win, then automatically start the next round, so that I can keep playing in timed modes.
   - [ ] "Correct!" overlay appears after correct guess
   - [ ] Overlay shows score earned and current streak
   - [ ] Overlay shows "+5:00" time bonus in timed modes
   - [ ] Timer pauses during overlay
   - [ ] After ~2 seconds, auto-transitions to new grid with new word

7. As a player, I want to see a game over screen with my score, streak, and the hidden word when I lose, so that I can learn and decide what to do next.
   - [ ] Game over screen appears on loss (out of attempts or time)
   - [ ] Shows final score, streak, and revealed hidden word
   - [ ] Play Again restarts same mode
   - [ ] High Scores opens high scores screen
   - [ ] Quit exits the game

8. As a player, I want to press Escape to give up with a confirmation prompt, so that I can exit a round early.
   - [ ] Escape key triggers "Give up?" confirmation overlay
   - [ ] Y confirms give up, N/Esc cancels
   - [ ] Timer pauses during confirmation
   - [ ] Giving up triggers game over screen

9. As a player, I want my score calculated as `Streak × Remaining seconds` with the streak bumped before scoring, so that faster guesses earn more points.
   - [ ] Score formula: `Streak × Remaining seconds`
   - [ ] Streak bumps before score calculation on each win
   - [ ] Score accumulates across rounds in a session
   - [ ] Streak resets to 0 on loss

10. As a player, I want to configure Strictness levels and Extra Challenges in Settings, so that I can control the difficulty.
    - [ ] Relaxed: no restrictions on guesses
    - [ ] Strict: guess must contain all revealed present and correct letters
    - [ ] Very Strict: Strict + correct letters must stay in position
    - [ ] "Prohibit known absent letters": can't reuse absent letters
    - [ ] Absent letter restriction resets between rounds

11. As a player, I want my settings and high scores saved between sessions, so that I don't lose my progress.
    - [ ] Settings saved to `~/.config/schmordle/config.json`
    - [ ] High scores saved to `~/.config/schmordle/config.json`
    - [ ] Directory created automatically if it doesn't exist
    - [ ] Max 10 high scores per mode per user
    - [ ] Score of 0 never saved

12. As a player, I want to view high scores organized by game mode in a table, so that I can compare my best games.
    - [ ] Tabs for Relaxed, Normal, Hard, Insane (no Zen/Custom)
    - [ ] Table: Rank, UserName, Score, Date, Extra Challenges
    - [ ] Extra Challenges shows full name or "None"
    - [ ] Arrow keys + hotkeys navigate tabs

13. As a player, I want to play Zen mode (no timer, no scoring) and Custom mode (configurable timer), so that I can play at my own pace.
    - [ ] Zen: no timer, no score tracking, just play
    - [ ] Custom: toggle timer on/off, input custom seconds
    - [ ] Custom: no high scores recorded

14. As a player, I want to play timed modes (Relaxed 5min, Normal 3min, Hard 90s, Insane 30s) with 5 minutes added on each win, so that I have escalating challenge.
    - [ ] Relaxed: 5 minutes (300s)
    - [ ] Normal: 3 minutes (180s)
    - [ ] Hard: 90 seconds
    - [ ] Insane: 30 seconds
    - [ ] Win adds 5 minutes to remaining time
    - [ ] Loss triggers game over screen

15. As a player, I want to run a single compiled binary to play the game, so that I don't need to install Bun or clone the repo.
    - [ ] `bun build --compile` produces standalone binary
    - [ ] Dictionary embedded in binary
    - [ ] Binary runs without Bun installed
    - [ ] User data persists at `~/.config/schmordle/config.json`

## Implementation Decisions

**Distribution**: Compiled to a standalone binary via `bun build --compile`. Platform-specific (compile per target). The dictionary is embedded in the binary at build time.

**Modules to build:**

1. **wordle.ts** — Letter evaluation logic. Pure function: `(guess: string, hiddenWord: string) → LetterState[]`. Handles duplicate letters correctly (a letter that appears once in the hidden word should only be marked "correct" or "present" once).

2. **scoring.ts** — Score calculation. Pure function: `(streak: number, remainingSeconds: number) → number`. Formula: `streak * remainingSeconds`.

3. **dictionary.ts** — Dictionary loading. Imports `data/dictionary.json` directly (Bun bundles it at build time). Provides `getRandomWord()` and `isValidWord(word)`.

4. **storage.ts** — Config persistence. Read/write to `~/.config/schmordle/config.json`. Handles high scores (per mode, max 10 per user) and settings (strictness, extra challenges, username). Creates directory automatically if it doesn't exist.

5. **gameReducer.ts** — Core game state machine. Uses `useReducer` pattern. Actions: `START_GAME`, `SUBMIT_GUESS`, `TIMER_TICK`, `GIVE_UP`, `WIN`, `LOSE`, `RESET`. State includes: mode, grid, currentRow, currentCol, hiddenWord, timer, streak, score, status.

6. **App.tsx** — Screen router. Manages which screen is visible (splash, menu, game, settings, high scores).

7. **Grid.tsx** — 6×5 letter grid. Renders colored letters based on evaluation states.

8. **Keyboard.tsx** — Virtual QWERTY keyboard. Shows letter states (grey/orange/green). Updates only after guess submission.

9. **Timer.tsx** — Countdown display. Renders `MM:SS` format in top-right corner.

10. **ScoreBoard.tsx** — Score + streak display. Renders next to timer in top-right.

11. **Overlay.tsx** — Reusable overlay component. Used for "Correct!", "Give up?", and game over screens.

12. **SplashScreen.tsx** — Title screen + username prompt (first launch only).

13. **MenuScreen.tsx** — Mode selection + Settings/High Scores/Quit access.

14. **GameScreen.tsx** — Main gameplay. Combines Grid, Keyboard, Timer, ScoreBoard, and manages game state via reducer.

15. **SettingsScreen.tsx** — Strictness (radio), Extra Challenges (checkbox), Username change.

16. **HighScoresScreen.tsx** — Tabs per mode, table with Rank/UserName/Score/Date/Extra Challenges.

**Type definitions:**

```ts
type LetterState = 'absent' | 'present' | 'correct'
type GameMode = 'zen' | 'relaxed' | 'normal' | 'hard' | 'insane' | 'custom'
type Strictness = 'relaxed' | 'strict' | 'very-strict'
type GameStatus = 'idle' | 'playing' | 'won' | 'lost' | 'giving-up'
type Screen = 'splash' | 'menu' | 'game' | 'settings' | 'high-scores'
```

**Game reducer state shape:**

```ts
type GameState = {
  mode: GameMode
  screen: Screen
  grid: LetterState[][]
  guesses: string[]
  currentRow: number
  currentCol: number
  hiddenWord: string
  timer: number | null  // null for Zen mode
  streak: number
  score: number
  status: GameStatus
  strictness: Strictness
  extraChallenges: { prohibitAbsent: boolean }
  username: string
}
```

**Game flow:**
- Win: Brief "Correct!" overlay (~2s), timer pauses, shows score + streak + time added. Auto-transitions to fresh grid with new word.
- Loss: Game over screen shows score, streak, revealed word. Options: Play Again, High Scores, Quit.
- Give up: Escape → "Give up?" overlay (Y/N). Timer pauses.
- Play Again: Restarts same mode immediately.

**Persistence:**
- Config: `~/.config/schmordle/config.json` (follows XDG Base Directory Specification, directory created automatically)
- Dictionary: Embedded in binary (source at `data/dictionary.json`)
- Settings persisted between sessions

## Testing Decisions

**What makes a good test:** Only test external behavior, not implementation details. A test should verify that a module produces the correct output for a given input, not how it achieves that internally.

**Modules to test:**

1. **wordle.ts** — Most critical module. Test cases:
   - All letters absent
   - All letters correct
   - Mix of present and correct
   - Duplicate letters (e.g., guess "SPEED", hidden "CREED" — the first E should be present, the second E should be correct)
   - Edge case: letter appears in hidden word but guess has it twice (one should be present, one absent)

2. **scoring.ts** — Test cases:
   - Score calculation with various streak/remaining time combinations
   - First win (streak 1 × remaining time)
   - High streak × low time
   - Zero remaining time

3. **storage.ts** — Test cases:
   - Save and load high scores
   - Save and load settings
   - Max 10 high scores per mode enforcement
   - Score of 0 not saved
   - Config file doesn't exist yet (first launch)
   - Directory creation when it doesn't exist

4. **gameReducer.ts** — Test cases:
   - Start game for each mode
   - Submit valid guess
   - Submit invalid guess (not in dictionary)
   - Timer tick
   - Win condition
   - Loss condition (out of attempts)
   - Loss condition (out of time)
   - Give up flow
   - Streak calculation across multiple wins
   - Strictness validation (Strict mode)
   - Strictness validation (Very Strict mode)
   - Extra Challenges (Prohibit absent letters)

5. **dictionary.ts** — Test cases:
   - Random word is 5 letters
   - Valid word lookup
   - Invalid word lookup

## Out of Scope

- **Admin Mode**: Requires backend with user registration. Phase 2.
- **Multiplayer/Online**: Not in scope for Phase 1.
- **Mobile support**: Terminal-only.
- **Sound effects**: Terminal UI doesn't support audio.
- **Animations**: Terminal UI is static; overlays use simple text.

## Further Notes

- The dictionary file (`data/dictionary.json`) will be provided by the user as a JSON array of 5-letter words.
- The project uses React with OpenTUI for the terminal UI framework.
- State management uses `useReducer` (no external state libraries).
- All menus support both arrow navigation and hotkeys.
- The game is distributed as a compiled binary via `bun build --compile`. The dictionary is embedded in the binary.
