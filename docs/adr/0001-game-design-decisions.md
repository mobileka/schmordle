# Game design decisions

Summary of decisions made during the initial design grilling session.

## Grid and attempts

- 5 letters wide, 6 rows (attempts). Always 6 regardless of game mode.

## Scoring

- Streak is bumped *before* the score is calculated for each win.
- Formula: `Score += Streak * Remaining seconds`.
- First win is worth `1 * remaining seconds` (not 0).

## Removed features

- **Punish out of dictionary guesses**: Removed entirely. Invalid words are just communicated to the user.
- **High score filters**: Removed from the High Scores screen. Too heavy for the UI.
- **Admin Mode**: Deferred to Phase 2. Requires backend with user registration.

## Game flow

- **Win**: Brief "Correct!" overlay (~2s), timer pauses, shows score + streak + time added. Auto-transitions to fresh grid with new word. No keypress required.
- **Loss (attempts/time)**: Game over screen shows score, streak, revealed word. Options: Play Again, High Scores, Quit. Waits for user input.
- **Give up**: Escape key triggers "Give up?" confirmation overlay (Y/N). Timer pauses while overlay is visible.
- **Play Again**: Restarts the same game mode immediately (no return to mode selection).

## UI layout

- **Timer**: Top-right corner of the screen.
- **Streak**: Next to the timer in the top-right (e.g., `Streak: 3  ⏱ 02:34`).
- **Keyboard**: Virtual QWERTY below the grid, colored by letter state. Updates only after submitting a guess (not while typing).
- **Menus**: Arrow navigation + hotkeys for all menus and selections.

## First launch flow

1. Splash/title screen with "SCHMORDLE" branding
2. Username prompt (one-time, stored in config)
3. Main menu

Subsequent launches skip to main menu.

## Persistence

- **Config**: `~/.schmordle/config.json` for high scores + settings.
- **Dictionary**: `data/dictionary.json` (bundled JSON array, user provides the file).
- **Settings**: Strictness, extra challenges, and username are persisted between sessions.

## Custom mode

- Only has a timer toggle + free-form seconds input.
- No high scores recorded.
- Strictness and extra challenges are global settings that apply to all modes (including Custom).

## High scores table

- Tabs for each mode (Relaxed, Normal, Hard, Insane). No Zen or Custom.
- Columns: Rank, UserName, Score, Date, Extra Challenges.
- Extra Challenges shows full name (e.g., "Prohibit Absent") or "None".
- Max 10 high scores per mode per user. Score of 0 is never saved.
