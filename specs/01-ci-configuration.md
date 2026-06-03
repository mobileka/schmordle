# For AI Agents

DO NOT read this spec, it's unfinished and confusing. I will explicitly tell you when it's ready

# CI, Release, and Changelog

## Context

Schmordle ships with no automation. Tests exist but nothing runs them. Users download source code and compile it themselves. There's no record of what changed between versions.

This spec adds three things: automated testing on every push, pre-built binaries for 6 platforms published as GitHub Releases, and a changelog that tracks what changed in each version.

## CI Workflow

File: `.github/workflows/ci.yml`

Runs on pull requests and pushes to main. Single runner: `ubuntu-latest`. Steps:

1. Install dependencies with `bun install`
2. Run tests with `bun test`
3. Verify the build compiles with `bun build --compile src/index.tsx --outfile schmordle`

No linting. No matrix across operating systems. Tests verify game logic, not OS behavior.

## Release Workflow

File: `.github/workflows/release.yml`

Triggers when you push a tag matching `v*`. Steps:

1. Validate that the tag version has a matching section in `CHANGELOG.md`. Fail the build if it doesn't.
2. Cross-compile 6 binaries from the single ubuntu runner using `bun build --compile --target`:
   - `schmordle-darwin-x64` (macOS Intel)
   - `schmordle-darwin-arm64` (macOS Apple Silicon)
   - `schmordle-linux-x64` (Linux x86_64)
   - `schmordle-linux-arm64` (Linux ARM)
   - `schmordle-windows-x64` (Windows)
   - `schmordle-windows-arm64` (Windows ARM)
3. Create a GitHub Release with the tag name.
4. Attach all 6 binaries as release assets.
5. Pull release notes from the matching `CHANGELOG.md` section.

No musl variants. Add them later if someone asks.

## Changelog

File: `CHANGELOG.md`

Uses [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format. Sections: Added, Changed, Deprecated, Removed, Fixed, Security. The release skill updates it before each tag.

## Release Skill

File: `.agents/skills/schmordle-release/SKILL.md`

The developer invokes the skill by asking for a release. The agent then:

1. Collects commits since the last tag with `git log`.
2. Reads the commit messages and determines the appropriate version bump (patch, minor, or major). The project starts at v0.x.x and stays there until the developer declares it ready for v1.
3. Generates changelog entries from the commits.
4. Writes the new version section into `CHANGELOG.md` with today's date.
5. Shows the draft changelog and proposed version to the developer for review.
6. After approval: commits the changelog, creates the tag, and pushes both. GitHub Actions handles the rest.

## Files

| Action | File | Purpose |
|--------|------|---------|
| Create | `.github/workflows/ci.yml` | Test and build verification |
| Create | `.github/workflows/release.yml` | Binary compilation and GitHub Release |
| Create | `CHANGELOG.md` | Version history |
| Create | `.agents/skills/schmordle-release/SKILL.md` | Release instructions for AI agents |
| Modify | `.gitignore` | Add `schmordle-*` to ignore local binaries |
