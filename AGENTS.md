# Agents

## First things first

- Read `CONTEXT.md`, `docs/`, `spec/`, `.agents/`
- Get familiar with everything in the .agents/ directory, especially opentui docs

## Suggested Skills

- **tdd** — Every issue must follow red-green-refactor
- **caveman** — Keep responses terse
- **opentui** — Reference for React bindings, components, layout
- **stop-slop** — For any prose/docs work

## Critical Rules

- Never commit or push the code unless explicitly asked by the user
- Use commit messages without any prefixes (e.g churn:, feat:, and so on)
- Commit messages should be concise and in present tense. Correct: Add index.ts, Wrong: Added index.ts
- One GitHub issue = one PR = one branch
- Unless instructed otherwise, stick to GitHub issue order
- Use `tdd`
- When writing documentation, use `stop-slop` and don't use `caveman`
- In all other cases use `caveman` unless instructed otherwise

## Other

- Run tests with: `~/.bun/bin/bun test`
- Run app with: `~/.bun/bin/bun run src/index.tsx`
