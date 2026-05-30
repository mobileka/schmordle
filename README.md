# Schmordle

A terminal Wordle game with multiple difficulty modes, scoring, and persistent high scores.

## Game Modes

- **Zen** — No timer, no score. Play at your own pace.
- **Relaxed** — 5-minute timer. Build streaks without rush.
- **Normal** — 3-minute timer. The standard challenge.
- **Hard** — 90-second timer. Quick thinking required.
- **Insane** — 30-second timer. Pure reflex.
- **Custom** — Set your own timer duration, or turn it off entirely.

## How It Works

You get 6 attempts to guess a 5-letter word. After each guess, letters turn:
- **Green** — correct letter, correct position
- **Orange** — correct letter, wrong position
- **Grey** — letter not in the word

Score = Streak × Remaining seconds. The streak bumps before the score calculates, so your first win earns points. In timed modes, a correct guess adds 5 minutes to the clock.

## Strictness Levels

- **Relaxed** — No restrictions on guesses.
- **Strict** — Your guess must include all revealed present and correct letters.
- **Very Strict** — Correct letters must stay in their positions.

You can also enable "Prohibit known absent letters" to block guesses that reuse letters you've already ruled out. This resets each round.

## Controls

- Type letters to fill the grid
- **Enter** — submit guess
- **Backspace** — delete last letter
- **Escape** — give up (with confirmation)
- Arrow keys and hotkeys navigate menus

## Installation

Build the binary:

```sh
bun build --compile src/index.tsx --outfile schmordle
```

Run it:

```sh
./schmordle
```

The dictionary (`data/dictionary.json`) gets embedded in the binary. Your config and high scores live at `~/.config/schmordle/config.json`.

## Development

```sh
bun install
bun run dev
```

## Tech Stack

- [OpenTUI](https://opentui.com) + React for the terminal UI
- `useReducer` for state management
- `bun build --compile` for binary distribution

## License

This project is licensed under the [MIT License](LICENSE).
