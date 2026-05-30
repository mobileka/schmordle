Schmordle is a terminal-based Wordle-like game built with OpenTUI and React.

## Language

**Dictionary**:
A JSON array of 5-letter words embedded in the binary at build time (source at `data/dictionary.json`). Loaded into memory at startup.
_Avoid_: word list, word bank

**Username**:
A display name prompted on first launch, stored in the config file, and changeable in Settings.
_Avoid_: player name, display name

**Config**:
A local JSON file at `~/.config/schmordle/config.json` that persists high scores and settings between sessions. The directory is created automatically if it doesn't exist.
_Avoid_: save file, preferences

**Strictness**:
A global setting (Relaxed, Strict, Very Strict) that restricts which guesses are valid. Applies to all game modes.
_Avoid_: difficulty, restriction level

**Extra Challenges**:
Optional global toggles that add additional restrictions to gameplay. Currently only "Prohibit known absent letters."
_Avoid_: modifiers, handicaps

**Streak**:
The number of consecutive words the player has guessed correctly in the current session. Bumped before scoring on each win. Resets to 0 on loss.
_Avoid_: combo, chain

## The basic gameplay

We have a 5 x 6 grid (5 letters wide, 6 rows for attempts), a dictionary and a hidden word randomly picked from the dictionary.

A user types in a word and presses Enter.
If the word is not in the dictionary, we just communicate it to the user.
If the word is in the dictionary, we go through each letter one by one and assign a state to each letter:

- absent – the letter is not present in the hidden word
- present – the letter is present in the hidden word but the positions don't match
- correct – the letter is present in the hidden word and the positions are correct.

Let's take a look at an example. If the hidden word is AUDIO and the user types-in RADIO, we generate the following result

R ->  absent  <-  A
A ->  present <-  U
D ->  correct <-  D
I ->  correct <-  I
O ->  correct <-  O

If the letter is `absent`, its background stays grey, if it's `present` –> orange, and `correct` -> green.

Once we marked the letters with the right color, we proceed to the next guess (line two of the grid) and repeat the process until one of the following outcomes:

1. the user gives up by pressing a dedicated button (status: lost)
2. the user runs out of attempts (status: lost)
3. [in certain game modes] the user runs out of time (status: lost)
4. the user guesses the word (status: won)

## Additional features

### Game modes

The user can select multiple game modes before starting:

- Zen
- Relaxed
- Normal
- Hard
- Insane
- Custom

#### Zen Mode

Zen mode is designed to be chill. No pressure, no timers and no score tracking.
Once the user loses or wins, they simply press Play again or Exit.

#### Relaxed

Relaxed gives the user 5 minutes to guess the word and is the first game mode that counts the scores.
If the user guesses the word correctly:

- the game automatically picks another random word
- adds +1 to the user's streak (it starts at 0)
- adds 5 more minutes to their timer

The game continues until the user loses or gives up.

Once the user gives up:

- If the user's score is higher that the current high score _for the same game mode_, it saves it to the list of high scores, and congratulates the user.
- Otherwise, it just shows the user's final score and allows them to Quit, Play Again or check the High Scores.

#### Normal

In normal mode, everything is the same as in Relaxed mode, but the user gets 3 minutes to guess the word.

#### Hard

In hard mode, everything is the same as in Relaxed and Normal mode, but the user gets 90 seconds to guess the word.

#### Insane

In insane mode, everything is the same as in Relaxed, Normal and Hard mode, but the user gets only 30 seconds to guess the word.

#### Custom

In custom mode, the user can set the following settings:

[] Enable timer
  When selected, the user can input the time in seconds (e.g. 60)

No high scores should be recorded in this mode.

##### Admin Mode

Admin Mode is a Phase 2 feature and should not be implemented initially. It requires a backend system with user registration and sign-in.

### Scoring system

The formula of the score is as follows:

`Score += Streak * {Remaining time in seconds when the user guesses the word}`

The streak is 0 by default. When the user guesses a word correctly, the streak is bumped *before* the score is calculated.

If the user plays in `Relaxed Mode` and they guessed the word when they still had 30 seconds, their streak gets bumped to 1, so their total score is 1 * 30.

We add 5 more minutes to their timer, so the total time they have to guess the second word is 30 + 5 * 60 = 330 seconds.

Let's say the guessed the second word in 30 seconds, so they still had 300 seconds left.

The total score will be 30 (their score from the first round) + 2 (their new streak) * 300 = 630.

### High Scores

High scores should have their dedicated page.

At the top of that page, there are tabs matching the Game Modes (but no Zen and no Custom because we don't save scores in these modes).

Once the Game Mode is picked, the user sees the list of high scores in a table:

Rank | UserName | Score | Date | Extra Challenges

Extra Challenges shows the full name of any active challenges (e.g., "Prohibit Absent") or "None" if no challenges were enabled.

No more than 10 high scores per game mode per user.
0 is not a high score and should never be saved.

### Settings

Settings are global (apply to all game modes) and persisted to the config file between sessions. The Settings screen also allows changing the username.

Strictness level:

  (*) Relaxed (default) - no restrictions on guessing the next word
  () Strict – user is only allowed to guess words which contain already revealed `present` and `correct` letters.
    For example, from our example with AUDIO being hidden and RADIO being the first guess, the next word of the user must contain all of the following letters: [A, D, I, O]. The position doesn't matter.
  () Very Strict - Strict mode + the `correct` letters must stay in their positions.
    Meaning that from our example with AUDIO and RADIO, the every following guess should end with "DIO", because all these letters have the `correct` status.

Extra Challenges:
  [] Prohibit known absent letters - if the letter has been absent once, the user can no longer use it.
    From our example above, the next guess of the user can't contain the letter R because we know it's absent.
    This restriction resets each time the user guesses a word correctly and proceeds to the next round.

Please note the difference between checkboxes (`[]`) and radio buttons (`()` and `(*)`).
