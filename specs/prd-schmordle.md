# Schmordle — Terminal Wordle Game

## Problem Statement

I want to play a Wordle-like game in my terminal with multiple difficulty modes, scoring, and persistent high scores — without needing a browser or mobile app.

## Solution

A terminal-based Wordle clone built with OpenTUI and React, compiled to a standalone binary. The game features 6 game modes (Zen, Relaxed, Normal, Hard, Insane, Custom), a scoring system based on streaks and remaining time, persistent high scores, configurable strictness levels, and an optional "Prohibit known absent letters" challenge.

## User Stories

1. As a player, I want to see a splash screen with "SCHMORDLE" branding on first launch, so that I know the game has started.
2. As a player, I want to be prompted for a username on first launch, so that my high scores are identified.
3. As a player, I want my username to be stored in a config file, so that I don't have to enter it every time.
4. As a player, I want to change my username in Settings, so that I can fix typos or rebrand.
5. As a player, I want to see a main menu with game mode options, so that I can choose how to play.
6. As a player, I want to navigate menus with arrow keys AND hotkeys, so that I can use whichever input method I prefer.
7. As a player, I want to select Zen mode, so that I can play without timers or scoring pressure.
8. As a player, I want to select Relaxed mode, so that I have 5 minutes to guess and can build streaks.
9. As a player, I want to select Normal mode, so that I have 3 minutes to guess.
10. As a player, I want to select Hard mode, so that I have only 90 seconds to guess.
11. As a player, I want to select Insane mode, so that I have only 30 seconds to guess.
12. As a player, I want to select Custom mode, so that I can set my own timer duration.
13. As a player, I want to toggle the timer on/off in Custom mode, so that I can play with or without time pressure.
14. As a player, I want to input a custom time in seconds in Custom mode, so that I can set my own difficulty.
15. As a player, I want to see a 5×6 grid when the game starts, so that I have 6 attempts to guess the 5-letter word.
16. As a player, I want to type a 5-letter word and press Enter to submit my guess, so that I can play the game.
17. As a player, I want to see each letter colored grey (absent), orange (present), or green (correct) after submitting a guess, so that I know which letters are in the word and where.
18. As a player, I want to see a virtual QWERTY keyboard below the grid, so that I can track which letters I've already used.
19. As a player, I want the keyboard to update letter colors only after submitting a guess (not while typing), so that the feedback matches Wordle's behavior.
20. As a player, I want to see my remaining time in the top-right corner, so that I can manage my time.
21. As a player, I want to see my current streak next to the timer, so that I can track my progress.
22. As a player, I want to see an error message when I submit a word not in the dictionary, so that I know to try a different word.
23. As a player, I want to see a brief "Correct!" overlay when I guess the word, so that I get feedback on my success.
24. As a player, I want the "Correct!" overlay to show my score and streak, so that I can see my progress.
25. As a player, I want the timer to pause while the "Correct!" overlay is visible, so that I'm not penalized for watching the feedback.
26. As a player, I want the game to automatically pick a new word after the "Correct!" overlay, so that I can keep playing in timed modes.
27. As a player, I want my streak to increase by 1 after each correct guess, so that I can build a combo.
28. As a player, I want 5 minutes added to my timer after each correct guess in timed modes, so that I have more time for the next word.
29. As a player, I want my score to be calculated as `Streak × Remaining seconds`, so that faster guesses earn more points.
30. As a player, I want the streak to be bumped BEFORE the score is calculated, so that my first win earns points.
31. As a player, I want to see a game over screen when I run out of attempts or time, so that I know the game is over.
32. As a player, I want the game over screen to show my score, streak, and the hidden word, so that I can learn from my mistakes.
33. As a player, I want to press Escape to give up during a round, so that I can exit early.
34. As a player, I want a "Give up?" confirmation overlay when I press Escape, so that I don't accidentally quit.
35. As a player, I want the timer to pause while the "Give up?" overlay is visible, so that I'm not penalized for considering my options.
36. As a player, I want to press Y to confirm giving up or N/Esc to cancel, so that I have clear controls.
37. As a player, I want to see Play Again, High Scores, and Quit options on the game over screen, so that I can decide what to do next.
38. As a player, I want Play Again to restart the same game mode immediately, so that I can keep my momentum.
39. As a player, I want to access Settings from the main menu, so that I can configure the game.
40. As a player, I want to set Strictness to Relaxed (default), Strict, or Very Strict, so that I can control guess validation.
41. As a player, I want Strict mode to require all revealed present and correct letters in my next guess, so that the game is more challenging.
42. As a player, I want Very Strict mode to require correct letters to stay in their positions, so that the game is even more challenging.
43. As a player, I want to enable "Prohibit known absent letters" as an Extra Challenge, so that I can't reuse letters I know are wrong.
44. As a player, I want the absent letter prohibition to reset between rounds, so that each word is a fresh challenge.
45. As a player, I want my settings to be persisted between sessions, so that I don't have to reconfigure every time.
46. As a player, I want to access High Scores from the main menu, so that I can see my best games.
47. As a player, I want to see high scores organized by game mode tabs (Relaxed, Normal, Hard, Insane), so that I can compare like with like.
48. As a player, I want to see Rank, UserName, Score, Date, and Extra Challenges in the high scores table, so that I have full context for each score.
49. As a player, I want Extra Challenges to show full names (e.g., "Prohibit Absent") or "None", so that the column is readable.
50. As a player, I want a maximum of 10 high scores per mode, so that the table stays manageable.
51. As a player, I want scores of 0 to never be saved, so that the table only shows meaningful achievements.
52. As a player, I want my high scores to be saved to `~/.schmordle/config.json`, so that they persist between sessions.
53. As a player, I want to run a single binary to play the game, so that I don't need to install Bun or clone the repo.

## Implementation Decisions

**Distribution**: Compiled to a standalone binary via `bun build --compile`. Platform-specific (compile per target). The dictionary is embedded in the binary at build time.

**Modules to build:**

1. **wordle.ts** — Letter evaluation logic. Pure function: `(guess: string, hiddenWord: string) → LetterState[]`. Handles duplicate letters correctly (a letter that appears once in the hidden word should only be marked "correct" or "present" once).

2. **scoring.ts** — Score calculation. Pure function: `(streak: number, remainingSeconds: number) → number`. Formula: `streak * remainingSeconds`.

3. **dictionary.ts** — Dictionary loading. Imports `data/dictionary.json` directly (Bun bundles it at build time). Provides `getRandomWord()` and `isValidWord(word)`.

4. **storage.ts** — Config persistence. Read/write to `~/.schmordle/config.json`. Handles high scores (per mode, max 10 per user) and settings (strictness, extra challenges, username).

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
- Config: `~/.schmordle/config.json` (persists across binary reinstalls)
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
